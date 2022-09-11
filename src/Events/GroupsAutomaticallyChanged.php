<?php

namespace FoF\Gamification\Events;

use Flarum\User\Event\GroupsChanged;

class GroupsAutomaticallyChanged extends GroupsChanged
{
    // Same event data as the original from Flarum, this one will trigger first so extensions know they can ignore the original one from Flarum
}
