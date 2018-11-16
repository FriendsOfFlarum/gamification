<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Gamification\Gambit;

use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\AbstractSearch;

class HotGambit extends AbstractRegexGambit
{
    /**
     * @var string
     */
    protected $pattern = 'is:hot';

    /**
     * @param AbstractSearch $search
     * @param array          $matches
     * @param $negate
     */
    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        $search->getQuery()->orderBy('hotness', 'desc');
    }
}
