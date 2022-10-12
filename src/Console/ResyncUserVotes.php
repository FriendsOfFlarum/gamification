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

use Flarum\Console\AbstractCommand;
use Flarum\User\User;
use FoF\Gamification\Vote;
use Illuminate\Database\Eloquent\Collection;

class ResyncUserVotes extends AbstractCommand
{
    protected function configure()
    {
        $this
            ->setName('fof:gamification:resyncUsers')
            ->setDescription('Resync user vote counts');
    }

    protected function fire()
    {
        $this->info('Syncing user votes. This may take some time if you have many users!');

        User::chunk(50, function (Collection $users) {
            foreach ($users as $user) {
                /** @var User $user */
                $this->info("Syncing user $user->id, current votes $user->votes");
                $user = Vote::updateUserVotes($user);
                $user->save();
                $this->info("Finished user $user->id, now calculated with $user->votes votes");
            }
        });

        $this->info('Sync complete.');
    }
}
