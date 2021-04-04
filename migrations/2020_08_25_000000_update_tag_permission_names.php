<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Group\Permission;
use Illuminate\Database\Schema\Builder;
use Illuminate\Support\Str;

return [
    'up' => function (Builder $schema) {
        Permission::query()
            ->where('permission', 'like', '%.discussion.vote')
            ->orderBy('permission')
            ->each(function (Permission $item) use ($schema) {
                $schema->getConnection()->transaction(function () use ($item) {
                    $item->delete();

                    $item->permission = $item->permission.'Posts';

                    if (!Permission::query()->where($item->getAttributes())->exists()) {
                        $item->save();
                    }
                });
            });
    },
    'down' => function (Builder $schema) {
        Permission::query()
            ->where('permission', 'like', '%.discussion.votePosts')
            ->orderBy('permission')
            ->each(function (Permission $item) use ($schema) {
                $schema->getConnection()->transaction(function () use ($item) {
                    $item->delete();

                    $item->permission = Str::replaceLast('votePosts', 'vote', $item->permission);

                    if (!Permission::query()->where($item->getAttributes())->exists()) {
                        $item->save();
                    }
                });
            });
    },
];
