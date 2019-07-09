<?php
/**
 *  This file is part of fof/gamification.
 *
 *  Copyright (c) FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace FoF\Gamification\Commands;

use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Gamification\Rank;

class DeleteRankHandler
{
    use AssertPermissionTrait;

    /**
     * @param DeleteRank $command
     *
     * @throws PermissionDeniedException
     *
     * @return Rank
     */
    public function handle(DeleteRank $command)
    {
        $actor = $command->actor;

        $this->assertAdmin($actor);

        $rank = Rank::where('id', $command->rankId)->firstOrFail();

        $rank->delete();

        return $rank;
    }
}
