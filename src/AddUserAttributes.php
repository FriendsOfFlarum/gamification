<?php

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
