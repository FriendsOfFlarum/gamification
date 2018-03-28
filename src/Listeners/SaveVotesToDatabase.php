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

namespace Reflar\Gamification\Listeners;

use DateTime;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\FloodingException;
use Flarum\Core\Notification;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Event\PostWillBeSaved;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Pusher;
use Reflar\Gamification\Events\PostWasVoted;
use Reflar\Gamification\Gamification;
use Reflar\Gamification\Notification\VoteBlueprint;
use Reflar\Gamification\Rank;
use Reflar\Gamification\Vote;

class SaveVotesToDatabase
{
    use AssertPermissionTrait;

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
        if ($post->id) {
            $data = $event->data;

            if (array_key_exists(2, $data['attributes'])) {
                $actor = $event->actor;
                $user = $post->user;

                $this->assertCan($actor, 'vote', $post->discussion);
                // $this->assertNotFlooding($actor);

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
                if ('Up' == $vote->type) {
                    $this->changePoints($user, $post, -1);
                    $this->pushNewVote('up2none', $post, 'up', $actor);
                } else {
                    $this->changePoints($user, $post, 1);
                    $this->pushNewVote('down2none', $post, 'down', $actor);
                }
                $this->sendData($post, $user, $actor, 'None', $vote->type);
                $vote->delete();
            } else {
                if ('Up' == $vote->type) {
                    $vote->type = 'Down';
                    $this->changePoints($user, $post, -2);
                    $this->pushNewVote('up2down', $post, 'down', $actor);

                    $this->sendData($post, $user, $actor, 'Down', 'Up');
                } else {
                    $vote->type = 'Up';
                    $this->changePoints($user, $post, 2);
                    $this->pushNewVote('down2up', $post, 'up', $actor);

                    $this->sendData($post, $user, $actor, 'Up', 'Down');
                }
                $vote->save();
            }
        } else {
            $vote = Vote::build($post, $actor);
            if ($isDownvoted) {
                $vote->type = 'Down';
                $this->changePoints($user, $post, -1);
                $this->pushNewVote('none2down', $post, 'down', $actor);
            } elseif ($isUpvoted) {
                $vote->type = 'Up';
                $this->changePoints($user, $post, 1);
                $this->pushNewVote('none2up', $post, 'up', $actor);
            }
            $this->sendData($post, $user, $actor, $vote->type, ' ');
            $vote->save();
        }
        $actor->last_vote_time = new DateTime();
        $actor->save();
    }

    /**
     * @param $user
     * @param $post
     * @param $number
     */
    public function changePoints($user, $post, $number)
    {
        $user->votes = $user->votes + $number;
        $discussion = $post->discussion;

        if (1 == $post->number) {
            $discussion->votes = $discussion->votes + $number;
            $discussion->save();
            $this->gamification->calculateHotness($discussion);
        }
        $post->save();
        $user->save();
    }

    /**
     * @param $post
     * @param $user
     * @param $actor
     * @param $type
     */
    public function sendData($post, $user, $actor, $type, $before)
    {
        $oldVote = Notification::where([
            'sender_id'  => $actor->id,
            'subject_id' => $post->id,
            'data'       => '"'.$before.'"',
        ])->first();

        if ($oldVote) {
            if ('None' === $type) {
                $oldVote->delete();
            } else {
                $oldVote->data = $type;
                $oldVote->save();
            }
        } elseif ($user->id !== $actor->id) {
            $this->notifications->sync(
                new VoteBlueprint($post, $actor, $type),
                [$user]);
        }

        $this->events->fire(
            new PostWasVoted($post, $user, $actor, $type)
        );

        if ('Up' === $type) {
            $ranks = Rank::where('points', '<=', $user->votes)->get();

            if (null !== $ranks) {
                $user->ranks()->detach();
                foreach ($ranks as $rank) {
                    $user->ranks()->attach($rank->id);
                }
            }
        } elseif ('Down' === $type) {
            $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

            if (null !== $ranks) {
                foreach ($ranks as $rank) {
                    $user->ranks()->detach($rank->id);
                }
            }
        }
    }

    public function pushNewVote($type, $post, $clicked, $actor)
    {
        $type = explode('2', $type);

        $pusher = $this->getPusher();
        $pusher->trigger('public', 'newVote', [
            'postId'  => $post->id,
            'before'  => $type[0],
            'after'   => $type[1],
            'clicked' => $clicked,
            'userId'  => $actor->id,
        ]);
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

    /**
     * @return Pusher
     */
    protected function getPusher()
    {
        $options = [];
        if ($cluster = $this->settings->get('flarum-pusher.app_cluster')) {
            $options['cluster'] = $cluster;
        }

        return new Pusher(
            $this->settings->get('flarum-pusher.app_key'),
            $this->settings->get('flarum-pusher.app_secret'),
            $this->settings->get('flarum-pusher.app_id'),
            $options
        );
    }
}
