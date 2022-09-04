<?php

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
