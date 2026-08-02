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

use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

/**
 * Decides whether gamification applies to a discussion at all.
 *
 * This is availability, not access: it answers "is voting a thing here?"
 * rather than "may this person vote?". Keeping it out of the permission system
 * is the point — admins bypass permission checks, so an admin previously saw
 * vote controls on every tag no matter how the forum was configured. A gate
 * that is not a permission applies to them too.
 *
 * Permissions still do their own job on top of this.
 */
class TagGate
{
    /**
     * Enabled tag ids, parsed once per request. Null until first read.
     *
     * @var int[]|null
     */
    private ?array $enabled = null;

    private bool $configured = false;

    /**
     * Per-discussion answers, keyed by the discussion instance, so the several
     * serialized fields that each ask this question resolve it once.
     *
     * @var \WeakMap<Discussion, mixed>
     */
    private \WeakMap $answers;

    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
        $this->answers = new \WeakMap();
    }

    /**
     * Constrain a query on discussions to those gamification applies to.
     *
     * Used to keep the page's vote loads off discussions that will never show
     * a vote: with no first post matched there is nothing for the dependent
     * vote load to key on, so Eloquent skips it altogether.
     */
    public function constrainToEnabled(Builder|Relation $query): void
    {
        $enabled = $this->enabledTagIds();

        if (!$this->configured) {
            return;
        }

        if ($enabled === []) {
            $query->whereRaw('1 = 0');

            return;
        }

        // `tags` reaches Discussion through an extender rather than the
        // model, so it is not a callable relation here — query the pivot
        // directly instead.
        // `tags` reaches Discussion through an extender rather than the
        // model, so it is not a callable relation here — query the pivot
        // directly instead.
        //
        // Untagged discussions are deliberately left in. They are not gamified
        // and allows() will say so, but excluding them from the load would
        // strip vote data from a forum whose discussions carry no tags, and
        // this constraint exists only to avoid needless work — never to change
        // what is visible.
        $query->where(function ($outer) use ($enabled) {
            $outer->whereExists(function ($sub) use ($enabled) {
                $sub->selectRaw('1')
                    ->from('discussion_tag')
                    ->whereColumn('discussion_tag.discussion_id', 'posts.discussion_id')
                    ->whereIn('discussion_tag.tag_id', $enabled);
            })->orWhereNotExists(function ($sub) {
                $sub->selectRaw('1')
                    ->from('discussion_tag')
                    ->whereColumn('discussion_tag.discussion_id', 'posts.discussion_id');
            });
        });
    }

    public function allowsPost(Post $post): bool
    {
        $discussion = $post->discussion;

        return $discussion === null || $this->allows($discussion);
    }

    public function allows(Discussion $discussion): bool
    {
        if (!isset($this->answers[$discussion])) {
            $this->answers[$discussion] = $this->resolve($discussion);
        }

        return $this->answers[$discussion];
    }

    private function resolve(Discussion $discussion): bool
    {
        // Resolve first: reading the setting is what establishes whether the
        // forum is configured at all.
        $enabled = $this->enabledTagIds();

        // An unconfigured forum — one that has not run the seeding migration,
        // or has no tags — keeps gamification everywhere rather than silently
        // losing it. An empty list, by contrast, is a deliberate choice: the
        // migration always writes a value.
        if (!$this->configured) {
            return true;
        }

        if ($enabled === []) {
            return false;
        }

        // `tags` reaches Discussion through an extender rather than the model,
        // so it is neither a declared property nor a callable relation method,
        // and it reads as null on a discussion that has none.
        /** @phpstan-ignore-next-line */
        $tags = $discussion->tags ?? [];

        // An untagged discussion carries no enabled tag, so gamification does
        // not apply. With flarum/tags a hard dependency every discussion is
        // expected to be tagged, so this is not a state worth a setting of its
        // own.
        foreach ($tags as $tag) {
            if (in_array((int) $tag->id, $enabled, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return int[]
     */
    private function enabledTagIds(): array
    {
        if ($this->enabled !== null) {
            return $this->enabled;
        }

        $raw = $this->settings->get(EnabledTags::SETTING);

        if ($raw === null || $raw === '') {
            $this->configured = false;

            return $this->enabled = [];
        }

        $decoded = json_decode($raw, true);

        if (!is_array($decoded)) {
            $this->configured = false;

            return $this->enabled = [];
        }

        $this->configured = true;

        return $this->enabled = array_map('intval', $decoded);
    }
}
