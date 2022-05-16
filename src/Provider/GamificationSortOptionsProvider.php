<?php

namespace FoF\Gamification\Provider;

use Flarum\Foundation\AbstractServiceProvider;

class GamificationSortOptionsProvider extends AbstractServiceProvider
{
    public function register()
    {
        $this->container->extend('flarum.forum.discussions.sortmap', function (array $options) {
            return array_merge($options, [
                'votes' => '-votes',
                'hot' => '-hotness',
            ]);
        });
    }
}
