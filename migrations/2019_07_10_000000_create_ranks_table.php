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
        if ($schema->hasTable('ranks')) {
            return;
        }

        $schema->create('ranks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('points')->unsigned();
            $table->string('name');
            $table->string('color');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('ranks');
    },
];
