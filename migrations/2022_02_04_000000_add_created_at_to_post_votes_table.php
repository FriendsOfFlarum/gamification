<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Database\Migration;

return Migration::addColumns('post_votes', [
    'created_at' => [
        'timestamp',
        'null'       => false,
        'useCurrent' => true,
    ],
]);
