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

use Flarum\Event\ConfigureDiscussionGambits;
use FoF\Gamification\Gambit\HotGambit;

class FilterDiscussionListByHotness
{
    /**
     * @param ConfigureDiscussionGambits $event
     */
    public function handle(ConfigureDiscussionGambits $event)
    {
        $event->gambits->add(HotGambit::class);
    }
}
