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

use Flarum\Query\AbstractQueryState;
use Flarum\Search\AbstractRegexGambit;

class HotGambit extends AbstractRegexGambit
{
    /**
     * @var string
     */
    protected $pattern = 'is:hot';

    /**
     * @param AbstractQueryState $search
     * @param array              $matches
     * @param $negate
     */
    protected function conditions(AbstractQueryState $search, array $matches, $negate)
    {
        $search->getQuery()->orderBy('hotness', 'desc');
    }
}
