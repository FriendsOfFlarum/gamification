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
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\LeaderboardEligibility;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * The leaderboard endpoint.
 *
 * A ranking is a computed thing rather than a list of records, so it gets its
 * own resource: the position and the score belong to the entry, and the user
 * is compounded alongside it. Ranking users through the users endpoint only
 * worked while every metric happened to be a column on that table.
 */
class LeaderboardEndpointTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        // Frozen mid-week and mid-month. These fixtures place rows relative to
        // "now", and the periods they are checked against are calendar-based,
        // so on a Monday a row two days old falls into the previous week and
        // the expectations change under you.
        Carbon::setTestNow(Carbon::parse('2026-08-12 12:00:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    /**
     * @param array<string, mixed> $settings
     */
    private function boot(array $settings = []): void
    {
        foreach ($settings as $key => $value) {
            $this->setting($key, $value);
        }

        $this->extension('fof-gamification');

        $now = Carbon::now();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'alice', 'email' => 'alice@machine.local', 'is_email_confirmed' => 1],
                ['id' => 4, 'username' => 'bob', 'email' => 'bob@machine.local', 'is_email_confirmed' => 1],
                ['id' => 5, 'username' => 'carol', 'email' => 'carol@machine.local', 'is_email_confirmed' => 1],
            ],
            Group::class => [
                ['id' => 100, 'name_singular' => 'Staff', 'name_plural' => 'Staff'],
            ],
            'group_user' => [
                ['user_id' => 5, 'group_id' => 100],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => 3, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>a</p></t>'],
                ['id' => 2, 'discussion_id' => 1, 'number' => 2, 'created_at' => $now->toDateTimeString(), 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>b</p></t>'],
                ['id' => 3, 'discussion_id' => 1, 'number' => 3, 'created_at' => $now->toDateTimeString(), 'user_id' => 5, 'type' => 'comment', 'content' => '<t><p>c</p></t>'],
            ],
            'post_votes' => [
                // All time: bob 3, carol 2, alice 1 — no ties, so the order is
                // unambiguous. Alice's single vote is the year-old one, which
                // puts her outside any shorter period.
                ['id' => 1, 'post_id' => 2, 'user_id' => 3, 'value' => 1, 'created_at' => $now->toDateTimeString()],
                ['id' => 2, 'post_id' => 2, 'user_id' => 5, 'value' => 1, 'created_at' => $now->toDateTimeString()],
                ['id' => 3, 'post_id' => 2, 'user_id' => 2, 'value' => 1, 'created_at' => $now->toDateTimeString()],
                ['id' => 4, 'post_id' => 3, 'user_id' => 3, 'value' => 1, 'created_at' => $now->toDateTimeString()],
                ['id' => 5, 'post_id' => 3, 'user_id' => 4, 'value' => 1, 'created_at' => $now->toDateTimeString()],
                ['id' => 6, 'post_id' => 1, 'user_id' => 4, 'value' => 1, 'created_at' => $now->copy()->startOfYear()->subMonths(2)->toDateTimeString()],
            ],
        ]);
    }

    /**
     * @param array<string, mixed> $query
     *
     * @return array<string, mixed>
     */
    private function get(array $query = [], ?int $actor = 1): array
    {
        $options = $actor !== null ? ['authenticatedAs' => $actor] : [];

        $response = $this->send(
            $this->request('GET', '/api/leaderboard-entries', $options)->withQueryParams($query)
        );

        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->__toString());

        return json_decode($response->getBody()->__toString(), true);
    }

    #[Test]
    public function it_ranks_users_by_score()
    {
        $this->boot();

        $body = $this->get(['filter' => ['metric' => 'votes', 'period' => 'all']]);

        $this->assertSame(
            ['4', '5', '3'],
            array_map(fn ($row) => $row['relationships']['user']['data']['id'], $body['data']),
            'bob 3, carol 2, alice 1'
        );

        $this->assertSame([3, 2, 1], array_map(fn ($row) => $row['attributes']['score'], $body['data']));
    }

    /**
     * Position is the entry's own, not a count of what happens to be on this
     * page — the second page has to continue from where the first stopped.
     */
    #[Test]
    public function each_entry_carries_its_position()
    {
        $this->boot();

        $body = $this->get();

        $this->assertSame([1, 2, 3], array_map(fn ($row) => $row['attributes']['position'], $body['data']));
    }

    #[Test]
    public function positions_continue_across_pages()
    {
        $this->boot();

        $second = $this->get(['filter' => ['metric' => 'votes', 'period' => 'all'], 'page' => ['offset' => 2, 'limit' => 2]]);

        $this->assertSame([3], array_map(fn ($row) => $row['attributes']['position'], $second['data']));
        $this->assertSame(['3'], array_map(fn ($row) => $row['relationships']['user']['data']['id'], $second['data']));
    }

    #[Test]
    public function the_ranked_user_is_compounded_into_the_payload()
    {
        $this->boot();

        $body = $this->get(['include' => 'user']);

        $usernames = array_column(
            array_map(fn ($row) => $row['attributes'], array_filter($body['included'] ?? [], fn ($r) => $r['type'] === 'users')),
            'username'
        );

        $this->assertContains('bob', $usernames);
        $this->assertContains('carol', $usernames);
        $this->assertContains('alice', $usernames);
    }

    #[Test]
    public function a_metric_can_be_chosen()
    {
        $this->boot();

        // By posts written everyone is level on one, so the id tiebreak
        // decides: alice 3, bob 4, carol 5.
        $body = $this->get(['filter' => ['metric' => 'posts']]);

        $this->assertSame(
            ['3', '4', '5'],
            array_map(fn ($row) => $row['relationships']['user']['data']['id'], $body['data'])
        );
    }

    #[Test]
    public function a_period_can_be_chosen()
    {
        $this->boot();

        // Alice's only vote is the year-old one, so within a week she has
        // nothing to be ranked on and drops off the board entirely — a period
        // decides who appears, not just the order.
        $body = $this->get(['filter' => ['metric' => 'votes', 'period' => 'week']]);

        $this->assertSame(
            ['4', '5'],
            array_map(fn ($row) => $row['relationships']['user']['data']['id'], $body['data'])
        );
        $this->assertSame([3, 2], array_map(fn ($row) => $row['attributes']['score'], $body['data']));
    }

    /**
     * An unknown metric is a stale link or a disabled extension, not something
     * worth an error page — fall back rather than break the page.
     */
    #[Test]
    public function an_unknown_metric_falls_back_to_the_default()
    {
        $this->boot();

        $body = $this->get(['filter' => ['metric' => 'no-such-metric']]);

        // Falls back to posts written, where everybody has one and the
        // tiebreak decides.
        $this->assertSame(
            ['3', '4', '5'],
            array_map(fn ($row) => $row['relationships']['user']['data']['id'], $body['data'])
        );
    }

    #[Test]
    public function excluded_users_are_not_listed()
    {
        $this->boot([LeaderboardEligibility::EXCLUDED_GROUPS => json_encode([100])]);

        $ids = array_map(fn ($row) => $row['relationships']['user']['data']['id'], $this->get()['data']);

        $this->assertNotContains('5', $ids, 'carol is in the excluded group');
        $this->assertSame(['3', '4'], $ids);
        $this->assertSame([1, 2], array_map(fn ($row) => $row['attributes']['position'], $this->get()['data']));
    }

    /**
     * The rankings page is behind a permission, and the endpoint that feeds it
     * has to answer to the same one rather than trusting the page not to ask.
     */
    /**
     * The viewer's own position is the fact they came for, and a page of the
     * top twenty cannot tell somebody who is far down it.
     */
    #[Test]
    public function the_response_reports_where_the_viewer_stands()
    {
        $this->boot();

        // Bob wrote one post, as did everyone; the tiebreak puts him second.
        $meta = $this->get([], 4)['meta'] ?? [];

        $this->assertSame(2, $meta['standing']['position'] ?? null);
        $this->assertSame(1, $meta['standing']['score'] ?? null);
    }

    #[Test]
    public function a_viewer_who_is_not_ranked_has_no_standing()
    {
        $this->boot();

        // User 1 is the admin actor and has written nothing.
        $meta = $this->get([], 1)['meta'] ?? [];

        $this->assertArrayHasKey('standing', $meta);
        $this->assertNull($meta['standing']);
    }

    /**
     * The standing has to answer for the ranking actually on screen, not the
     * default one.
     */
    #[Test]
    public function the_standing_follows_the_chosen_metric()
    {
        $this->boot();

        // Bob leads on votes with 3, though he is second on posts.
        $meta = $this->get(['filter' => ['metric' => 'votes']], 4)['meta'] ?? [];

        $this->assertSame(1, $meta['standing']['position'] ?? null);
        $this->assertSame(3, $meta['standing']['score'] ?? null);
    }

    /**
     * Movement is per-entry: which way that person is going, not just where
     * they sit.
     */
    #[Test]
    public function entries_report_which_way_they_are_moving()
    {
        $this->boot();

        $body = $this->get(['filter' => ['metric' => 'posts', 'period' => 'week']]);

        // Every entry carries the field, even where there is nothing to say.
        foreach ($body['data'] as $row) {
            $this->assertArrayHasKey('movement', $row['attributes']);
        }
    }

    #[Test]
    public function all_time_entries_report_no_movement()
    {
        $this->boot();

        // Ask for all-time explicitly: the default period is a month now, and
        // a month does have a previous window to compare against.
        foreach ($this->get(['filter' => ['period' => 'all']])['data'] as $row) {
            $this->assertNull($row['attributes']['movement']);
        }
    }

    #[Test]
    public function the_response_carries_highlights_with_the_named_people_resolved()
    {
        $this->boot();

        $meta = $this->get(['filter' => ['metric' => 'posts', 'period' => 'week']])['meta'] ?? [];

        $this->assertArrayHasKey('highlights', $meta);

        foreach ($meta['highlights'] as $highlight) {
            // Named, so the client can render a face and a link without a
            // second request.
            $this->assertArrayHasKey('displayName', $highlight);
            $this->assertArrayHasKey('avatarUrl', $highlight);
        }
    }

    /**
     * Entries are computed, so their ids are composed rather than stored —
     * and the composition has to name the ranking. A bare position means
     * entry "1" of the monthly board and entry "1" of the yearly one are the
     * same record to a client store keyed on type and id, so switching period
     * hands back stale figures and movement never appears.
     */
    #[Test]
    public function entry_ids_distinguish_one_ranking_from_another()
    {
        $this->boot();

        $ids = fn (array $query) => array_column($this->get($query)['data'], 'id');

        $byPosts = $ids(['filter' => ['metric' => 'posts', 'period' => 'all']]);
        $byVotes = $ids(['filter' => ['metric' => 'votes', 'period' => 'all']]);

        $this->assertNotEmpty($byPosts);
        $this->assertSame([], array_intersect($byPosts, $byVotes), 'two rankings must not share entry ids');
    }

    #[Test]
    public function it_is_refused_without_the_permission()
    {
        $this->boot();

        // Granted to Guest by the install migration, so it reaches everyone
        // until a forum takes it away. Take it away.
        $this->database()->table('group_permission')
            ->where('permission', 'fof.gamification.viewRankingPage')
            ->delete();

        $response = $this->send($this->request('GET', '/api/leaderboard-entries', ['authenticatedAs' => 3]));

        $this->assertEquals(403, $response->getStatusCode());
    }
}
