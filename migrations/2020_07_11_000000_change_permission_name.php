<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Group\Permission;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        Permission::query()
            ->where('permission', 'discussion.vote')
            ->update([
                'permission' => 'discussion.votePosts',
            ]);
    },
    'down' => function (Builder $schema) {
        Permission::query()
            ->where('permission', 'discussion.votePosts')
            ->update([
                'permission' => 'discussion.vote',
            ]);
    },
];
