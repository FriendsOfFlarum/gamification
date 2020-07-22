<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Commands;

use Flarum\User\User;

class DeleteRank
{
    /**
     * @var int
     */
    public $rankId;
    /**
     * @var User
     */
    public $actor;

    /**
     * @param int  $rankId
     * @param User $actor
     */
    public function __construct($rankId, User $actor)
    {
        $this->rankId = $rankId;
        $this->actor = $actor;
    }
}
