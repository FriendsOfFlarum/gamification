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

class VotedFilter implements FilterInterface
{
    public function __construct(
        public SettingsRepositoryInterface $settings
    ) {
    }

    public function getFilterKey(): string
    {
        return 'voted';
    }

    public function filter(SearchState $state, array|string $value, bool $negate): void
    {
        $votedId = trim($value, '"');

        /** @phpstan-ignore-next-line */
        $state
            ->getQuery()
            ->whereIn('id', function ($query) use ($votedId, $negate, $state) {
                $query->select('post_id')
                    ->from('post_votes')
                    ->where('user_id', $negate ? '!=' : '=', $votedId);
                if (!$state->getActor()->hasPermission('canSeeVoters')) {
                    $query->where('user_id', '=', $state->getActor()->id);
                }
            })
            ->when((bool) $this->settings->get('fof-gamification.firstPostOnly'), function ($query) {
                $query->where('number', '1');
            });
    }
}
