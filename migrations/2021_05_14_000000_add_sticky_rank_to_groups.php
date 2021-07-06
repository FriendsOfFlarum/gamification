<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasColumn('groups', 'sticky_rank')) {
            return;
        }

        $schema->table('groups', function (Blueprint $table) {
            $table->integer('sticky_rank')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('groups', function (Blueprint $table) {
            $table->dropColumn('sticky_rank');
        });
    },
];
