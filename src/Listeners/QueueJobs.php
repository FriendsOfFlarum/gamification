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

class QueueJobs
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWasVoted::class, [$this, 'notifications']);
    }

    public function notifications(PostWasVoted $event)
    {
        resolve('flarum.queue.connection')->push(
            new Jobs\VoteNotificationsJob($event->vote)
        );
    }
}
