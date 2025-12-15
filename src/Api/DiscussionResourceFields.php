<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Discussion\Discussion;

class DiscussionResourceFields
{
    public function __invoke(): array
    {
        return [
            Schema\Boolean::make('hasUpvoted')
                ->visible($hasUpvotedVisible = function (Discussion $discussion, Context $context) {
                    $postExists = $discussion->firstPost || $discussion->posts()->where('number', 1)->first();

                    return !$context->getActor()->isGuest() && $context->getActor()->exists && $postExists;
                })
                ->get(function (Discussion $discussion) {
                    $post = $discussion->firstPost ?: $discussion->posts()->where('number', 1)->first();

                    return $post->actualvotes->first()?->isUpvote() ?? false;
                }),
            Schema\Boolean::make('hasDownvoted')
                ->visible($hasUpvotedVisible)
                ->get(function (Discussion $discussion) {
                    $post = $discussion->firstPost ?: $discussion->posts()->where('number', 1)->first();

                    return $post->actualvotes->first()?->isDownvote() ?? false;
                }),
            Schema\Number::make('votes')
                ->visible(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeVotes', $discussion))
                ->get(fn (Discussion $discussion) => $discussion->votes),
            Schema\Boolean::make('seeVotes')
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeVotes', $discussion)),
            Schema\Boolean::make('canVote')
                ->get(function (Discussion $discussion, Context $context) {
                    $post = $discussion->firstPost ?: $discussion->posts()->where('number', 1)->first();

                    return $post && $context->getActor()->can('votePosts', $discussion) && $context->getActor()->can('vote', $post);
                }),
        ];
    }
}
