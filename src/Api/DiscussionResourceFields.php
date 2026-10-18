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
use FoF\Gamification\TagGate;
use Illuminate\Database\Eloquent\Collection;

class DiscussionResourceFields
{
    /**
     * Per-discussion memo of the resolved first post, keyed by the discussion
     * instance. Several fields need it and each used to resolve it
     * independently, so a single discussion cost one query per field on top of
     * the batched eager load.
     *
     * WeakMap's value template is invariant, so it is not annotated with the
     * narrowed value type: a Post, or false for a discussion that has none.
     *
     * @var \WeakMap<Discussion, mixed>
     */
    private \WeakMap $firstPosts;

    /**
     * Discussions serialized so far whose first post still has to be looked
     * up; see withFirstPost().
     *
     * @var \WeakMap<Discussion, true>
     */
    private \WeakMap $pending;

    public function __construct(
        protected TagGate $tags
    ) {
        $this->firstPosts = new \WeakMap();
        $this->pending = new \WeakMap();
    }

    /**
     * Whether the actor may see this discussion's vote tally.
     *
     * These two fields ask the Discussion ability directly rather than going
     * through the post policy, so they would otherwise bypass the tag gate and
     * expose a tally on a tag where gamification is switched off.
     */
    private function seesVotes(Discussion $discussion, Context $context): bool
    {
        return $this->tags->allows($discussion)
            && $context->getActor()->can('canSeeVotes', $discussion);
    }

    /**
     * The discussion's first post, handed to $then.
     *
     * Index endpoints eager-load it, and $then runs at once. Two cases are
     * left over, and both used to cost a query per discussion in the list,
     * plus one for its votes:
     *
     * - an endpoint that serializes discussions without loading their first
     *   posts, such as a tag's lastPostedDiscussion;
     * - a discussion whose first_post_id doesn't resolve (soft-deleted or
     *   renumbered posts, or an import that never set it), which has to be
     *   looked up by post number instead.
     *
     * Both are deferred. The serializer resolves deferred values a level of
     * includes at a time, after every resource at that level is gathered, so
     * the first of them looks up every discussion waiting so far at once: one
     * batch per level, whatever the page size.
     *
     * @return mixed $then's result, or a Closure the serializer resolves later
     */
    private function withFirstPost(Discussion $discussion, Context $context, \Closure $then): mixed
    {
        // A discussion with no first post is memoised as false, not null:
        // isset() treats a null entry as missing and would look it up again.
        if (isset($this->firstPosts[$discussion])) {
            return $then($this->firstPosts[$discussion] ?: null);
        }

        // The index deliberately skips loading first posts for discussions
        // gamification does not apply to. Without this the fallback below
        // would read that as a missing first post and fetch one per row,
        // turning an optimisation into an N+1.
        if (!$this->tags->allows($discussion)) {
            $this->firstPosts[$discussion] = false;

            return $then(null);
        }

        if ($discussion->relationLoaded('firstPost') && $post = $discussion->firstPost) {
            // The post policies read $post->discussion, which would otherwise
            // be lazy-loaded once per discussion in the list — re-fetching the
            // very row being serialized. We already have it, so hand it over.
            $post->setRelation('discussion', $discussion);

            return $then($this->firstPosts[$discussion] = $post);
        }

        $this->pending[$discussion] = true;

        return function () use ($discussion, $context, $then) {
            if (!isset($this->firstPosts[$discussion])) {
                $this->resolvePending($context);
            }

            return $then($this->firstPosts[$discussion] ?: null);
        };
    }

    /**
     * Look up the first post of every discussion waiting on one, with the
     * actor's votes on them: two queries for the whole batch.
     *
     * The posts go into the memo only, never onto the discussion's firstPost
     * relation. A request that includes firstPost loads that relation itself,
     * scoped to what the actor may see, and finding it already set would skip
     * that scoping.
     */
    private function resolvePending(Context $context): void
    {
        $discussions = [];

        foreach ($this->pending as $discussion => $_) {
            $discussions[] = $discussion;
            $this->firstPosts[$discussion] = false;
        }

        $this->pending = new \WeakMap();

        // Each discussion's first post by first_post_id, or where that doesn't
        // resolve, its post numbered 1. One query fetches both candidates.
        $ids = array_map(fn (Discussion $discussion) => $discussion->id, $discussions);
        $firstPostIds = array_filter(array_map(fn (Discussion $discussion) => $discussion->first_post_id, $discussions));

        $candidates = Post::query()
            ->where(function ($query) use ($ids, $firstPostIds) {
                $query->whereIn('id', $firstPostIds)
                    ->orWhere(fn ($query) => $query->whereIn('discussion_id', $ids)->where('number', 1));
            })
            ->get();

        $byId = $candidates->keyBy('id');
        $byDiscussion = $candidates->where('number', 1)->keyBy('discussion_id');

        // The same discussion can be on the page more than once as separate
        // instances (as a primary resource and through a post's discussion),
        // so each of them gets its post.
        /** @var Collection<int, Post> $posts */
        $posts = new Collection();

        foreach ($discussions as $discussion) {
            /** @var Post|null $post */
            $post = $byId->get($discussion->first_post_id) ?? $byDiscussion->get($discussion->id);

            if ($post) {
                $post->setRelation('discussion', $discussion);
                $posts->push($post);
                $this->firstPosts[$discussion] = $post;
            }
        }

        // Only the actor's own vote is ever read from these, the same
        // constraint the index puts on the eager-loaded first posts.
        $actor = $context->getActor();

        if (!$actor->isGuest() && $actor->exists) {
            $posts->unique()->load(['actualvotes' => fn ($query) => $query->where('user_id', $actor->id)]);
        }
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
                    if ($context->getActor()->isGuest() || !$context->getActor()->exists) {
                        return false;
                    }

                    // Vote state belongs to the same gate as the tally: a
                    // discussion outside the enabled tags carries none.
                    if (!$this->tags->allows($discussion)) {
                        return false;
                    }

                    // A first post still to be looked up counts as present:
                    // visibility can't wait for the deferred lookup, so a
                    // discussion that turns out to have none reports false.
                    return $this->withFirstPost($discussion, $context, fn (?Post $post) => (bool) $post) !== false;
                })
                ->get(fn (Discussion $discussion, Context $context) => $this->withFirstPost(
                    $discussion,
                    $context,
                    /** @phpstan-ignore-next-line */
                    fn (?Post $post) => $post?->actualvotes->firstWhere('user_id', $context->getActor()->id)?->isUpvote() ?? false
                )),
            Schema\Boolean::make('hasDownvoted')
                ->visible($hasUpvotedVisible)
                ->get(fn (Discussion $discussion, Context $context) => $this->withFirstPost(
                    $discussion,
                    $context,
                    /** @phpstan-ignore-next-line */
                    fn (?Post $post) => $post?->actualvotes->firstWhere('user_id', $context->getActor()->id)?->isDownvote() ?? false
                )),
            Schema\Number::make('votes')
                ->visible(fn (Discussion $discussion, Context $context) => $this->seesVotes($discussion, $context))
                ->get(fn (Discussion $discussion) => $discussion->votes),
            Schema\Boolean::make('seeVotes')
                ->get(fn (Discussion $discussion, Context $context) => $this->seesVotes($discussion, $context)),
            Schema\Boolean::make('canVote')
                // Ask about the discussion first: an actor who can't vote on it,
                // as a guest normally can't, is answered without looking up the
                // post.
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('votePosts', $discussion)
                    ? $this->withFirstPost($discussion, $context, fn (?Post $post) => $post && $context->getActor()->can('vote', $post))
                    : false),
        ];
    }
}
