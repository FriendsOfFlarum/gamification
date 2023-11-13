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
use Flarum\Discussion\Discussion;

class AddDiscussionData
{
    public function __invoke(BasicDiscussionSerializer $serializer, Discussion $discussion, array $attributes): array
    {
        $post = $discussion->firstPost ?: $discussion->posts()->where('number', 1)->first();
        $actor = $serializer->getActor();

        if (!$actor->isGuest() && $actor->exists && $post) {
            /** @phpstan-ignore-next-line */
            $vote = $post->actualvotes->first();

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
