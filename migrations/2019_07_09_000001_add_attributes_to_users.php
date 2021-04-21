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
        if ($schema->hasColumn('users', 'votes')) {
            return;
        }

        $schema->table('users', function (Blueprint $table) {
            $table->integer('votes');
            $table->string('rank')->nullable();
            $table->dateTime('last_vote_time')->nullable();
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('users', function (Blueprint $table) {
            $table->dropColumn('votes');
            $table->dropColumn('rank');
            $table->dropColumn('last_vote_time');
        });
    },
];
