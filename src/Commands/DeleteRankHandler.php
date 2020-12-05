<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Commands;

use Flarum\User\Exception\PermissionDeniedException;
use FoF\Gamification\Rank;

class DeleteRankHandler
{
    /**
     * @param DeleteRank $command
     *
     * @throws PermissionDeniedException
     *
     * @return Rank
     */
    public function handle(DeleteRank $command)
    {
        $command->actor->assertAdmin();

        $rank = Rank::where('id', $command->rankId)->firstOrFail();

        $rank->delete();

        return $rank;
    }
}
