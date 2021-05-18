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

use Flarum\Group\Event\Saving;
use FoF\Gamification\Rank;
use Illuminate\Support\Arr;

class SyncGroupsStickyRanks
{
    public function handle(Saving $event)
    {
        $group = $event->group;
        if ($group) {
            $rank = Arr::get($event->data, 'relationships.sticky_rank.data.id');
            if (empty($rank)) {
                $group->sticky_rank()->dissociate();
            } else {
                $group->sticky_rank()->associate(Rank::where('id', $rank)->first());
            }
        }
    }
}
