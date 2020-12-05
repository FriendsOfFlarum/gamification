<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Listeners;

use Carbon\Carbon;
use Flarum\Foundation\DispatchEventsTrait;
use Flarum\Notification\Notification;
use Flarum\Notification\NotificationSyncer;
use Flarum\Post\Event\Saving;
use Flarum\Post\Exception\FloodingException;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Gamification\Events\PostWasVoted;
use FoF\Gamification\Gamification;
use FoF\Gamification\Notification\VoteBlueprint;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;
use Illuminate\Contracts\Events\Dispatcher;
use Pusher;

class SaveVotesToDatabase
{
    use DispatchEventsTrait;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param Dispatcher                  $events
     * @param NotificationSyncer          $notifications
     * @param Gamification                $gamification
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(Dispatcher $events, NotificationSyncer $notifications, Gamification $gamification, SettingsRepositoryInterface $settings)
    {
        $this->events = $events;
        $this->notifications = $notifications;
        $this->gamification = $gamification;
        $this->settings = $settings;
    }

    /**
     * @param Saving $event
     *
     * @throws FloodingException
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    public function handle(Saving $event)
    {
        $post = $event->post;
        if ($post->id) {
            $data = $event->data;

            if (array_key_exists(2, $data['attributes'])) {
                $actor = $event->actor;
                $user = $post->user;

                $actor->assertCan('vote', $post);

                if ($this->settings->get('fof-gamification.rateLimit')) {
                    $this->assertNotFlooding($actor);
                }

                $isUpvoted = $data['attributes'][0];

                $isDownvoted = $data['attributes'][1];

                $this->vote($post, $isDownvoted, $isUpvoted, $actor, $user);
            }
        }
    }

    public function vote($post, $isDownvoted, $isUpvoted, $actor, $user)
    {
        $vote = Vote::where([
            'post_id' => $post->id,
            'user_id' => $actor->id,
        ])->first();

        if ($vote) {
            if (!$isUpvoted && !$isDownvoted) {
                $vote->value = 0;

                $vote->delete();
            } else {
                if ($vote->isUpvote()) {
                    $vote->value = -1;
                } else {
                    $vote->value = 1;
                }

                $vote->save();
            }
        } else {
            $vote = Vote::build($post, $actor);

            if ($isDownvoted) {
                $vote->value = -1;
            } elseif ($isUpvoted) {
                $vote->value = 1;
            }

            $vote->save();
        }

        $this->pushNewVote($vote);

        $this->updatePoints($user, $post);

        $this->sendData($vote);

        $actor->last_vote_time = Carbon::now();
        $actor->save();
    }

    /**
     * @param $user
     * @param $post
     */
    public function updatePoints(?User $user, Post $post)
    {
        if ($user) {
            Vote::updateUserVotes($user)->save();
        }

        $discussion = $post->discussion;

        if ($post->id === $discussion->first_post_id) {
            $this->gamification->calculateHotness(
                Vote::updateDiscussionVotes($discussion)
            );
        }
    }

    public function sendData(Vote $vote)
    {
        $post = $vote->post;
        $user = $post->user;

        $notif = Notification::query()->where([
            'from_user_id'  => $vote->user->id,
            'type'          => 'vote',
            'subject_id'    => $post->id,
        ])->first();

        if ($notif) {
            if ($vote->value === 0) {
                $notif->delete();
            } else {
                $notif->data = $vote->value;
                $notif->save();
            }
        } elseif ($user && $user->id !== $vote->user->id && $vote->value !== 0) {
            $this->notifications->sync(
                new VoteBlueprint($vote),
                [$user]
            );
        }

        $this->events->dispatch(
            new PostWasVoted($vote)
        );

        if ($user) {
            $ranks = Rank::where('points', '<=', $user->votes)->pluck('id');

            $user->ranks()->sync($ranks);
        }
    }

    public function pushNewVote(Vote $vote)
    {
        if (app()->bound(Pusher::class)) {
            app()->make(Pusher::class)->trigger('public', 'newVote', [
                'post_id'  => $vote->post->id,
                'user_id'  => $vote->user->id,
                'votes'    => $vote->post->votes()->sum('value'),
            ]);
        }
    }

    /**
     * @param $user
     *
     * @throws FloodingException
     */
    public function assertNotFlooding($actor)
    {
        if ($actor->last_vote_time !== null && Carbon::parse($actor->last_vote_time)->greaterThanOrEqualTo(Carbon::now()->subSeconds(10))) {
            throw new FloodingException();
        }
    }
}
