<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Provider;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Gamification\Leaderboard\Metric;
use FoF\Gamification\Leaderboard\MetricRegistry;

/**
 * Wires up the leaderboard metrics.
 *
 * The list lives in the container so other extensions can add to it through
 * the LeaderboardMetric extender; the registry is built from that list once
 * per request.
 */
class LeaderboardProvider extends AbstractServiceProvider
{
    public function register(): void
    {
        $this->container->singleton('fof-gamification.leaderboard.metrics', function () {
            return [
                Metric\VotesReceived::class,
                Metric\UpvotesReceived::class,
                Metric\PostsWritten::class,
                Metric\DiscussionsStarted::class,
            ];
        });

        $this->container->singleton(MetricRegistry::class, function ($container) {
            $registry = new MetricRegistry(
                $container->make(\FoF\Gamification\LeaderboardEligibility::class),
                $container->make(\Illuminate\Database\ConnectionInterface::class),
                $container->make(\Flarum\Settings\SettingsRepositoryInterface::class)
            );

            foreach ($container->make('fof-gamification.leaderboard.metrics') as $metric) {
                // Resolved rather than newed up: a metric from another
                // extension is entitled to its own dependencies.
                $registry->add($container->make($metric));
            }

            return $registry;
        });
    }
}
