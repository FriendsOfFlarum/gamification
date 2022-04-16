<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification;

use Flarum\Api\Serializer\BasicDiscussionSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;

class AddDiscussionData
{
    /**
     * @param DiscussionSerializer|BasicDiscussionSerializer $serializer
     */
    public function __invoke($serializer, Discussion $discussion, array $attributes): array
    {
        $post = $discussion->firstPost ?: $discussion->posts()->where('number', 1)->first();
        $actor = $serializer->getActor();

        if (!$actor->isGuest() && $actor->exists && $post) {
            $vote = Vote::query()->where([
                'post_id' => $post->id,
                'user_id' => $actor->id,
            ])->first(['value']);

            $attributes['hasUpvoted'] = $vote && $vote->isUpvote();
            $attributes['hasDownvoted'] = $vote && $vote->isDownvote();
        }

        if ($seeVotes = $actor->can('canSeeVotes', $discussion)) {
            $attributes['votes'] = (int) $discussion->votes;
        }

        $attributes['seeVotes'] = $seeVotes;
        $attributes['canVote'] = $post && $actor->can('votePosts', $discussion) && $actor->can('vote', $post);

        return $attributes;
    }
}
