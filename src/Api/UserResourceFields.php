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
    public function __invoke(): array
    {
        return [
            Schema\Number::make('points')
                ->property('votes'),
            Schema\Boolean::make('canHaveVotingNotifications')
                ->get(function (User $user) {
                    return $user->hasPermission('discussion.upvote_notifications')
                        || $user->hasPermission('discussion.downvote_notifications');
                }),

            Schema\Relationship\ToMany::make('ranks')
                ->type('ranks')
                ->includable(),
        ];
    }
}
