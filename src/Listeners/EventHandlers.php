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

use Flarum\Api\Serializer\PostBasicSerializer;
use Flarum\Api\Serializer\UserBasicSerializer;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWasPosted;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Events\PostWasDownvoted;
use Reflar\gamification\Events\PostWasUpvoted;
use Reflar\gamification\Notification\UpvotedBlueprint;
use Reflar\gamification\Notification\DownvotedBlueprint;
use Reflar\gamification\Notification\RankupBlueprint;
use Reflar\gamification\Gamification;
use Reflar\gamification\Rank;

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
        $events->listen(ConfigureNotificationTypes::class, [$this, 'registerNotificationType']);
        $events->listen(PostWasDownvoted::class, [$this, 'checkDownUser']);
        $events->listen(PostWasUpvoted::class, [$this, 'checkUpUser']);
        $events->listen(PostWasPosted::class, [$this, 'addVote']);
        $events->listen(PostWasDeleted::class, [$this, 'removeVote']);
    }

    /**
     * @param PostWasUpvoted $event
     */
    public function checkUpUser(PostWasUpvoted $event)
    {
        die('test');
        $this->checkUpUserVotes($event->user, $event->actor);
    }

    /**
     * @param PostWasUpvoted $event
     */
    public function checkDownUser(PostWasDownvoted $event)
    {
        $this->checkDownUserVotes($event->user);
    }

    /**
     * @param PostWasPosted $event
     */
    public function addVote(PostWasPosted $event)
    {
        if ($this->settings->get('reflar.gamification.autoUpvotePosts') !== '0') {
            $event->actor->increment('votes');
            $event->post->discussion->increment('votes');
            $this->gamification->calculateHotness($event->post->discussion);
            $this->gamification->upvote($event->post->id, $event->actor);

            $this->checkUpUserVotes($event->actor, $event->actor);
        }
    }

    /**
     * @param ConfigureNotificationTypes $event
     */
    public function registerNotificationType(ConfigureNotificationTypes $event)
    {
        $event->add(DownvotedBlueprint::class, PostBasicSerializer::class, ['alert']);
        $event->add(UpvotedBlueprint::class, PostBasicSerializer::class, ['alert']);
        $event->add(RankupBlueprint::class, UserBasicSerializer::class, ['alert']);
    }

    /**
     * @param PostWasDeleted $event
     */
    public function removeVote(PostWasDeleted $event)
    {
        $event->post->user->decrement('votes');
        $this->checkDownUserVotes($event->post->user);
    }

    /**
     * @param $user
     * @param $actor
     */
    protected function checkUpUserVotes($user, $actor)
    {
        $ranks = Rank::where('points', '<=', $user->votes)->get();

        if ($ranks !== null) {
            foreach($ranks as $rank)
            $user->ranks()->attach($rank->id);

            if ($user->id !== $actor->id) {
                $this->notifications->sync(
                    new RankupBlueprint($rank, $actor),
                    [$user]);
            }
        }
    }

    /**
     * @param $user
     */
    protected function checkDownUserVotes($user)
    {
        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if ($ranks !== null) {
            foreach($ranks as $rank)
                $user->ranks()->detach($rank->id);
        }
    }
}
