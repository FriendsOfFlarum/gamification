<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class AddUserAttributes
{
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $attributes['points'] = $user->votes;
        $attributes['canHaveVotingNotifications'] = $user->hasPermission('discussion.upvote_notifications') || $user->hasPermission('discussion.downvote_notifications');

        return $attributes;
    }
}
