<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Listeners;

use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Event\ConfigureNotificationTypes;
use Flarum\Post\Event\Deleting;
use Flarum\Post\Event\Posted;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Gamification\Gamification;
use FoF\Gamification\Notification\VoteBlueprint;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;
use Illuminate\Contracts\Events\Dispatcher;

class EventHandlers
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

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
     * @param Gamification                $gamification
     */
    public function __construct(SettingsRepositoryInterface $settings, Gamification $gamification)
    {
        $this->settings = $settings;
        $this->gamification = $gamification;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureNotificationTypes::class, [$this, 'registerNotificationType']);
        $events->listen(Posted::class, [$this, 'addVote']);
        $events->listen(Deleting::class, [$this, 'removeVote']);
    }

    /**
     * @param Posted $event
     */
    public function addVote(Posted $event)
    {
        if ('0' !== $this->settings->get('fof-gamification.autoUpvotePosts')) {
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
                $actor->ranks()->attach($ranks);
            }
        }
    }

    /**
     * @param ConfigureNotificationTypes $event
     */
    public function registerNotificationType(ConfigureNotificationTypes $event)
    {
        $event->add(VoteBlueprint::class, BasicPostSerializer::class, ['alert']);
    }

    /**
     * @param Deleting $event
     */
    public function removeVote(Deleting $event)
    {
        $post = $event->post;

        $voteNumber = $post->upvotes()->count() - $post->downvotes()->count();
        $user = $event->post->user;
        $user->votes = $user->votes - $voteNumber;

        $user->save();

        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if (null !== $ranks) {
            $user->ranks()->detach($ranks);
        }
    }
}
