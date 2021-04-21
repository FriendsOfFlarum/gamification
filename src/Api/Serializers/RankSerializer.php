<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api\Serializers;

use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Gamification\Rank;
use InvalidArgumentException;

class RankSerializer extends AbstractSerializer
{
    /**
     * @var string
     */
    protected $type = 'ranks';

    /**
     * @param $group
     *
     * @return array
     */
    protected function getDefaultAttributes($rank)
    {
        if (!($rank instanceof Rank)) {
            throw new InvalidArgumentException(
                get_class($this).' can only serialize instances of '.Rank::class
            );
        }

        return [
            'points' => $rank->points,
            'name'   => $rank->name,
            'color'  => $rank->color,
        ];
    }
}
