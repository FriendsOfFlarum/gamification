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

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
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

        $excluded = $this->excludedUsernames();

        if ($excluded === []) {
            return;
        }

        // Deliberately ignores $negate. This filter answers "may this user
        // appear in the rankings?", which has no useful inverse — and honouring
        // the negation would turn the exclusion inside out, so `filter[-rankable]`
        // would return precisely the list of people the admin asked to hide.
        $state
            ->getQuery()
            ->whereNotIn('username', $excluded);
    }

    /**
     * The excluded usernames, as the admin typed them.
     *
     * Stored as free text, so the separator is whatever the admin used: split
     * on commas with any surrounding whitespace rather than a literal ', ',
     * which silently matched nothing for the more natural `alice,bob`.
     *
     * @return string[]
     */
    private function excludedUsernames(): array
    {
        $setting = (string) $this->settings->get('fof-gamification.blockedUsers');

        if (trim($setting) === '') {
            return [];
        }

        return array_values(array_filter(
            preg_split('/\s*,\s*/', trim($setting)) ?: [],
            fn (string $username) => $username !== ''
        ));
    }
}
