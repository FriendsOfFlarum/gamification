<?php

namespace FoF\Gamification\Events;

use Flarum\User\User;

class UserPointsUpdated
{
    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }
}
