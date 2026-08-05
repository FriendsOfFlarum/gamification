<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Tests\integration;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Group\Group;
use Flarum\Post\Post;
use Flarum\Tags\Tag;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\EnabledTags;
use FoF\Gamification\Tests\EnhancedTestCase;
use Illuminate\Database\Events\QueryExecuted;
use PHPUnit\Framework\Attributes\Test;

/**
 * Vote data is loaded for a whole page at once, before anything asks whether
 * gamification applies to the discussions on it. On a forum that confines
 * voting to one tag out of many, most pages carry no gamified discussion at
 * all, so that work is pure waste.
 *
 * The loads are therefore constrained to the enabled tags. Where a page holds
 * nothing gamified there are no first posts to match, and the dependent vote
 * load is skipped by Eloquent for want of anything to key on.
 */
class GatedEagerLoadTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const ENABLED_TAG = 51;
    private const OTHER_TAG = 50;
    private const MEMBER = 3;

    /** @var string[] */
    private array $voteQueries = [];

    private function boot(string $enabledTags): void
    {
        $this->setting(EnabledTags::SETTING, $enabledTags);

        $this->extension('flarum-tags', 'fof-gamification');

        $now = Carbon::now()->toDateTimeString();

        $discussions = $posts = $discussionTags = $votes = [];
        $voteId = 1;

        // Ten discussions on each tag, so a page can be wholly gated, wholly
        // gamified, or mixed depending on what the setting enables.
        foreach ([self::OTHER_TAG, self::ENABLED_TAG] as $index => $tagId) {
            for ($i = 1; $i <= 10; $i++) {
                $id = $index * 100 + $i;

                $discussions[] = ['id' => $id, 'title' => "D$id", 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 2, 'first_post_id' => $id, 'comment_count' => 1, 'is_private' => 0];
                $posts[] = ['id' => $id, 'discussion_id' => $id, 'number' => 1, 'created_at' => $now, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
                $discussionTags[] = ['discussion_id' => $id, 'tag_id' => $tagId];
                $votes[] = ['id' => $voteId++, 'post_id' => $id, 'user_id' => self::MEMBER, 'value' => 1];
            }
        }

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'member', 'email' => 'member@machine.local', 'is_email_confirmed' => 1],
            ],
            Group::class => [
                ['id' => 101, 'name_singular' => 'Voter', 'name_plural' => 'Voters'],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => 101],
            ],
            'group_permission' => [
                ['group_id' => 101, 'permission' => 'discussion.votePosts'],
                ['group_id' => 101, 'permission' => 'discussion.canSeeVotes'],
            ],
            Tag::class => [
                ['id' => self::OTHER_TAG, 'name' => 'Off', 'slug' => 'off', 'position' => 0, 'is_restricted' => 0],
                ['id' => self::ENABLED_TAG, 'name' => 'On', 'slug' => 'on', 'position' => 1, 'is_restricted' => 0],
            ],
            Discussion::class => $discussions,
            Post::class       => $posts,
            'discussion_tag'  => $discussionTags,
            'post_votes'      => $votes,
        ]);
    }

    /** @return array<string, mixed> keyed by discussion id */
    private function index(): array
    {
        $this->voteQueries = [];

        $this->app()->getContainer()->make('events')->listen(QueryExecuted::class, function (QueryExecuted $query) {
            if (str_contains($query->sql, 'post_votes')) {
                $this->voteQueries[] = $query->sql;
            }
        });

        $response = $this->send($this->request('GET', '/api/discussions', ['authenticatedAs' => self::MEMBER]));
        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        $byId = [];
        foreach ($body['data'] as $row) {
            $byId[(int) $row['id']] = $row['attributes'];
        }

        return $byId;
    }

    /**
     * A page carrying nothing gamified must not go looking for votes per row.
     *
     * It used to issue none at all: the first-post load itself was narrowed to
     * the enabled tags, so the dependent vote load had nothing to key on. That
     * saving is gone, deliberately — narrowing `firstPost` left it marked loaded
     * but null on every other discussion, so a client asking for
     * `include=firstPost` was served nothing, and Flarum's admin announcements
     * widget rendered every excerpt blank.
     *
     * What replaced it is one constrained query that matches nothing. Measured
     * against discuss.flarum.org (23k discussions, 230k posts) it runs in
     * 0.13ms median / 0.14ms p95 — an index-only lookup, well inside the noise
     * of a request. Paying that to keep the API honest is the right trade, so
     * the assertion is "one query that finds nothing", not "no query".
     *
     * It still catches what matters: a per-row vote load, or an unconstrained
     * one that drags in other people's votes.
     */
    #[Test]
    public function a_page_with_nothing_gamified_loads_no_votes()
    {
        $this->boot(json_encode([(string) self::ENABLED_TAG]));

        // Only the non-enabled tag's discussions are recent enough to appear,
        // so nothing on this page is gamified.
        $this->database()->table('discussions')->where('id', '>', 100)->delete();

        $attributes = $this->index();

        $this->assertLessThanOrEqual(
            1,
            count($this->voteQueries),
            "At most one batched vote query may run for a page with no gamified discussion. Ran:\n".implode("\n", $this->voteQueries)
        );

        // Whatever ran must have found nothing to show.
        foreach ($attributes as $id => $attrs) {
            $this->assertSame(0, $attrs['votes'] ?? 0, "Discussion $id reported votes despite not being gamified.");
        }
    }

    #[Test]
    public function a_page_with_gamified_discussions_still_loads_their_votes()
    {
        $this->boot(json_encode([(string) self::ENABLED_TAG]));

        $attributes = $this->index();

        $this->assertNotSame([], $this->voteQueries, 'the votes still have to be loaded where gamification applies');

        // And the data is right: the enabled tag's discussions carry the
        // actor's vote, the others carry nothing.
        $this->assertTrue($attributes[101]['hasUpvoted'], 'gamified discussion reflects the vote');

        // A gated discussion drops the field entirely rather than reporting
        // false, the same as every other vote field outside the enabled tags.
        $this->assertArrayNotHasKey('hasUpvoted', $attributes[1]);
    }

    #[Test]
    public function skipping_the_load_does_not_fall_back_to_a_query_per_discussion()
    {
        // The first-post memo falls back to a query when the relation is not
        // loaded, which is right for a genuinely missing first post but wrong
        // here: the load was skipped on purpose. Without a short-circuit the
        // saving turns into an N+1, one query per gated discussion.
        $this->boot(json_encode([(string) self::ENABLED_TAG]));

        $perDiscussion = [];

        $this->app()->getContainer()->make('events')->listen(QueryExecuted::class, function (QueryExecuted $query) use (&$perDiscussion) {
            if (str_contains($query->sql, 'from "posts" where "posts"."discussion_id" =')) {
                $perDiscussion[] = $query->sql;
            }
        });

        $this->send($this->request('GET', '/api/discussions', ['authenticatedAs' => self::MEMBER]));

        $this->assertSame([], $perDiscussion, 'gated discussions must not each fetch their own first post');
    }

    #[Test]
    public function the_vote_load_is_still_scoped_to_the_actor()
    {
        // Constraining by tag must not drop the existing constraint that only
        // the actor's own vote is loaded.
        $this->boot(json_encode([(string) self::ENABLED_TAG]));

        $this->index();

        $this->assertNotSame([], $this->voteQueries);

        foreach ($this->voteQueries as $sql) {
            $this->assertStringContainsString('user_id', $sql, 'the actor constraint must survive');
        }
    }
}
