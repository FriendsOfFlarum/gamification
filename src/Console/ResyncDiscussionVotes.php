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

use Flarum\Discussion\Discussion;
use FoF\Gamification\Vote;
use Illuminate\Console\Command;

class ResyncDiscussionVotes extends Command
{
    protected $signature = 'fof:gamification:resync';
    protected $description = 'Resync discussion vote counts';

    protected $updateCount = 0;

    public function handle()
    {
        $this->info('Syncing discussion votes. This may take some time if you have many discussions!');

        $this->output->progressStart(Discussion::query()->count());

        Discussion::query()->each(function (Discussion $discussion) {
            $pre = $discussion->votes;
            $discussion = Vote::updateDiscussionVotes($discussion);

            if ($pre !== $discussion->votes) {
                $this->updateCount++;
                $discussion->save();
            }

            $this->output->progressAdvance();
        });

        $this->output->progressFinish();

        $this->info("Updated {$this->updateCount} discussions.");
    }
}
