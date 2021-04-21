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

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Post\Post;

class AddPostData
{
    public function __invoke(PostSerializer $serializer, Post $post, array $attributes): array
    {
        $actor = $serializer->getActor();

        if ($actor->exists) {
            $vote = Vote::query()->where(['post_id' => $post->id, 'user_id' => $actor->id])->first(['value']);

            $attributes['hasUpvoted'] = $vote && $vote->isUpvote();
            $attributes['hasDownvoted'] = $vote && $vote->isDownvote();
        }

        $attributes['votes'] = Vote::calculate(['post_id' => $post->id]);

        $attributes['canVote'] = (bool) $actor->can('vote', $post);
        $attributes['canSeeVotes'] = (bool) $actor->can('canSeeVotes', $post->discussion);

        return $attributes;
    }
}
