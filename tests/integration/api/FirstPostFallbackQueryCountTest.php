<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Tests\integration\api;

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
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * A discussion's vote fields resolve through its first post. Index endpoints
 * eager-load it, but two cases were left to a query per discussion, plus one
 * for its votes:
 *
 * - a discussion whose first_post_id doesn't resolve, as an import leaves it,
 *   which is looked up by post number instead;
 * - an endpoint that serializes discussions without loading their first
 *   posts, such as a tag's lastPostedDiscussion.
 *
 * Half the discussions here are of each kind, each by a different author on
 * its own tag, so neither shared records nor a single kind can hide a
 * per-discussion query.
 */
class FirstPostFallbackQueryCountTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const ITEMS = 20;
    private const MEMBER = 2;

    /** @var string[]|null */
    private ?array $log = null;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-tags', 'fof-gamification');

        // The seeding migration enabled only the tags that existed when it
        // ran, so name every tag used here.
        $this->setting(EnabledTags::SETTING, json_encode(array_map('strval', [...range(1, self::ITEMS), 30, 40])));

        $now = Carbon::now()->toDateTimeString();
        $users = $tags = $discussions = $posts = $discussionTags = $votes = [];

        $users[] = ['id' => self::MEMBER, 'username' => 'member', 'email' => 'member@machine.local', 'is_email_confirmed' => 1];

        for ($i = 1; $i <= self::ITEMS; $i++) {
            $authorId = 10 + $i;
            $discussionId = 100 + $i;
            $postId = 100 + $i;

            $users[] = ['id' => $authorId, 'username' => "author$i", 'email' => "author$i@machine.local", 'is_email_confirmed' => 1];
            $tags[] = ['id' => $i, 'name' => "Tag $i", 'slug' => "tag-$i", 'position' => $i, 'is_restricted' => 0, 'last_posted_discussion_id' => $discussionId, 'last_posted_at' => $now];

            // One long discussion whose first_post_id was never set, with a
            // different author on every post.
            $posts[] = ['id' => $i, 'discussion_id' => 1, 'number' => $i, 'created_at' => $now, 'user_id' => $authorId, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
            $votes[] = ['post_id' => $i, 'user_id' => self::MEMBER, 'value' => 1];

            // And a page of discussions, every other one missing its
            // first_post_id. The member upvoted each first post.
            $discussions[] = ['id' => $discussionId, 'title' => "D$discussionId", 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => $authorId, 'first_post_id' => $i % 2 ? null : $postId, 'comment_count' => 1, 'is_private' => 0];
            $posts[] = ['id' => $postId, 'discussion_id' => $discussionId, 'number' => 1, 'created_at' => $now, 'user_id' => $authorId, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
            $discussionTags[] = ['discussion_id' => $discussionId, 'tag_id' => $i];
            $votes[] = ['post_id' => $postId, 'user_id' => self::MEMBER, 'value' => 1];
        }

        // Older than the rest, so it sorts after them on the index rather
        // than landing on a page by how the database breaks a tie.
        $earlier = Carbon::now()->subDay()->toDateTimeString();
        $discussions[] = ['id' => 1, 'title' => 'Imported', 'created_at' => $earlier, 'last_posted_at' => $earlier, 'user_id' => 11, 'first_post_id' => null, 'comment_count' => self::ITEMS, 'is_private' => 0];
        $discussionTags[] = ['discussion_id' => 1, 'tag_id' => 1];

        $this->prepareDatabase([
            User::class  => $users,
            Group::class => [
                ['id' => 101, 'name_singular' => 'Voter', 'name_plural' => 'Voters'],
            ],
            'group_user' => [
                ['user_id' => self::MEMBER, 'group_id' => 101],
            ],
            'group_permission' => [
                ['group_id' => 101, 'permission' => 'discussion.votePosts'],
                ['group_id' => 101, 'permission' => 'discussion.canSeeVotes'],
            ],
            Tag::class        => $tags,
            Discussion::class => $discussions,
            Post::class       => $posts,
            'discussion_tag'  => $discussionTags,
            'post_votes'      => $votes,
        ]);
    }

    /**
     * Give every discussion on the page the same kind of first post. A page
     * mixing them runs the index's eager load and the batched lookup once
     * each, which a single-item page can't, so each kind is measured on its
     * own; the mix is covered by the vote state tests.
     */
    private function firstPostIds(bool $missing): void
    {
        $discussions = $this->database()->table('discussions')->where('id', '>', 100);

        $missing
            ? $discussions->update(['first_post_id' => null])
            : $discussions->update(['first_post_id' => $this->database()->raw($this->database()->getQueryGrammar()->wrap('id'))]);
    }

    public static function kinds(): array
    {
        return ['first_post_id missing' => [true], 'first_post_id set' => [false]];
    }

    /** @return array<string, array<int, mixed>> each case once per kind */
    private static function withKinds(array $cases): array
    {
        $out = [];

        foreach ($cases as $name => $args) {
            foreach (self::kinds() as $kind => $kindArgs) {
                $out["$name, $kind"] = [...$args, ...$kindArgs];
            }
        }

        return $out;
    }

    private function listenForQueries(): void
    {
        $this->app()->getContainer()->make('events')->listen(QueryExecuted::class, function (QueryExecuted $query) {
            if ($this->log !== null) {
                $this->log[] = $query->sql;
            }
        });
    }

    /** @return array{0: int, 1: array<string, mixed>, 2: string[]} */
    private function measure(string $path, array $query, ?int $actor): array
    {
        $this->log = [];
        $response = $this->send(
            $this->request('GET', $path, $actor ? ['authenticatedAs' => $actor] : [])->withQueryParams($query)
        );
        $log = $this->log;
        $this->log = null;

        $this->assertEquals(200, $response->getStatusCode());

        return [count($log), json_decode($response->getBody()->getContents(), true), $log];
    }

    /** @return array<int, array<string, mixed>> discussions by id, primary or included */
    private static function discussions(array $body): array
    {
        $byId = [];

        foreach ([...$body['data'], ...($body['included'] ?? [])] as $row) {
            if ($row['type'] === 'discussions') {
                $byId[(int) $row['id']] = $row;
            }
        }

        return $byId;
    }

    public static function pagedLists(): array
    {
        // Posts from as many discussions, each serializing its own.
        $acrossDiscussions = ['/api/posts', ['filter' => ['id' => implode(',', range(101, 100 + self::ITEMS))]]];
        $discussions = ['/api/discussions', []];
        // Every post in one discussion (whose first_post_id is always
        // missing): a control, as it needs looking up once whatever the page.
        $oneDiscussion = ['/api/posts', ['filter' => ['discussion' => 1]]];

        return [...self::withKinds([
            'posts across discussions, guest'  => [...$acrossDiscussions, null],
            'posts across discussions, member' => [...$acrossDiscussions, self::MEMBER],
            'posts across discussions, admin'  => [...$acrossDiscussions, 1],
            'discussions, guest'               => [...$discussions, null],
            'discussions, member'              => [...$discussions, self::MEMBER],
            'discussions, admin'               => [...$discussions, 1],
        ]),
            'posts in one discussion, guest'  => [...$oneDiscussion, null, true],
            'posts in one discussion, member' => [...$oneDiscussion, self::MEMBER, true],
            'posts in one discussion, admin'  => [...$oneDiscussion, 1, true],
        ];
    }

    #[Test]
    #[DataProvider('pagedLists')]
    public function the_query_count_does_not_grow_with_the_page(string $path, array $query, ?int $actor, bool $missing)
    {
        $this->firstPostIds($missing);
        $this->listenForQueries();

        // Warm one-off caches (the actor's permissions, last_seen_at) with a
        // single-item page, then measure the full page before the single
        // item. Anything per item that the full page caches can only make the
        // single item cheaper, so an N+1 hidden behind a cache still fails.
        $this->measure($path, $query + ['page' => ['limit' => 1]], $actor);
        [$many, $manyBody, $log] = $this->measure($path, $query + ['page' => ['limit' => self::ITEMS]], $actor);
        [$one, $oneBody] = $this->measure($path, $query + ['page' => ['limit' => 1]], $actor);

        $this->assertCount(self::ITEMS, $manyBody['data']);
        $this->assertCount(1, $oneBody['data']);

        $this->assertSame($one, $many, "1 item ran $one queries, ".self::ITEMS." ran $many:\n".implode("\n", $log));
    }

    public static function actors(): array
    {
        return self::withKinds(['guest' => [null], 'member' => [self::MEMBER], 'admin' => [1]]);
    }

    /**
     * The tags endpoint has no page size to vary, so the tags are deleted
     * down to one between the two measurements instead.
     */
    #[Test]
    #[DataProvider('actors')]
    public function the_tag_list_does_not_query_per_last_posted_discussion(?int $actor, bool $missing)
    {
        $this->firstPostIds($missing);
        $this->listenForQueries();

        $query = ['include' => 'lastPostedDiscussion'];

        $this->measure('/api/tags', $query, $actor);
        [$many, $manyBody, $log] = $this->measure('/api/tags', $query, $actor);

        $this->database()->table('tags')->where('id', '>', 1)->delete();

        [$one, $oneBody] = $this->measure('/api/tags', $query, $actor);

        $this->assertCount(self::ITEMS, self::discussions($manyBody));
        $this->assertCount(1, self::discussions($oneBody));

        $this->assertSame($one, $many, "1 tag ran $one queries, ".self::ITEMS." ran $many:\n".implode("\n", $log));
    }

    public static function voteStateLists(): array
    {
        $ids = implode(',', [...range(101, 100 + self::ITEMS), 300, 400]);

        return [
            'discussions'              => ['/api/discussions', ['page' => ['limit' => 50]]],
            'posts across discussions' => ['/api/posts', ['filter' => ['id' => $ids], 'page' => ['limit' => 50]]],
            'tags'                     => ['/api/tags', ['include' => 'lastPostedDiscussion']],
        ];
    }

    #[Test]
    #[DataProvider('voteStateLists')]
    public function the_batched_lookup_serves_each_actor_their_own_vote_state(string $path, array $query)
    {
        $now = Carbon::now()->toDateTimeString();

        $this->prepareDatabase([
            Tag::class => [
                ['id' => 30, 'name' => 'Downvoted', 'slug' => 'downvoted', 'position' => 30, 'is_restricted' => 0, 'last_posted_discussion_id' => 300, 'last_posted_at' => $now],
                ['id' => 40, 'name' => 'Empty', 'slug' => 'empty', 'position' => 40, 'is_restricted' => 0, 'last_posted_discussion_id' => 400, 'last_posted_at' => $now],
            ],
            Discussion::class => [
                // A discussion whose first post resolves, carrying a downvote
                // rather than the upvotes on everything else.
                ['id' => 300, 'title' => 'Downvoted', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 11, 'first_post_id' => 300, 'comment_count' => 1, 'is_private' => 0],
                // And one with no post numbered 1 at all.
                ['id' => 400, 'title' => 'No first post', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 11, 'first_post_id' => null, 'comment_count' => 1, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 300, 'discussion_id' => 300, 'number' => 1, 'created_at' => $now, 'user_id' => 11, 'type' => 'comment', 'content' => '<t><p>x</p></t>'],
                ['id' => 400, 'discussion_id' => 400, 'number' => 2, 'created_at' => $now, 'user_id' => 11, 'type' => 'comment', 'content' => '<t><p>x</p></t>'],
            ],
            'discussion_tag' => [
                ['discussion_id' => 300, 'tag_id' => 30],
                ['discussion_id' => 400, 'tag_id' => 40],
            ],
            'post_votes' => [
                ['post_id' => 300, 'user_id' => self::MEMBER, 'value' => -1],
                // Someone else's votes must not be read as the actor's: on a
                // looked-up first post (101) and on a loaded one (102). The
                // admin's own vote is a downvote on 101.
                ['post_id' => 101, 'user_id' => 11, 'value' => -1],
                ['post_id' => 102, 'user_id' => 12, 'value' => -1],
                ['post_id' => 101, 'user_id' => 1, 'value' => -1],
            ],
        ]);

        $voted = range(101, 100 + self::ITEMS);
        if ($path === '/api/discussions') {
            // The index also lists the long imported discussion.
            $voted[] = 1;
        }

        $member = self::discussions($this->measure($path, $query, self::MEMBER)[1]);
        $this->assertCount(count($voted) + 2, $member);

        foreach ($voted as $id) {
            $attributes = $member[$id]['attributes'];
            $this->assertTrue($attributes['hasUpvoted'], "discussion $id carries the member's upvote");
            $this->assertFalse($attributes['hasDownvoted'], "discussion $id carries no downvote of the member's");
            $this->assertTrue($attributes['canVote'], "the member can vote on discussion $id");
        }

        $this->assertFalse($member[300]['attributes']['hasUpvoted']);
        $this->assertTrue($member[300]['attributes']['hasDownvoted'], 'a resolved first post keeps its own vote');

        // With nothing to vote on there is no vote: reported as false, as a
        // discussion still being looked up can't be left out of the document.
        $this->assertFalse($member[400]['attributes']['hasUpvoted']);
        $this->assertFalse($member[400]['attributes']['hasDownvoted']);
        $this->assertFalse($member[400]['attributes']['canVote'], 'there is nothing to vote on without a first post');

        $admin = self::discussions($this->measure($path, $query, 1)[1]);
        $this->assertCount(count($voted) + 2, $admin);
        $this->assertTrue($admin[101]['attributes']['hasDownvoted']);
        $this->assertFalse($admin[101]['attributes']['hasUpvoted']);
        $this->assertFalse($admin[102]['attributes']['hasDownvoted']);
        $this->assertFalse($admin[102]['attributes']['hasUpvoted']);
        $this->assertTrue($admin[102]['attributes']['canVote']);

        $guest = self::discussions($this->measure($path, $query, null)[1]);
        $this->assertCount(count($voted) + 2, $guest);

        foreach ($guest as $id => $discussion) {
            $this->assertArrayNotHasKey('hasUpvoted', $discussion['attributes'], "a guest gets no vote state on discussion $id");
            $this->assertArrayNotHasKey('hasDownvoted', $discussion['attributes'], "a guest gets no vote state on discussion $id");
            $this->assertFalse($discussion['attributes']['canVote'], "a guest cannot vote on discussion $id");
        }
    }

    #[Test]
    public function an_explicit_first_post_include_is_not_replaced_by_the_lookup()
    {
        $body = $this->measure('/api/discussions', ['include' => 'firstPost', 'page' => ['limit' => 50]], self::MEMBER)[1];

        foreach (self::discussions($body) as $id => $discussion) {
            // The lookup only feeds the vote fields; the relationship still
            // says what first_post_id says.
            $expected = $id === 1 || $id % 2 ? null : ['type' => 'posts', 'id' => (string) $id];

            $this->assertSame($expected, $discussion['relationships']['firstPost']['data'] ?? null, "discussion $id");
            $this->assertTrue($discussion['attributes']['hasUpvoted'], "discussion $id still reflects the member's upvote");
        }
    }

    /** @return string[] the first-post lookups among the queries */
    private static function lookups(array $log): array
    {
        // MySQL quotes with backticks, SQLite and PostgreSQL with double quotes.
        return array_values(array_filter($log, fn (string $sql) => preg_match('/["`]number["`] = \?/', $sql) === 1));
    }

    /**
     * The control for the test below: with every tag enabled the lookup runs,
     * so the pattern it searches for is known to match on this database.
     */
    #[Test]
    public function a_discussion_inside_the_enabled_tags_is_looked_up()
    {
        $this->listenForQueries();

        $this->assertNotSame([], self::lookups($this->measure('/api/discussions', ['page' => ['limit' => 50]], self::MEMBER)[2]));
    }

    #[Test]
    public function a_discussion_outside_the_enabled_tags_is_not_looked_up()
    {
        // Gamification on the even tags only: the discussions missing their
        // first_post_id (the odd ones, and the imported one) are all outside.
        $this->setting(EnabledTags::SETTING, json_encode(array_map('strval', range(2, self::ITEMS, 2))));

        $this->listenForQueries();

        [, $body, $log] = $this->measure('/api/discussions', ['page' => ['limit' => 50]], self::MEMBER);

        $this->assertCount(self::ITEMS + 1, self::discussions($body));

        foreach (self::discussions($body) as $id => $discussion) {
            if ($id !== 1 && $id % 2 === 0) {
                $this->assertTrue($discussion['attributes']['hasUpvoted'], "discussion $id is gamified");
                $this->assertTrue($discussion['attributes']['canVote'], "discussion $id is gamified");
            } else {
                $this->assertArrayNotHasKey('hasUpvoted', $discussion['attributes'], "discussion $id is not gamified");
                $this->assertFalse($discussion['attributes']['canVote'], "discussion $id is not gamified");
            }
        }

        $this->assertSame([], self::lookups($log), 'only gamified discussions need their first post looked up');
    }

    /**
     * The lookup must not stand in for an explicitly included firstPost,
     * which is loaded scoped to what the actor may see: the lookup's posts
     * are kept out of the relation for that reason. Here the discussion is
     * reached both without the include (as tag 21's last posted discussion)
     * and with it (through tag 2's parent), and its first post is hidden.
     */
    #[Test]
    public function the_lookup_does_not_bypass_the_scoping_of_an_included_first_post()
    {
        $now = Carbon::now()->toDateTimeString();

        $this->prepareDatabase([
            Tag::class => [
                ['id' => 21, 'name' => 'Parent', 'slug' => 'parent', 'position' => 21, 'is_restricted' => 0, 'last_posted_discussion_id' => 121, 'last_posted_at' => $now],
            ],
            Discussion::class => [
                ['id' => 121, 'title' => 'Hidden first post', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 11, 'first_post_id' => 121, 'comment_count' => 1, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 121, 'discussion_id' => 121, 'number' => 1, 'created_at' => $now, 'user_id' => 11, 'type' => 'comment', 'content' => '<t><p>hidden</p></t>', 'hidden_at' => $now, 'hidden_user_id' => 1],
            ],
            'discussion_tag' => [
                ['discussion_id' => 121, 'tag_id' => 21],
            ],
        ]);

        $this->setting(EnabledTags::SETTING, json_encode(array_map('strval', [...range(1, self::ITEMS), 21, 30, 40])));
        $this->database()->table('tags')->where('id', 2)->update(['parent_id' => 21]);

        $body = $this->measure('/api/tags', ['include' => 'lastPostedDiscussion,parent.lastPostedDiscussion.firstPost'], self::MEMBER)[1];

        $this->assertArrayHasKey(121, self::discussions($body), 'the discussion is in the document');

        foreach ($body['included'] ?? [] as $row) {
            $this->assertFalse($row['type'] === 'posts' && $row['id'] === '121', 'a hidden first post is not served to a member');
        }
    }
}
