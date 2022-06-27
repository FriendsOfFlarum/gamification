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

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Flarum\Settings\SettingsRepositoryInterface;

class VotedFilter implements FilterInterface
{
    /**
     * @var SettingsRepositoryInterface
     */
    public $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function getFilterKey(): string
    {
        return 'voted';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $votedId = trim($filterValue, '"');

        $filterState
            ->getQuery()
            ->whereIn('id', function ($query) use ($votedId, $negate) {
                $query->select('post_id')
                    ->from('post_votes')
                    ->where('user_id', $negate ? '!=' : '=', $votedId);
            })
            ->when((bool) $this->settings->get('fof-gamification.firstPostOnly'), function ($query) {
                $query->where('number', '1');
            });
    }
}
