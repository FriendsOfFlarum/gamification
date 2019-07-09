<?php
/**
 *  This file is part of fof/gamification.
 *
 *  Copyright (c) FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace FoF\Gamification\Listeners;

use Flarum\Event\ConfigureDiscussionGambits;
use Illuminate\Contracts\Events\Dispatcher;
use FoF\Gamification\Gambit\HotGambit;

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
