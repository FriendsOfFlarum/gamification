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

use Flarum\Api\Schema;
use Flarum\User\User;

class UserResourceFields
{
    /**
     * Cached answers to canHaveVotingNotifications, keyed by the user's set of
     * group ids — the only thing the answer depends on.
     *
     * @var array<string, bool>
     */
    private array $votingNotifications = [];

    public function __invoke(): array
    {
        return [
            Schema\Number::make('points')
                ->property('votes'),
            Schema\Boolean::make('canHaveVotingNotifications')
                ->get(function (User $user) {
                    // Asked of every user in a listing, and the answer depends
                    // only on their groups — so users who share a set of groups
                    // share an answer. Without this, a page of users re-ran the
                    // same permission lookup for each of them.
                    $groups = $user->groups->pluck('id')->sort()->implode(',');

                    return $this->votingNotifications[$groups] ??= $user->hasPermission('discussion.upvote_notifications')
                        || $user->hasPermission('discussion.downvote_notifications');
                }),

            Schema\Relationship\ToMany::make('ranks')
                ->type('ranks')
                ->includable(),
        ];
    }
}
