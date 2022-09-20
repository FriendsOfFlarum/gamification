<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Events;

use Flarum\User\Event\GroupsChanged;

class GroupsAutomaticallyChanged extends GroupsChanged
{
    // Same event data as the original from Flarum, this one will trigger first so extensions know they can ignore the original one from Flarum
}
