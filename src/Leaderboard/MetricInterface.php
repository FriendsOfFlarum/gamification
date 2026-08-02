<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Leaderboard;

use Illuminate\Database\Query\Builder;

/**
 * One way of ranking people on the leaderboard.
 *
 * A metric answers a single question — who received the most votes, who wrote
 * the most posts, who has the most accepted answers — and nothing else. It
 * does not decide who is eligible to be ranked at all; that is applied around
 * it, so a new metric cannot forget it.
 *
 * Implementations must return a query selecting exactly two columns:
 *
 *   - `user_id`, the person being ranked;
 *   - `score`, their value for this metric, highest first.
 *
 * Anything the metric needs beyond that — joins, date filters, grouping — is
 * its own business.
 */
interface MetricInterface
{
    /**
     * A stable key, used in the API and stored in settings.
     *
     * Namespace it if you are shipping one from another extension, e.g.
     * `best-answer.accepted`, so keys cannot collide.
     */
    public function key(): string;

    /**
     * The translation key for this metric's name, shown in the selector.
     */
    public function label(): string;

    /**
     * Whether this metric can be limited to a period.
     *
     * Metrics backed by a running total on the user rather than by dated rows
     * cannot answer "this week", and saying so lets the frontend hide periods
     * that would silently return the all-time figure.
     */
    public function supportsPeriods(): bool;

    /**
     * Build the ranking query.
     *
     * `$since` is null for all-time, otherwise the start of the window.
     * `$until` bounds the other end, and is only set when ranking a window
     * that has already closed — comparing against last week to work out which
     * way somebody is moving. A metric that does not support periods may
     * ignore both.
     */
    public function query(?\DateTimeInterface $since, ?\DateTimeInterface $until = null): Builder;
}
