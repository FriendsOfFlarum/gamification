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

use Flarum\Core\Post\Floodgate;
use Flarum\Event\PostWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasDownvoted;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Repository\Gamification;

class SaveVotesToDatabase
{
    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var Gamification
     */
    protected $gamification;
  
    /**
     * @var FloodGate
     */
    protected $floodgate;

    public function __construct(Gamification $gamification, Dispatcher $events, FloodGate $floodgate)
    {
        $this->gamification = $gamification;
        $this->events = $events;
        $this->floodgate = $floodgate;
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
        $discussion = $post->discussion;
      
        $this->floodgate->assertNotFlooding($actor);

        if (isset($data['attributes']['isUpvoted'])) {
            $isUpvoted = $data['attributes']['isUpvoted'];
        } else {
            $isUpvoted = false;
        }

        if (isset($data['attributes']['isDownvoted'])) {
            $isDownvoted = $data['attributes']['isDownvoted'];
        } else {
            $isDownvoted = false;
        }

        if ($post->exists) {
            $vote = $this->gamification->findVote($post->id, $actor->id);

            if (isset($vote)) {
                if ($isUpvoted == false && $isDownvoted == false) {
                    if ($vote->type == 'Up') {
                        $post->user->decrement('votes');

                        if ($post->number == 1) {
                            $discussion->decrement('votes');
                        }

                        $this->events->fire(
                            new PostWasDownvoted($post, $user, $actor)
                        );
                    } else {
                        $post->user->increment('votes');

                        if ($post->number == 1) {
                            $discussion->increment('votes');
                        }

                        $this->events->fire(
                            new PostWasUpvoted($post, $user, $actor)
                        );
                    }
                    $vote->delete();
                } elseif ($vote->type == 'Up') {
                    $vote->type = 'Down';

                    $vote->save();

                    $post->user->votes = $post->user->votes - 2;

                    if ($post->number == 1) {
                        $discussion->votes = $discussion->votes - 2;
                    }

                    $this->events->fire(
                            new PostWasDownvoted($post, $user, $actor)
                        );
                } elseif ($vote->type == 'Down') {
                    $vote->type = 'Up';

                    $vote->save();

                    $post->user->votes = $post->user->votes + 2;

                    if ($post->number == 1) {
                        $discussion->votes = $discussion->votes + 2;
                    }

                    $this->events->fire(
                            new PostWasUpvoted($post, $user, $actor)
                        );
                }
            } elseif ($isDownvoted == true) {
                $this->gamification->downvote($post->id, $actor);

                $post->user->decrement('votes');

                if ($post->number == 1) {
                    $discussion->decrement('votes');
                }

                $this->events->fire(
                    new PostWasDownvoted($post, $user, $actor)
                );
            } elseif ($isUpvoted == true) {
                $this->gamification->upvote($post->id, $actor);

                $post->user->increment('votes');

                if ($post->number == 1) {
                    $discussion->increment('votes');
                }

                $this->events->fire(
                    new PostWasUpvoted($post, $user, $actor)
                );
            }
            $this->gamification->calculateHotness($post->discussion);
        }
    }
}
