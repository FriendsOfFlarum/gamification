<?php

namespace FoF\Gamification\Console;

use Flarum\Console\AbstractCommand;
use Flarum\Discussion\Discussion;
use FoF\Gamification\Vote;
use Illuminate\Database\Eloquent\Collection;

class ResyncDiscussionVotes extends AbstractCommand
{
    protected function configure()
    {
        $this
            ->setName('fof:gamification:resync')
            ->setDescription('Resync discussion vote counts');
    }

    protected function fire()
    {
        $this->info('Syncing discussion votes. This may take some time if you have many discussions!');

        Discussion::chunk(50, function (Collection $discussions) {
            foreach ($discussions as $discussion) {
                /** @var Discussion $discussion */
                $this->info("Syncing discussion $discussion->id, current votes $discussion->votes");
                $discussion = Vote::updateDiscussionVotes($discussion);
                $discussion->save();
                $this->info("Finished discussion $discussion->id, now calculated with $discussion->votes votes");
            }
        });

        $this->info('Sync complete.');
    }
}
