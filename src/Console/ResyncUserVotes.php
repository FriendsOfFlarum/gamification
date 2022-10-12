<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Console;

use Flarum\User\User;
use FoF\Gamification\Events\UserPointsUpdated;
use FoF\Gamification\Vote;
use Illuminate\Console\Command;
use Illuminate\Events\Dispatcher;

class ResyncUserVotes extends Command
{
    protected $signature = 'fof:gamification:resyncUsers';
    protected $description = 'Resync user vote counts';

    protected $events;

    protected $updateCount = 0;

    public function __construct(Dispatcher $events)
    {
        $this->events = $events;

        parent::__construct();
    }

    public function handle()
    {
        $this->info('Syncing user votes. This may take some time if you have many users!');

        $this->output->progressStart(User::query()->count());

        User::query()->each(function (User $user) {
            $pre = $user->votes;
            $user = Vote::updateUserVotes($user);

            if ($pre !== $user->votes) {
                $this->updateCount++;
                $user->save();

                $this->events->dispatch(new UserPointsUpdated($user));
            }

            $this->output->progressAdvance();
        });

        $this->output->progressFinish();

        $this->info("Updated {$this->updateCount} users.");
    }
}
