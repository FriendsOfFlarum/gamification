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

use FoF\Gamification\Events\UserPointsUpdated;
use FoF\Gamification\Jobs\AutoAssignUserGroups;
use Illuminate\Contracts\Queue\Queue;

class UpdateAutoAssignedGroups
{
    protected $queue;

    public function __construct(Queue $queue)
    {
        $this->queue = $queue;
    }

    public function handle(UserPointsUpdated $event)
    {
        $this->queue->push(new AutoAssignUserGroups($event->user));
    }
}
