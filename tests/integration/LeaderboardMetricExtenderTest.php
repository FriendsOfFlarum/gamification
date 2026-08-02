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

use FoF\Gamification\Extend\LeaderboardMetric;
use FoF\Gamification\Leaderboard\Metric\DiscussionsStarted;
use FoF\Gamification\Leaderboard\Metric\PostsWritten;
use FoF\Gamification\Leaderboard\Metric\UpvotesReceived;
use FoF\Gamification\Leaderboard\MetricInterface;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\Tests\EnhancedTestCase;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Query\Builder;
use PHPUnit\Framework\Attributes\Test;

/**
 * Other extensions must be able to add a way of ranking people without this
 * one knowing anything about them — a support forum wants to rank by accepted
 * answers, and that belongs to fof/best-answer, not here.
 */
class LeaderboardMetricExtenderTest extends EnhancedTestCase
{
    private function registry(): MetricRegistry
    {
        $this->app();

        return $this->app()->getContainer()->make(MetricRegistry::class);
    }

    #[Test]
    public function the_metrics_we_ship_are_registered()
    {
        $this->extension('fof-gamification');

        $keys = array_keys($this->registry()->all());

        sort($keys);

        $this->assertSame(['discussions', 'posts', 'upvotes', 'votes'], $keys);
    }

    /**
     * Participation is the opening view rather than a vote metric: net score
     * can be negative and needs explaining before it means anything, which
     * makes it a poor thing to greet somebody with.
     */
    #[Test]
    public function posts_written_is_the_default()
    {
        $this->extension('fof-gamification');

        $this->assertSame(PostsWritten::KEY, $this->registry()->default()?->key());
    }

    /**
     * Forums differ in what they want to celebrate, so the opening view is the
     * admin's choice; posts is only where it starts.
     */
    #[Test]
    public function the_admin_can_choose_the_default()
    {
        $this->setting(MetricRegistry::DEFAULT_METRIC, 'upvotes');

        $this->extension('fof-gamification');

        $this->assertSame('upvotes', $this->registry()->default()?->key());
    }

    /**
     * A metric can vanish — its extension is disabled, or the key is a typo —
     * and the page still has to open on something.
     */
    #[Test]
    public function an_unknown_configured_default_falls_back()
    {
        $this->setting(MetricRegistry::DEFAULT_METRIC, 'no-such-metric');

        $this->extension('fof-gamification');

        $this->assertSame(PostsWritten::KEY, $this->registry()->default()?->key());
    }

    #[Test]
    public function an_extension_can_register_its_own_metric()
    {
        $this->extend(
            (new LeaderboardMetric())->add(ThirdPartyMetric::class)
        );

        $this->extension('fof-gamification');

        $registry = $this->registry();

        $this->assertTrue($registry->has('third-party.thing'), 'the registered metric should be available');
        $this->assertInstanceOf(ThirdPartyMetric::class, $registry->get('third-party.thing'));
    }

    /**
     * Registering something must not disturb what was already there — a metric
     * from another extension replacing ours would silently change the board.
     */
    #[Test]
    public function registering_a_metric_leaves_the_built_in_ones_alone()
    {
        $this->extend(
            (new LeaderboardMetric())->add(ThirdPartyMetric::class)
        );

        $this->extension('fof-gamification');

        $keys = array_keys($this->registry()->all());

        sort($keys);

        $this->assertSame(
            ['discussions', 'posts', 'third-party.thing', 'upvotes', 'votes'],
            $keys
        );
    }

    #[Test]
    public function a_registered_metric_is_resolved_from_the_container()
    {
        $this->extend(
            (new LeaderboardMetric())->add(ThirdPartyMetric::class)
        );

        $this->extension('fof-gamification');

        // Its constructor dependency was injected, so it came from the
        // container rather than being newed up blind.
        $metric = $this->registry()->get('third-party.thing');

        $this->assertInstanceOf(ThirdPartyMetric::class, $metric);
        $this->assertTrue($metric->wasInjected());
    }
}

/**
 * Stands in for a metric shipped by another extension.
 */
class ThirdPartyMetric implements MetricInterface
{
    public function __construct(
        protected ConnectionInterface $connection
    ) {
    }

    public function wasInjected(): bool
    {
        return $this->connection instanceof ConnectionInterface;
    }

    public function key(): string
    {
        return 'third-party.thing';
    }

    public function label(): string
    {
        return 'third-party.thing.label';
    }

    public function supportsPeriods(): bool
    {
        return false;
    }

    public function query(?\DateTimeInterface $since, ?\DateTimeInterface $until = null): Builder
    {
        return $this->connection
            ->table('users')
            ->select('users.id as user_id')
            ->selectRaw('0 as score');
    }
}
