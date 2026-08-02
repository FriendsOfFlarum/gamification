<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use FoF\Gamification\EnabledTags;
use Illuminate\Database\Schema\Builder;

/**
 * Seed the enabled-tags setting from the permissions a forum already has, so
 * that gaining a per-tag switch does not change where voting works.
 *
 * See EnabledTags::seedFromPermissions() for why a forum-wide grant means
 * "every tag" rather than the tags that happen to carry per-tag vote rows.
 */
return [
    'up' => function (Builder $schema) {
        $connection = $schema->getConnection();

        if ($connection->table('settings')->where('key', EnabledTags::SETTING)->exists()) {
            return;
        }

        // Migrations run regardless of which other extensions are installed,
        // and this one reads the tags table. Without flarum/tags there is
        // nothing to seed from — and nothing to gate, since a forum with no
        // tags has no per-tag distinction to make.
        if (! $schema->hasTable('tags')) {
            return;
        }

        $permissions = $connection->table('group_permission')->pluck('permission')->all();
        $tagIds = $connection->table('tags')->pluck('id')->map(fn ($id) => (int) $id)->all();

        $connection->table('settings')->insert([
            'key'   => EnabledTags::SETTING,
            'value' => json_encode(EnabledTags::seedFromPermissions($permissions, $tagIds)),
        ]);
    },
    'down' => function (Builder $schema) {
        $schema->getConnection()->table('settings')
            ->where('key', EnabledTags::SETTING)
            ->delete();
    },
];
