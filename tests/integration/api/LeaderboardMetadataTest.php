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

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * The metric list has to reach the frontend for the selector to be built.
 *
 * It cannot be hardcoded there: metrics are extensible, so which ones exist
 * depends on what else is installed, and whether a metric can be limited to a
 * period is the metric's own answer.
 */
class LeaderboardMetadataTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private function boot(): void
    {
        $this->extension('fof-gamification');

        $this->prepareDatabase([
            User::class => [$this->normalUser()],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function forumAttributes(): array
    {
        $response = $this->send($this->request('GET', '/api/forums', ['authenticatedAs' => 1]));

        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody()->__toString(), true)['data']['attributes'];
    }

    #[Test]
    public function the_available_metrics_are_advertised()
    {
        $this->boot();

        $metrics = $this->forumAttributes()['fof-gamification.leaderboardMetrics'] ?? null;

        $this->assertIsArray($metrics);

        $keys = array_column($metrics, 'key');

        sort($keys);

        $this->assertSame(['discussions', 'posts', 'upvotes', 'votes'], $keys);
    }

    #[Test]
    public function each_metric_carries_its_label_and_whether_it_supports_periods()
    {
        $this->boot();

        $metrics = $this->forumAttributes()['fof-gamification.leaderboardMetrics'];

        $votes = current(array_filter($metrics, fn ($m) => $m['key'] === 'votes'));

        $this->assertSame('fof-gamification.forum.leaderboard.metric.votes', $votes['label']);
        $this->assertTrue($votes['supportsPeriods']);
    }

    /**
     * The page has to open on the admin's choice. Without this it picks the
     * first metric in the list, which is whatever order the registry happens
     * to be built in — and the setting silently does nothing.
     */
    #[Test]
    public function the_default_metric_is_advertised()
    {
        $this->setting(\FoF\Gamification\Leaderboard\MetricRegistry::DEFAULT_METRIC, 'upvotes');

        $this->boot();

        $this->assertSame('upvotes', $this->forumAttributes()['fof-gamification.defaultLeaderboardMetric'] ?? null);
    }

    #[Test]
    public function the_advertised_default_falls_back_when_unset()
    {
        $this->boot();

        $this->assertSame('posts', $this->forumAttributes()['fof-gamification.defaultLeaderboardMetric'] ?? null);
    }

    /**
     * Which period the board opens on, so the page does not have to assume.
     */
    #[Test]
    public function the_default_period_is_advertised()
    {
        $this->setting(\FoF\Gamification\Leaderboard\Period::DEFAULT_PERIOD, 'week');

        $this->boot();

        $this->assertSame('week', $this->forumAttributes()['fof-gamification.defaultLeaderboardPeriod'] ?? null);
    }

    /**
     * A year by default. All-time is a hall of fame settled long ago, while a
     * calendar year is still open and long enough that a quiet week does not
     * leave the board looking empty.
     */
    #[Test]
    public function the_default_period_is_a_year_when_unset()
    {
        $this->boot();

        $this->assertSame('year', $this->forumAttributes()['fof-gamification.defaultLeaderboardPeriod'] ?? null);
    }

    /**
     * The page needs to know which periods exist without duplicating the enum.
     */
    #[Test]
    public function the_available_periods_are_advertised()
    {
        $this->boot();

        $periods = $this->forumAttributes()['fof-gamification.leaderboardPeriods'] ?? null;

        $this->assertSame(['day', 'week', 'month', 'year', 'all'], $periods);
    }
}
