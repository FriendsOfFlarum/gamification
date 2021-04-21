<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        /**
         * @var SettingsRepositoryInterface
         */
        $settings = resolve('flarum.settings');

        $keys = [
            'convertedLikes',
            'amountPerPost',
            'amountPerDiscussion',
            'postStartAmount',
            'rankAmt',
            'iconName',
            'blockedUsers',
            'pointsPlaceholder',
            'autoUpvotePosts',
            'customRankingImages',
        ];

        foreach ($keys as $key) {
            $value = $settings->get($full = "reflar.gamification.$key");

            if ($value !== null) {
                $settings->set("fof-gamification.$key", $value);
                $settings->delete($full);
            }
        }
    },
    'down' => function (Builder $schema) {
        //
    },
];
