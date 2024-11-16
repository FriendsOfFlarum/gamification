<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Events;

use Flarum\User\User;

class UserPointsUpdated
{
    public function __construct(
        public User $user
    ) {
    }
}
