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

use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Started;
use FoF\Gamification\Vote;

class AddDiscussionVotes
{
    public function handle(Started $event)
    {
        /** @var Discussion $discussion */
        $discussion = Vote::updateDiscussionVotes($event->discussion);
        $discussion->save();
    }
}
