<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Events;

use FoF\Gamification\Vote;

class PostWasVoted
{
    /**
     * @var Vote
     */
    public $vote;

    /**
     * PostWasVoted constructor.
     *
     * @param Vote $vote
     */
    public function __construct(Vote $vote)
    {
        $this->vote = $vote;
    }
}
