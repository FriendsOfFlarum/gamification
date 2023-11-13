<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Listeners;

use Carbon\Carbon;
use Flarum\Foundation\DispatchEventsTrait;
use Flarum\Post\Event\Saving;
use Flarum\Post\Exception\FloodingException;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Gamification\Events\PostWasVoted;
use FoF\Gamification\Events\UserPointsUpdated;
use FoF\Gamification\Gamification;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Pusher;

class SaveVotesToDatabase
{
    use DispatchEventsTrait;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Container
     */
    protected $container;

    /**
     * @param Dispatcher                  $events
     * @param Gamification                $gamification
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(Dispatcher $events, Gamification $gamification, SettingsRepositoryInterface $settings, Container $container)
    {
        $this->events = $events;
        $this->gamification = $gamification;
        $this->settings = $settings;
        $this->container = $container;
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
        if ($post->exists()) {
            $data = Arr::get($event->data, 'attributes', []);

            if (Arr::exists($data, 2) && Arr::get($data, 2) === 'vote') {
                $actor = $event->actor;
                $user = $post->user;

                $actor->assertCan('vote', $post);

                if ($this->settings->get('fof-gamification.rateLimit')) {
                    $this->assertNotFlooding($actor);
                }

                $isUpvoted = Arr::get($data, 0, false);

                $isDownvoted = Arr::get($data, 1, false);

                $this->vote($post, $isDownvoted, $isUpvoted, $actor, $user);
            }
        }
    }

    public function vote(Post $post, bool $isDownvoted, bool $isUpvoted, User $actor, User $user)
    {
        $vote = Vote::build($post, $actor);

        if (!$isDownvoted && !$isUpvoted) {
            $vote->value = 0;
        } else {
            if ($isUpvoted) {
                $vote->value = 1;
            } else {
                $vote->value = -1;
            }
        }

        $vote->save();

        $this->pushNewVote($vote);

        $this->updatePoints($user, $post);

        if ($voteUser = $vote->post->user) {
            $ranks = Rank::where('points', '<=', $voteUser->votes)->pluck('id');

            $voteUser->ranks()->sync($ranks);
        }

        $actor->last_vote_time = Carbon::now();
        $actor->save();

        $this->events->dispatch(
            new PostWasVoted($vote)
        );
    }

    /**
     * @param $user
     * @param $post
     */
    public function updatePoints(?User $user, Post $post)
    {
        if ($user) {
            $user = Vote::updateUserVotes($user);
            $user->save();

            $this->events->dispatch(new UserPointsUpdated($user));
        }

        $discussion = $post->discussion;

        if ($post->id === $discussion->first_post_id) {
            $this->gamification->calculateHotness(
                Vote::updateDiscussionVotes($discussion)
            );
        }
    }

    public function pushNewVote(Vote $vote)
    {
        if ($this->container->bound(Pusher::class)) {
            $this->container->make(Pusher::class)->trigger('public', 'newVote', [
                'post_id' => $vote->post->id,
                'user_id' => $vote->user->id,
                'votes'   => $vote->post->votes()->sum('value'),
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
