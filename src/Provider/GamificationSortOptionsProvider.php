<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Provider;

use Flarum\Foundation\AbstractServiceProvider;

class GamificationSortOptionsProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->extend('flarum.forum.discussions.sortmap', function (array $options) {
            return array_merge($options, [
                'votes' => '-votes',
                'hot'   => '-hotness',
            ]);
        });
    }
}
