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

use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWasPosted;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Notification\RankupBlueprint;
use Reflar\gamification\Gamification;

class EventHandlers
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param NotificationSyncer          $notifications
     */
    public function __construct(SettingsRepositoryInterface $settings, NotificationSyncer $notifications, Gamification $gamification)
    {
        $this->settings = $settings;
        $this->notifications = $notifications;
        $this->gamification = $gamification;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWasUpvoted::class, [$this, 'checkUser']);
        $events->listen(PostWasPosted::class, [$this, 'addVote']);
        $events->listen(PostWasDeleted::class, [$this, 'removeVote']);
    }

    /**
     * @param PostWasUpvoted $event
     */
    public function checkUser(PostWasUpvoted $event)
    {
        $this->checkUserVotes($event->user, $event->actor);
    }

    /**
     * @param PostWasPosted $event
     */
    public function addVote(PostWasPosted $event)
    {
        $event->actor->increment('votes');
        $event->post->discussion->increment('votes');
        $this->gamification->calculateHotness($event->post->discussion);
        $this->gamification->upvote($event->post->id, $event->actor);

        $this->checkUserVotes($event->actor, $event->actor);
    }

    /**
     * @param PostWasDeleted $event
     */
    public function removeVote(PostWasDeleted $event)
    {
        $event->post->user->decrement('votes');
    }

    protected function checkUserVotes($user, $actor)
    {
        $ranks = json_decode($this->settings->get('reflar.gamification.ranks'), true);

        if (isset($ranks[$user->votes])) {
            $user->rank = $ranks[$user->votes];
            $user->save();
            /*
            $this->notifications->sync(
                new RankupBlueprint($ranks[$user->votes], $actor),
                [$user]);
            */
        }
    }
}
