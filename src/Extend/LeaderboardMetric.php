<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Extend;

use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

/**
 * Adds a way of ranking people on the leaderboard.
 *
 * Metrics are deliberately open: the most useful ranking on a support forum is
 * accepted answers, which belongs to fof/best-answer rather than here, and
 * this extension should not have to know about it to let people rank by it.
 *
 * Whatever a metric returns, eligibility is still applied around it, so a
 * metric cannot rank somebody the admin has excluded.
 *
 *     (new FoF\Gamification\Extend\LeaderboardMetric())
 *         ->add(AcceptedAnswers::class)
 *
 * Keys should be namespaced — `best-answer.accepted` rather than `accepted` —
 * so two extensions cannot claim the same one.
 */
class LeaderboardMetric implements ExtenderInterface
{
    /**
     * @var class-string<\FoF\Gamification\Leaderboard\MetricInterface>[]
     */
    private array $metrics = [];

    /**
     * @param class-string<\FoF\Gamification\Leaderboard\MetricInterface> $metric
     */
    public function add(string $metric): self
    {
        $this->metrics[] = $metric;

        return $this;
    }

    public function extend(Container $container, ?Extension $extension = null): void
    {
        $container->extend('fof-gamification.leaderboard.metrics', function (array $existing) {
            return array_merge($existing, $this->metrics);
        });
    }
}
