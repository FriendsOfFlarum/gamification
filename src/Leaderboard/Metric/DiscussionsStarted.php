<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Leaderboard\Metric;

use FoF\Gamification\Leaderboard\MetricInterface;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Query\Builder;

/**
 * Discussions started.
 *
 * Starting a conversation is a different contribution from replying to one,
 * and a forum that wants more of it can rank by it directly.
 */
class DiscussionsStarted implements MetricInterface
{
    public const KEY = 'discussions';

    public function __construct(
        protected ConnectionInterface $connection
    ) {
    }

    public function key(): string
    {
        return self::KEY;
    }

    public function label(): string
    {
        return 'fof-gamification.forum.leaderboard.metric.discussions';
    }

    public function supportsPeriods(): bool
    {
        return true;
    }

    public function query(?\DateTimeInterface $since, ?\DateTimeInterface $until = null): Builder
    {
        $query = $this->connection
            ->table('discussions')
            ->whereNotNull('discussions.user_id')
            ->whereNull('discussions.hidden_at')
            ->where('discussions.is_private', false)
            ->groupBy('discussions.user_id')
            ->select('discussions.user_id as user_id')
            ->selectRaw('COUNT(*) as score');

        if ($since !== null) {
            $query->where('discussions.created_at', '>=', $since);
        }

        if ($until !== null) {
            $query->where('discussions.created_at', '<', $until);
        }

        return $query;
    }

    public function activityQuery(?\DateTimeInterface $since, ?\DateTimeInterface $until = null): ?Builder
    {
        $query = $this->connection
            ->table('discussions')
            ->whereNotNull('discussions.user_id')
            ->whereNull('discussions.hidden_at')
            ->where('discussions.is_private', false)
            ->select('discussions.user_id as user_id')
            ->selectRaw($this->connection->getTablePrefix().'discussions.created_at as happened_at');

        if ($since !== null) {
            $query->where('discussions.created_at', '>=', $since);
        }

        if ($until !== null) {
            $query->where('discussions.created_at', '<', $until);
        }

        return $query;
    }
}
