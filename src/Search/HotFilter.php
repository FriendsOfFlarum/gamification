<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Search;

use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\User\User;
use Illuminate\Database\Query\Builder;

class HotFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'hot';
    }

    public function filter(SearchState $state, array|string $value, bool $negate): void
    {
        $this->sort($state->getQuery(), $state->getActor(), $negate);
    }

    protected function sort(Builder $query, User $actor, bool $negate)
    {
        $query->orderBy('hotness', 'desc');
    }
}
