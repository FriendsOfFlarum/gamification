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
        // Find duplicate votes based on `user_id` and `post_id` columns and delete them.
        $duplicates = $schema->getConnection()
            ->table('post_votes')
            ->select('user_id', 'post_id')
            ->groupBy('user_id', 'post_id')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicates as $row) {
            $keep = $schema->getConnection()
                ->table('post_votes')
                ->where('user_id', $row->user_id)
                ->where('post_id', $row->post_id)
                ->orderBy('id', 'asc')
                ->first();

            $schema->getConnection()
                ->table('post_votes')
                ->where('user_id', $row->user_id)
                ->where('post_id', $row->post_id)
                ->where('id', '!=', $keep->id)
                ->delete();
        }

        $schema->table('post_votes', function (Blueprint $table) {
            $table->unique(['post_id', 'user_id']);
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('post_votes', function (Blueprint $table) {
            $table->dropUnique(['post_id', 'user_id']);
        });
    },
];
