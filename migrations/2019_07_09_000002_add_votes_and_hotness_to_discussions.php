<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if ($schema->hasColumn('discussions', 'votes')) {
            return;
        }

        $schema->table('discussions', function (Blueprint $table) {
            $table->integer('votes');
            $table->float('hotness', 10, 4);
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('discussions', function (Blueprint $table) {
            $table->dropColumn('votes');
            $table->dropColumn('hotness');
        });
    },
];
