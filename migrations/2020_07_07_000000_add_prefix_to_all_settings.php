<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
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
        $settings = app('flarum.settings');

        foreach ([1, 2, 3] as $num) {
            if ($value = $settings->get($key = "topimage{$num}_path")) {
                $settings->set("fof-gamification.$key", $value);
                $settings->delete($key);
            }
        }
    },
    'down' => function (Builder $schema) {
        //
    },
];
