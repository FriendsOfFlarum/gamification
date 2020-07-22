<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Database\Migration;
use Flarum\Group\Group;
use Flarum\Group\Permission;
use Illuminate\Database\Schema\Builder;

$default = Migration::addPermissions([
    'discussion.vote'                  => Group::MEMBER_ID,
    'fof.gamification.viewRankingPage' => Group::GUEST_ID,
]);

return [
    'up' => function (Builder $schema) use ($default) {
        Permission::where('permission', 'reflar.gamification.viewRankingPage')->update(['permission' => 'fof.gamification.viewRankingPage']);

        return $default['up']($schema);
    },
    'down' => $default['down'],
];
