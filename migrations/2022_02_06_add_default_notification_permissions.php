<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'discussion.upvote_notifications' => Group::MEMBER_ID,
    'discussion.downvote_notifications' => Group::MEMBER_ID
]);
