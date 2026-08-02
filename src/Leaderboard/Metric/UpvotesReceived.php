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
 * Upvotes received, ignoring downvotes entirely.
 *
 * Net score treats a contested post as if it never happened: a hundred up and
 * a hundred down comes to nothing, and the member who provoked that discussion
 * ranks alongside somebody who never posted. Counting the upvotes on their own
 * measures appreciation rather than consensus, and is usually what people
 * assume a leaderboard is showing them.
 */
class UpvotesReceived implements MetricInterface
{
    public const KEY = 'upvotes';

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
        return 'fof-gamification.forum.leaderboard.metric.upvotes';
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
            ->where('post_votes.value', '>', 0)
            ->whereNotNull('posts.user_id')
            ->whereNull('posts.hidden_at')
            ->where('posts.is_private', false)
            ->groupBy('posts.user_id')
            ->select('posts.user_id as user_id')
            ->selectRaw('COUNT(*) as score');

        if ($since !== null) {
            $query->where('post_votes.created_at', '>=', $since);
        }

        if ($until !== null) {
            $query->where('post_votes.created_at', '<', $until);
        }

        return $query;
    }
}
