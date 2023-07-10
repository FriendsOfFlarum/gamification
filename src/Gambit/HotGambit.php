<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Gambit;

use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;

class HotGambit extends AbstractRegexGambit
{
    public function getGambitPattern()
    {
        return 'is:hot';
    }

    /**
     * @param SearchState $search
     * @param array       $matches
     * @param             $negate
     */
    protected function conditions(SearchState $search, array $matches, $negate)
    {
        $search->getQuery()->orderBy('hotness', 'desc');
    }
}
