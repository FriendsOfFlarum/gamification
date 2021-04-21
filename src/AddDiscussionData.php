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

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;

class AddDiscussionData
{
    public function __invoke(DiscussionSerializer $serializer, Discussion $discussion, array $attributes): array
    {
        $post = $discussion->firstPost ?: $discussion->posts()->where('number', 1)->first();
        $actor = $serializer->getActor();

        if ($actor->exists && $post) {
            $vote = Vote::query()->where([
                'post_id' => $post->id,
                'user_id' => $actor->id,
            ])->first(['value']);

            $attributes['hasUpvoted'] = $vote && $vote->isUpvote();
            $attributes['hasDownvoted'] = $vote && $vote->isDownvote();
        }

        $attributes['votes'] = (int) $discussion->votes;
        $attributes['canVote'] = $post && $actor->can('vote', $post);

        return $attributes;
    }
}
