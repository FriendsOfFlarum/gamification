<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Listeners;

use Flarum\Post\Event\Deleting;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;

class RemoveVoteHandler
{
    public function handle(Deleting $event)
    {
        $post = $event->post;

        $voteNumber = Vote::calculate(['post_id' => $post->id]);
        $user = $event->post->user;
        $user->votes = $user->votes - $voteNumber;

        $user->save();

        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if (null !== $ranks) {
            $user->ranks()->detach($ranks);
        }
    }
}
