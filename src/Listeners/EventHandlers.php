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

use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Notification\NotificationSyncer;
use Flarum\Post\Event\Deleted;
use Flarum\Post\Event\Posted;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Gamification\Gamification;
use Reflar\Gamification\Notification\VoteBlueprint;
use Reflar\Gamification\Rank;
use Reflar\Gamification\Vote;

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
     * @var Vote
     */
    protected $vote;

    /**
     * EventHandlers constructor.
     *
     * @param SettingsRepositoryInterface $settings
     * @param NotificationSyncer          $notifications
     * @param Gamification                $gamification
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
        $events->listen(ConfigureNotificationTypes::class, [$this, 'registerNotificationType']);
        $events->listen(Posted::class, [$this, 'addVote']);
        $events->listen(Deleted::class, [$this, 'removeVote']);
    }

    /**
     * @param Posted $event
     */
    public function addVote(Posted $event)
    {
        if ('0' !== $this->settings->get('reflar.gamification.autoUpvotePosts')) {
            $actor = $event->actor;

            $actor->increment('votes');
            $event->post->discussion->increment('votes');
            $this->gamification->calculateHotness($event->post->discussion);

            $vote = Vote::build($event->post, $actor);
            $vote->type = 'Up';
            $vote->save();

            $ranks = Rank::where('points', '<=', $actor->votes)->get();

            if (null !== $ranks) {
                $actor->ranks()->detach();
                foreach ($ranks as $rank) {
                    $actor->ranks()->attach($rank->id);
                }
            }
        }
    }

    /**
     * @param ConfigureNotificationTypes $event
     */
    public function registerNotificationType(ConfigureNotificationTypes $event)
    {
        $event->add(VoteBlueprint::class, PostBasicSerializer::class, ['alert']);
    }

    /**
     * @param Deleted $event
     */
    public function removeVote(Deleted $event)
    {
        $user = $event->post->user;
        $event->post->user->decrement('votes');

        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if (null !== $ranks) {
            foreach ($ranks as $rank) {
                $user->ranks()->detach($rank->id);
            }
        }
    }
}
