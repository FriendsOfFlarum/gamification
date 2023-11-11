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

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Flarum\User\User;
use Illuminate\Database\Query\Builder;

class HotFilterGambit extends AbstractRegexGambit implements FilterInterface
{
    /**
     * {@inheritDoc}
     */
    public function getFilterKey(): string
    {
        return 'hot';
    }

    /**
     * {@inheritDoc}
     */
    public function getGambitPattern()
    {
        return 'is:hot';
    }

    /**
     * {@inheritDoc}
     */
    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $this->sort($filterState->getQuery(), $filterState->getActor(), $negate);
    }

    protected function sort(Builder $query, User $actor, bool $negate)
    {
        $query->orderBy('hotness', 'desc');
    }

    /**
     * @param SearchState $search
     * @param array       $matches
     * @param             $negate
     */
    protected function conditions(SearchState $search, array $matches, $negate)
    {
        $this->sort($search->getQuery(), $search->getActor(), $negate);
    }
}
