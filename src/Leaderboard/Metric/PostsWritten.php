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
 * Comments written.
 *
 * Rewards turning up and taking part, which no vote-based metric does: someone
 * who answers questions all week without attracting votes is invisible on a
 * board ranked by score alone.
 */
class PostsWritten implements MetricInterface
{
    public const KEY = 'posts';

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
        return 'fof-gamification.forum.leaderboard.metric.posts';
    }

    public function supportsPeriods(): bool
    {
        return true;
    }

    public function query(?\DateTimeInterface $since, ?\DateTimeInterface $until = null): Builder
    {
        $query = $this->connection
            ->table('posts')
            // Renames, merges and the like are recorded as posts but are not
            // contributions, so they would inflate a participation count.
            ->where('posts.type', 'comment')
            ->whereNotNull('posts.user_id')
            ->whereNull('posts.hidden_at')
            ->where('posts.is_private', false)
            ->groupBy('posts.user_id')
            ->select('posts.user_id as user_id')
            ->selectRaw('COUNT(*) as score');

        if ($since !== null) {
            $query->where('posts.created_at', '>=', $since);
        }

        if ($until !== null) {
            $query->where('posts.created_at', '<', $until);
        }

        return $query;
    }

    public function activityQuery(?\DateTimeInterface $since, ?\DateTimeInterface $until = null): ?Builder
    {
        $query = $this->connection
            ->table('posts')
            ->where('posts.type', 'comment')
            ->whereNotNull('posts.user_id')
            ->whereNull('posts.hidden_at')
            ->where('posts.is_private', false)
            ->select('posts.user_id as user_id')
            ->selectRaw($this->connection->getTablePrefix().'posts.created_at as happened_at');

        if ($since !== null) {
            $query->where('posts.created_at', '>=', $since);
        }

        if ($until !== null) {
            $query->where('posts.created_at', '<', $until);
        }

        return $query;
    }
}
