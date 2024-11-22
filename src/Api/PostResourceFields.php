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
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;

class PostResourceFields
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function __invoke(): array
    {
        return [
            Schema\Boolean::make('hasUpvoted')
                ->visible(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                })
                ->get(function (Post $post, Context $context) {
                    if ($context->getActor()->exists) {
                        /** @phpstan-ignore-next-line */
                        $vote = $post->actualvotes->first();

                        return $vote && $vote->isUpvote();
                    }

                    return null;
                }),
            Schema\Boolean::make('hasDownvoted')
                ->visible(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                })
                ->get(function (Post $post, Context $context) {
                    if ($context->getActor()->exists) {
                        /** @phpstan-ignore-next-line */
                        $vote = $post->actualvotes->first();

                        return $vote && $vote->isDownvote();
                    }

                    return null;
                }),
            Schema\Boolean::make('canSeeVotes')
                ->get(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                }),
            Schema\Number::make('votes')
                ->sumRelation('actualvotes', 'value')
                ->visible(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                }),
            Schema\Boolean::make('canVote')
                ->get(function (Post $post, Context $context) {
                    return $context->getActor()->can('vote', $post);
                }),
            Schema\Boolean::make('seeVoters')
                ->get(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVoters', $post->discussion)
                        && $context->getActor()->can('canSeeVoters', $post);
                }),

            Schema\Relationship\ToMany::make('upvotes')
                ->includable()
                ->type('users'),
            Schema\Relationship\ToMany::make('downvotes')
                ->includable()
                ->type('users'),
        ];
    }
}
