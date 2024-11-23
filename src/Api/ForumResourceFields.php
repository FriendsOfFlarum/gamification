<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Gamification\Rank;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

class ForumResourceFields
{
    protected Cloud $uploadDir;

    public function __construct(protected SettingsRepositoryInterface $settings, Factory $factory)
    {
        $this->uploadDir = $factory->disk('flarum-assets');
    }

    public function __invoke(): array
    {
        return [
            Schema\Boolean::make('canViewRankingPage')
                ->get(function ($forum, Context $context) {
                    return $context->getActor()->can('fof.gamification.viewRankingPage');
                }),
            Schema\Boolean::make('fof-gamification-op-votes-only')
                ->get(function () {
                    return (bool) $this->settings->get('fof-gamification.firstPostOnly');
                }),
            Schema\Str::make('fof-gamification.topimage1Url')
                ->get(fn () => $this->urlForKey('fof-gamification.topimage1_path')),
            Schema\Str::make('fof-gamification.topimage2Url')
                ->get(fn () => $this->urlForKey('fof-gamification.topimage2_path')),
            Schema\Str::make('fof-gamification.topimage3Url')
                ->get(fn () => $this->urlForKey('fof-gamification.topimage3_path')),

            Schema\Relationship\ToMany::make('ranks')
                ->type('ranks')
                ->includable()
                ->get(fn () => Rank::all()),
        ];
    }

    protected function urlForKey(string $key): ?string
    {
        $value = $this->settings->get($key);

        if ($value === null) {
            return null;
        }

        return $this->uploadDir->url($value);
    }
}
