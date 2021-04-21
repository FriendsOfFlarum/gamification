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

use Flarum\Post\Event\Posted;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Gamification\Gamification;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;

class AddVoteHandler
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

    public function handle(Posted $event)
    {
        if ('0' !== $this->settings->get('fof-gamification.autoUpvotePosts') && $event->post->exists()) {
            $actor = $event->actor;

            Vote::updateUserVotes($actor)->save();

            Vote::updateDiscussionVotes($event->post->discussion);
            $this->gamification->calculateHotness($event->post->discussion);

            $vote = Vote::build($event->post, $actor);
            $vote->value = 1;
            $vote->save();

            $ranks = Rank::where('points', '<=', $actor->votes)->get();

            if ($ranks) {
                $actor->ranks()->detach();
                $actor->ranks()->attach($ranks);
            }
        }
    }
}
