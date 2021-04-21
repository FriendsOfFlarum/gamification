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
        if ($schema->hasTable('rank_user')) {
            $schema->rename('rank_user', 'rank_users');

            return;
        }

        $schema->create('rank_users', function (Blueprint $table) {
            $table->integer('rank_id')->unsigned();
            $table->integer('user_id')->unsigned();

            $table->primary(['user_id', 'rank_id']);
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('rank_users');
    },
];
