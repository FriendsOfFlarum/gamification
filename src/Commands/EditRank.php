<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Commands;

use Flarum\User\User;

class EditRank
{
    public function __construct(
        public int $rankId,
        public User $actor,
        public array $data
    ) {
    }
}
