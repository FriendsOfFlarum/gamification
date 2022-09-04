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

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Gamification\Jobs\AutoAssignUserGroups;
use Illuminate\Console\Command;

class AutoAssignGroups extends Command
{
    protected $signature = 'fof:gamification:assign-groups';
    protected $description = 'Updates the auto-assigned groups of all users';

    protected $totalAdded = 0;
    protected $totalRemoved = 0;
    protected $totalUsersUpdated = 0;

    public function handle(SettingsRepositoryInterface $settings)
    {
        $this->output->progressStart(User::query()->count());

        User::query()->each(function (User $user) use ($settings) {
            $job = new AutoAssignUserGroups($user);
            $job->handle($settings);

            $this->totalAdded += $job->statsAdded;
            $this->totalRemoved += $job->statsRemoved;

            if ($job->statsAdded || $job->statsRemoved) {
                $this->totalUsersUpdated++;
            }

            $this->output->progressAdvance();
        });

        $this->output->progressFinish();

        $this->info("Updated {$this->totalUsersUpdated} users. Added {$this->totalAdded} groups and removed {$this->totalRemoved} groups");
    }
}
