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
 * Net votes received: upvotes minus downvotes, on posts the user wrote.
 *
 * This is what the leaderboard has always ranked by, and is kept as the
 * default so an upgrade does not silently reorder the board.
 */
class VotesReceived implements MetricInterface
{
    public const KEY = 'votes';

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
        return 'fof-gamification.forum.leaderboard.metric.votes';
    }

    public function supportsPeriods(): bool
    {
        return true;
    }

    public function query(?\DateTimeInterface $since, ?\DateTimeInterface $until = null): Builder
    {
        $query = $this->connection
            ->table('post_votes')
            ->join('posts', 'posts.id', '=', 'post_votes.post_id')
            ->whereNotNull('posts.user_id')
            // A vote on a post nobody can see should not count towards a
            // public ranking.
            ->whereNull('posts.hidden_at')
            ->where('posts.is_private', false)
            ->groupBy('posts.user_id')
            ->select('posts.user_id as user_id')
            // Built rather than raw: a raw string naming the table does not
            // get the configured prefix applied, so on a prefixed install the
            // column does not resolve at all.
            ->selectRaw('SUM('.$this->connection->getTablePrefix().'post_votes.value) as score');

        if ($since !== null) {
            $query->where('post_votes.created_at', '>=', $since);
        }

        if ($until !== null) {
            $query->where('post_votes.created_at', '<', $until);
        }

        return $query;
    }
}
