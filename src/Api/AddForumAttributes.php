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

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;

class AddForumAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Cloud
     */
    protected $uploadDir;

    public function __construct(SettingsRepositoryInterface $settings, Factory $factory)
    {
        $this->settings = $settings;
        $this->uploadDir = $factory->disk('flarum-assets');
    }

    public function __invoke(ForumSerializer $serializer, $model, array $attributes): array
    {
        $attributes['canViewRankingPage'] = $serializer->getActor()->can('fof.gamification.viewRankingPage');
        $attributes['fof-gamification-op-votes-only'] = (bool) $this->settings->get('fof-gamification.firstPostOnly');

        $attributes['fof-gamification.topimage1Url'] = $this->urlForKey('fof-gamification.topimage1_path');
        $attributes['fof-gamification.topimage2Url'] = $this->urlForKey('fof-gamification.topimage2_path');
        $attributes['fof-gamification.topimage3Url'] = $this->urlForKey('fof-gamification.topimage3_path');

        return $attributes;
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
