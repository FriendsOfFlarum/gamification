<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Filter;

use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;

class RankableFilter implements FilterInterface
{
    public function __construct(
        public SettingsRepositoryInterface $settings
    ) {
    }

    public function getFilterKey(): string
    {
        return 'rankable';
    }

    public function filter(SearchState $state, array|string $value, bool $negate): void
    {
        if ($state->getActor()->cannot('fof.gamification.viewRankingPage')) {
            throw new PermissionDeniedException();
        }

        $blockedUsers = explode(', ', $this->settings->get('fof-gamification.blockedUsers'));

        $state
            ->getQuery()
            ->whereIn('username', $blockedUsers, 'and', !$negate);
    }
}
