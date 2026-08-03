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
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Leaderboard\Metric\VotesReceived;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\Leaderboard\Period;
use FoF\Gamification\LeaderboardEligibility;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * The registry composes a metric's query with the eligibility rules and the
 * ordering, so this exercises the three together — a metric that is correct on
 * its own is no use if wrapping it produces invalid SQL or drops the filter.
 */
class LeaderboardRankingQueryTest extends EnhancedTestCase
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
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => 3, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>a</p></t>'],
                ['id' => 2, 'discussion_id' => 1, 'number' => 2, 'created_at' => $now->toDateTimeString(), 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>b</p></t>'],
                ['id' => 3, 'discussion_id' => 1, 'number' => 3, 'created_at' => $now->toDateTimeString(), 'user_id' => 5, 'type' => 'comment', 'content' => '<t><p>c</p></t>'],
            ],
            'post_votes' => [
                // alice: +1 recent. bob: +2 recent. carol: +1 recent, +1 old.
                ['id' => 1, 'post_id' => 1, 'user_id' => 4, 'value' => 1, 'created_at' => $now->copy()->startOfWeek()->addDay()->toDateTimeString()],
                ['id' => 2, 'post_id' => 2, 'user_id' => 3, 'value' => 1, 'created_at' => $now->copy()->startOfWeek()->addDay()->toDateTimeString()],
                ['id' => 3, 'post_id' => 2, 'user_id' => 5, 'value' => 1, 'created_at' => $now->copy()->startOfWeek()->addDay()->toDateTimeString()],
                ['id' => 4, 'post_id' => 3, 'user_id' => 3, 'value' => 1, 'created_at' => $now->copy()->startOfWeek()->addDay()->toDateTimeString()],
                ['id' => 5, 'post_id' => 3, 'user_id' => 4, 'value' => 1, 'created_at' => $now->copy()->startOfYear()->subMonths(2)->toDateTimeString()],
            ],
        ]);
    }

    /**
     * @return array<int, int> user id => score, in ranked order
     */
    private function rank(?\DateTimeInterface $since = null): array
    {
        $this->app();

        $registry = $this->app()->getContainer()->make(MetricRegistry::class);
        $metric = $this->app()->getContainer()->make(VotesReceived::class);

        $rows = $registry->rankingQuery($metric, $since)->get();

        $ranked = [];

        foreach ($rows as $row) {
            $ranked[(int) $row->user_id] = (int) $row->score;
        }

        return $ranked;
    }

    #[Test]
    public function all_time_ranks_every_vote()
    {
        $this->boot();

        // bob 2, carol 2 (one of them a year old), alice 1.
        // bob and carol tie; the id tiebreak puts bob (4) before carol (5).
        $this->assertSame([4 => 2, 5 => 2, 3 => 1], $this->rank());
    }

    #[Test]
    public function a_period_only_counts_votes_cast_within_it()
    {
        $this->boot();

        // Carol's year-old vote drops out, leaving her on 1.
        $this->assertSame([4 => 2, 3 => 1, 5 => 1], $this->rank(Period::Week->since()));
    }

    /**
     * Everyone here scores the same, so only the tiebreak decides the order.
     *
     * Without one the database is free to return tied rows however it likes,
     * and paging through them would drop and repeat people — the ordering has
     * to be total, not just "by score".
     */
    #[Test]
    public function tied_scores_are_ordered_deterministically()
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();

        $users = [$this->normalUser()];
        $posts = [];
        $votes = [];

        // Ten users, one post each, exactly one upvote each: a ten-way tie.
        //
        // Inserted in descending id order on purpose. Without a tiebreak a
        // database is free to hand tied rows back in whatever order suits it,
        // and SQLite's happens to be the order the rows were written — so ids
        // ascending would agree with insertion order and hide a missing
        // tiebreak. Writing them backwards makes the two disagree, and the
        // wrong answer becomes visible on every driver.
        foreach (array_reverse(range(3, 12)) as $i) {
            $users[] = ['id' => $i, 'username' => "user$i", 'email' => "user$i@machine.local", 'is_email_confirmed' => 1];
            $posts[] = ['id' => $i, 'discussion_id' => 1, 'number' => $i, 'created_at' => $now->toDateTimeString(), 'user_id' => $i, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
            $votes[] = ['id' => $i, 'post_id' => $i, 'user_id' => 2, 'value' => 1, 'created_at' => $now->toDateTimeString()];
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 3, 'comment_count' => 10, 'is_private' => 0],
            ],
            Post::class  => $posts,
            'post_votes' => $votes,
        ]);

        $this->app();

        $registry = $this->app()->getContainer()->make(MetricRegistry::class);
        $metric = $this->app()->getContainer()->make(VotesReceived::class);

        // Read the same ranking in two pages, as the page itself does.
        $first = $registry->rankingQuery($metric, null)->limit(5)->offset(0)->pluck('user_id')->all();
        $second = $registry->rankingQuery($metric, null)->limit(5)->offset(5)->pluck('user_id')->all();

        $paged = array_map('intval', array_merge($first, $second));

        $this->assertSame(range(3, 12), $paged, 'tied users must page in a stable, complete order');
        $this->assertSame($paged, array_unique($paged), 'no user may appear on two pages');

        // Reading the rows back cannot prove this on its own. Grouping by
        // user_id and joining users both walk those indexes in key order, so
        // SQLite returns tied rows ascending by id whether or not a tiebreak
        // was asked for — the stability is a property of its query plan, not
        // of the query, and MySQL under a different plan need not repeat it.
        //
        // So assert the ordering is actually requested. This is the part that
        // holds on every driver.
        $sql = $registry->rankingQuery($metric, null)->toSql();

        $this->assertMatchesRegularExpression(
            '/order by .*score.* desc, .*user_id.*/i',
            $sql,
            'the ranking must ask for a total order, not just by score'
        );
    }

    /**
     * The registry applies eligibility around whatever the metric returned, so
     * an excluded user must not appear however high they scored.
     */
    #[Test]
    public function excluded_users_are_not_ranked()
    {
        $this->boot([LeaderboardEligibility::EXCLUDED_USERS => json_encode([4])]);

        $ranked = $this->rank();

        $this->assertArrayNotHasKey(4, $ranked, 'bob is excluded and must not be ranked');
        $this->assertSame([5 => 2, 3 => 1], $ranked);
    }
}
