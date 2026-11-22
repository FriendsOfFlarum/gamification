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
use Flarum\User\User;

class UserResourceFields
{
    public function __invoke(): array
    {
        return [
            Schema\Number::make('points')
                ->property('votes'),
            Schema\Boolean::make('canHaveVotingNotifications')
                // Only the forum's own user reads this, to decide whether to
                // offer the vote notification setting. Serialized for every
                // user in a listing, it cost a permission lookup per distinct
                // set of groups among them, and told everyone what each
                // member is allowed.
                ->visible(fn (User $user, Context $context) => $context->getActor()->id === $user->id)
                ->get(fn (User $user) => $user->hasPermission('discussion.upvote_notifications')
                    || $user->hasPermission('discussion.downvote_notifications')),

            Schema\Relationship\ToMany::make('ranks')
                ->type('ranks')
                ->includable(),
        ];
    }
}
