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

use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Gamification\LeaderboardEligibility;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class RankableFilter implements FilterInterface
{
    public function __construct(
        public SettingsRepositoryInterface $settings,
        protected LeaderboardEligibility $eligibility
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

        // Deliberately ignores $negate. This filter answers "may this user
        // appear in the rankings?", which has no useful inverse — and honouring
        // the negation would turn the exclusion inside out, so `filter[-rankable]`
        // would return precisely the list of people the admin asked to hide.
        $query = $state->getQuery();

        $this->eligibility->constrain($query);

        // The pre-migration setting named users rather than referencing them.
        // It is migrated to ids on upgrade, so this only matters for a forum
        // that has written the old key since — but leaving it unread would
        // silently stop honouring a list the admin can still see.
        if ($legacy = $this->excludedUsernames()) {
            $query->whereNotIn('users.username', $legacy);
        }
    }

    /**
     * The excluded usernames, as the admin typed them.
     *
     * @return string[]
     */
    private function excludedUsernames(): array
    {
        return LeaderboardEligibility::parseLegacyUsernames(
            $this->settings->get('fof-gamification.blockedUsers')
        );
    }
}
