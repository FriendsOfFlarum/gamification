<?php

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
