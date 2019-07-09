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

use Flarum\Event\ConfigureDiscussionGambits;
use FoF\Gamification\Gambit\HotGambit;
use Illuminate\Contracts\Events\Dispatcher;

class FilterDiscussionListByHotness
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureDiscussionGambits::class, [$this, 'ConfigureDiscussionGambits']);
    }

    /**
     * @param ConfigureDiscussionGambits $event
     */
    public function ConfigureDiscussionGambits(ConfigureDiscussionGambits $event)
    {
        $event->gambits->add(HotGambit::class);
    }
}
