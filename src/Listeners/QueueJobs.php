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

use FoF\Gamification\Events\PostWasVoted;
use FoF\Gamification\Jobs;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Queue\Queue;

class QueueJobs
{
    public function __construct(
        protected Queue $queue
    ) {
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(PostWasVoted::class, [$this, 'notifications']);
    }

    public function notifications(PostWasVoted $event): void
    {
        $this->queue->push(new Jobs\VoteNotificationsJob($event->vote));
    }
}
