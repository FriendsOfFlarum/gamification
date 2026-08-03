<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use FoF\Gamification\LeaderboardEligibility;
use Illuminate\Database\Schema\Builder;

/**
 * Move the leaderboard exclusion list from a free-text list of usernames to a
 * list of user ids.
 *
 * Usernames were a poor key: they change, and when they did the exclusion
 * silently lapsed with nothing to show the admin it had. Ids do not.
 *
 * Names that no longer resolve to a user are dropped — they were already doing
 * nothing — and the original setting is left in place so an admin can see what
 * the list used to say.
 */
return [
    'up' => function (Builder $schema) {
        $connection = $schema->getConnection();

        $settings = $connection->table('settings');

        if ($settings->where('key', LeaderboardEligibility::EXCLUDED_USERS)->exists()) {
            return;
        }

        $legacy = $settings->where('key', 'fof-gamification.blockedUsers')->value('value');

        // Shared with the filter's legacy fallback so the two cannot disagree
        // about what the admin typed.
        $names = LeaderboardEligibility::parseLegacyUsernames(is_string($legacy) ? $legacy : null);

        $ids = $names === []
            ? []
            : $connection->table('users')
                ->whereIn('username', $names)
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->all();

        $settings->insert([
            'key'   => LeaderboardEligibility::EXCLUDED_USERS,
            'value' => json_encode($ids),
        ]);
    },
    'down' => function (Builder $schema) {
        $schema->getConnection()->table('settings')
            ->where('key', LeaderboardEligibility::EXCLUDED_USERS)
            ->delete();
    },
];
