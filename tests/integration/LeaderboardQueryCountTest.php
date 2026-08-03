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
use FoF\Gamification\Leaderboard\Metric\PostsWritten;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\Leaderboard\Period;
use FoF\Gamification\Tests\EnhancedTestCase;
use Illuminate\Database\Events\QueryExecuted;
use PHPUnit\Framework\Attributes\Test;

/**
 * What one leaderboard costs the database.
 *
 * The page, the movement column, the viewer's standing and the highlights all
 * want the same rankings, and each used to compute them from scratch: four
 * full scans of the period plus two of the one before it, for a single
 * request. The ranking is aggregated over every post in the window, so these
 * are the expensive queries on the page and duplicating them is the whole
 * cost.
 *
 * Counted rather than eyeballed, because a duplicate scan is invisible in a
 * response that looks perfectly correct.
 */
class LeaderboardQueryCountTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow(Carbon::parse('2026-08-12 12:00:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    private function boot(): void
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $thisYear = $now->copy()->startOfYear()->addMonth();
        $lastYear = $now->copy()->startOfYear()->subMonths(2);

        $users = [$this->normalUser()];
        $posts = [];
        $id = 1;

        foreach (range(3, 12) as $uid) {
            $users[] = ['id' => $uid, 'username' => "u$uid", 'email' => "u$uid@machine.local", 'is_email_confirmed' => 1];

            foreach ([$thisYear, $lastYear] as $when) {
                for ($i = 0; $i < 3; $i++) {
                    $posts[] = ['id' => $id++, 'discussion_id' => 1, 'number' => $id, 'created_at' => $when->copy()->addDays($i)->toDateTimeString(), 'user_id' => $uid, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
                }
            }
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);
    }

    /**
     * Run a request and count the ranking aggregates it performs.
     *
     * Only the scans over the whole window are counted: the page slice and the
     * pagination count are bounded work, where these grow with the forum.
     */
    private function rankingScans(callable $work): int
    {
        $this->app();

        $scans = 0;

        $this->app()->getContainer()->make('events')->listen(
            QueryExecuted::class,
            function (QueryExecuted $query) use (&$scans) {
                $sql = $query->sql;

                // The aggregate subquery, however it is wrapped. Excludes the
                // paginated slice and the row count, which do not scan.
                if (str_contains($sql, 'as score') && !str_contains($sql, 'limit')) {
                    $scans++;
                }
            }
        );

        $work();

        return $scans;
    }

    /**
     * Two windows: the period on screen and the one before it, for movement.
     * Anything beyond that is the same question asked twice.
     */
    #[Test]
    public function a_page_load_scans_each_window_once()
    {
        $this->boot();

        $scans = $this->rankingScans(function () {
            $response = $this->send(
                $this->request('GET', '/api/leaderboard-entries', ['authenticatedAs' => 1])
                    ->withQueryParams(['filter' => ['metric' => 'posts', 'period' => 'year']])
            );

            $this->assertEquals(200, $response->getStatusCode());
        });

        $this->assertLessThanOrEqual(2, $scans, "a page load performed $scans ranking scans; two windows should need two");
    }

    /**
     * The memo is per request, so a second request must not reuse the first
     * one's results — they may be a different metric, period, or actor.
     */
    #[Test]
    public function a_second_request_computes_its_own_rankings()
    {
        $this->boot();

        $this->app();

        $registry = $this->app()->getContainer()->make(MetricRegistry::class);
        $metric = $this->app()->getContainer()->make(PostsWritten::class);

        $first = $registry->rankingQuery($metric, Period::Year->since())->get();
        $second = $registry->rankingQuery($metric, Period::Month->since())->get();

        $this->assertNotEquals(
            $first->pluck('score')->all(),
            $second->pluck('score')->all(),
            'a different period must not be served the previous answer'
        );
    }
}
