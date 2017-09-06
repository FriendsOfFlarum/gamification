<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\gamification\Listeners;

use DateTime;
use Flarum\Core\Exception\FloodingException;
use Flarum\Core\Notification;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Event\PostWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasDownvoted;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Notification\DownvotedBlueprint;
use Reflar\gamification\Notification\UpvotedBlueprint;
use Reflar\gamification\Gamification;
use Reflar\gamification\Rank;
use Reflar\gamification\Vote;

class SaveVotesToDatabase
{
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

    public function __construct(Dispatcher $events, NotificationSyncer $notifications, Gamification $gamification)
    {
        $this->events = $events;
        $this->notifications = $notifications;
        $this->gamification = $gamification;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWillBeSaved::class, [$this, 'whenPostWillBeSaved']);
        $events->listen(PostWasDeleted::class, [$this, 'whenPostWasDeleted']);
    }

    /**
     * @param PostWillBeSaved $event
     */
    public function whenPostWillBeSaved(PostWillBeSaved $event)
    {
        $post = $event->post;
        $data = $event->data;
        $actor = $event->actor;
        $user = $post->user;

        $this->assertNotFlooding($actor);

        $isUpvoted = false;
        $isDownvoted = false;

        if ($data['attributes']['isUpvoted']) {
            $isUpvoted = true;
        }

        if ($data['attributes']['isDownvoted']) {
            $isDownvoted = true;
        }

        $this->vote($post, $isDownvoted, $isUpvoted, $actor, $user);
    }

    public function vote($post, $isDownvoted, $isUpvoted, $actor, $user)
    {
        $discussion = $post->discussion;

        $vote = Vote::where([
            'post_id' => $post->id,
            'user_id' => $user->id,
        ])->first();

        if ($vote) {
            if (!$isUpvoted && !$isDownvoted) {
                if ($vote->type == 'Up') {
                    $user->decrement('votes');

                    if ($post->number == 1) {
                        $discussion->decrement('votes');
                    }
                } else {
                    $user->increment('votes');

                    if ($post->number == 1) {
                        $discussion->increment('votes');
                    }
                }
                $this->checkDownUserVotes($user);
                $vote->delete();
            } elseif ($vote->type == 'Up') {
                $vote->type = 'Down';

                $user->votes = $user->votes - 2;

                if ($post->number == 1) {
                    $discussion->votes = $discussion->votes - 2;
                }

                $this->sendDownvotedData($post, $user, $actor);
            } elseif ($vote->type == 'Down') {
                $vote->type = 'Up';

                $user->votes = $user->votes + 2;

                if ($post->number == 1) {
                    $discussion->votes = $discussion->votes + 2;
                }

                $this->sendUpvotedData($post, $user, $actor);
            }

            $vote->time = new DateTime();
        } elseif ($isDownvoted) {
            $vote = Vote::build($post, $actor, 'Down');

            $user->decrement('votes');

            if ($post->number == 1) {
                $discussion->decrement('votes');
            }

            $this->sendDownvotedData($post, $user, $actor);
        } elseif ($isUpvoted) {
            $vote = Vote::build($post, $actor, 'Up');

            $user->increment('votes');

            if ($post->number == 1) {
                $discussion->increment('votes');
            }

            $this->sendUpvotedData($post, $user, $actor);
        }
        $actor->last_vote_time = new DateTime();
        $actor->save();

        $user->save();
        $discussion->save();
        $post->save();
        $vote->save();
        $this->gamification->calculateHotness($post->discussion);
    }

    /**
     * @param $user
     */
    private function checkUpUserVotes($user)
    {
        $ranks = Rank::where('points', '<=', $user->votes)->get();

        if ($ranks !== null) {
            $user->ranks()->detach();
            foreach ($ranks as $rank) {
                $user->ranks()->attach($rank->id);
            }
        }
    }

    public function sendDownvotedData($post, $user, $actor)
    {
        $oldVote = Notification::where([
            'data' => $actor->id,
            'subject_id' => $post->id,
            'type' => 'upvoted',
        ])->first();

        if ($oldVote !== null) {
            $oldVote->type = 'downvoted';
            $oldVote->save();
        } elseif ($user->id !== $actor->id) {
            $this->notifications->sync(
                new DownvotedBlueprint($post, $actor, $user),
                [$user]);
        }

        $this->events->fire(
            new PostWasUpvoted($post, $user, $actor)
        );

        $this->checkDownUserVotes($user);
    }

    public function sendUpvotedData($post, $user, $actor)
    {
        $oldVote = Notification::where([
            'data' => $actor->id,
            'subject_id' => $post->id,
            'type' => 'downvoted',
        ])->first();

        if ($oldVote !== null) {
            $oldVote->type = 'upvoted';
            $oldVote->save();
        } elseif ($user->id !== $actor->id) {
            $this->notifications->sync(
                new UpvotedBlueprint($post, $actor, $user),
                [$user]);
        }

        $this->events->fire(
            new PostWasDownvoted($post, $user, $actor)
        );

        $this->checkUpUserVotes($user);
    }

    /**
     * @param $user
     */
    private function checkDownUserVotes($user)
    {
        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if ($ranks !== null) {
            foreach ($ranks as $rank) {
                $user->ranks()->detach($rank->id);
            }
        }
    }

    /**
     * @param $user
     *
     * @throws FloodingException
     */
    public function assertNotFlooding($actor)
    {
        if (new DateTime($actor->last_vote_time) >= new DateTime('-10 seconds')) {
            throw new FloodingException();
        }
    }
}
