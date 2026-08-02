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
use Flarum\Post\Post;

class DiscussionResourceFields
{
    /**
     * Per-discussion memo of the resolved first post, keyed by the discussion
     * instance. Several fields need it and each used to resolve it
     * independently, so a single discussion cost one query per field on top of
     * the batched eager load.
     *
     * @var \WeakMap<Discussion, ?Post>
     */
    private \WeakMap $firstPosts;

    public function __construct()
    {
        $this->firstPosts = new \WeakMap();
    }

    /**
     * The discussion's first post: the eager-loaded relation where the index
     * provided one, otherwise a lookup for a discussion whose first_post_id
     * doesn't resolve (soft-deleted or renumbered posts).
     */
    private function firstPost(Discussion $discussion): ?Post
    {
        if (! isset($this->firstPosts[$discussion])) {
            $post = $discussion->firstPost ?: $discussion->posts()->where('number', 1)->first();

            // The post policies read $post->discussion, which would otherwise
            // be lazy-loaded once per discussion in the list — re-fetching the
            // very row being serialized. We already have it, so hand it over.
            $post?->setRelation('discussion', $discussion);

            $this->firstPosts[$discussion] = $post;
        }

        return $this->firstPosts[$discussion];
    }

    public function __invoke(): array
    {
        return [
            Schema\Boolean::make('hasUpvoted')
                ->visible($hasUpvotedVisible = function (Discussion $discussion, Context $context) {
                    // Check the actor before touching the database: these
                    // fields are never sent to a guest, and resolving the
                    // first post to answer that cost one query per discussion
                    // in the list for a result that was always false.
                    if ($context->getActor()->isGuest() || ! $context->getActor()->exists) {
                        return false;
                    }

                    return (bool) $this->firstPost($discussion);
                })
                ->get(function (Discussion $discussion, Context $context) {
                    $post = $this->firstPost($discussion);

                    /** @phpstan-ignore-next-line */
                    return $post?->actualvotes->firstWhere('user_id', $context->getActor()->id)?->isUpvote() ?? false;
                }),
            Schema\Boolean::make('hasDownvoted')
                ->visible($hasUpvotedVisible)
                ->get(function (Discussion $discussion, Context $context) {
                    $post = $this->firstPost($discussion);

                    /** @phpstan-ignore-next-line */
                    return $post?->actualvotes->firstWhere('user_id', $context->getActor()->id)?->isDownvote() ?? false;
                }),
            Schema\Number::make('votes')
                ->visible(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeVotes', $discussion))
                ->get(fn (Discussion $discussion) => $discussion->votes),
            Schema\Boolean::make('seeVotes')
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeVotes', $discussion)),
            Schema\Boolean::make('canVote')
                ->get(function (Discussion $discussion, Context $context) {
                    $post = $this->firstPost($discussion);

                    return $post && $context->getActor()->can('votePosts', $discussion) && $context->getActor()->can('vote', $post);
                }),
        ];
    }
}
