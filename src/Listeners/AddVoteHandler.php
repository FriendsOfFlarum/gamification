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
     * EventHandlers constructor.
     *
     */
    public function __construct(protected SettingsRepositoryInterface $settings, protected Gamification $gamification)
    {
    }

    public function handle(Posted $event)
    {
        if ((bool) $this->settings->get('fof-gamification.autoUpvotePosts') && $event->post->exists()) {
            $actor = $event->actor;

            Vote::updateUserVotes($actor)->save();

            Vote::updateDiscussionVotes($event->post->discussion);
            $this->gamification->calculateHotness($event->post->discussion);

            $vote = Vote::build($event->post, $actor);
            $vote->value = 1;
            $vote->save();

            $ranks = Rank::query()->where('points', '<=', $actor->votes)->get();

            if (count($ranks) > 0) {
                $actor->ranks()->detach();
                $actor->ranks()->attach($ranks);
            }
        }
    }
}
