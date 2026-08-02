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
use FoF\Gamification\Leaderboard\MetricInterface;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\Leaderboard\Period;
use FoF\Gamification\Rank;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

class ForumResourceFields
{
    protected Cloud $uploadDir;

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected MetricRegistry $metrics,
        Factory $factory
    ) {
        $this->uploadDir = $factory->disk('flarum-assets');
    }

    public function __invoke(): array
    {
        return [
            Schema\Boolean::make('canViewRankingPage')
                ->get(function ($forum, Context $context) {
                    return $context->getActor()->can('fof.gamification.viewRankingPage');
                }),

            // The leaderboard's selector is built from these. They cannot be
            // hardcoded in the frontend: metrics are extensible, so which
            // exist depends on what else is installed, and whether one can be
            // limited to a period is the metric's own answer.
            Schema\Arr::make('fof-gamification.leaderboardMetrics')
                ->get(fn () => array_values(array_map(fn (MetricInterface $metric) => [
                    'key'             => $metric->key(),
                    'label'           => $metric->label(),
                    'supportsPeriods' => $metric->supportsPeriods(),
                ], $this->metrics->all()))),

            Schema\Arr::make('fof-gamification.leaderboardPeriods')
                ->get(fn () => Period::keys()),

            // Which of them the page opens on. Without this the frontend
            // falls back to whichever metric the registry lists first, and
            // the admin's choice never takes effect.
            Schema\Str::make('fof-gamification.defaultLeaderboardMetric')
                ->get(fn () => $this->metrics->default()?->key()),

            Schema\Str::make('fof-gamification.defaultLeaderboardPeriod')
                ->get(fn () => Period::configured($this->settings)->value),
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
                ->get(fn () => Rank::query()->get()->all()),
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
