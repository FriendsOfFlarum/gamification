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
use Flarum\Post\Post;
use FoF\Gamification\Events\PostWasVoted;
use FoF\Gamification\Vote;

class AddDiscussionVotes
{
    public function handle(PostWasVoted $event)
    {
        /** @var Post $post */
        $post = $event->vote->post;

        /** @var Discussion $discussion */
        $discussion = Vote::updateDiscussionVotes($post->discussion);
        $discussion->save();
    }
}
