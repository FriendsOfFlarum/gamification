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

use Flarum\Database\AbstractModel;
use Flarum\User\User;

class Rank extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'ranks';

    /**
     * @param string $name
     * @param string $color
     * @param int    $points
     * @param int|array $groups
     *
     * @return static
     */
    public static function build($name, $color, $points, $groups)
    {
        $rank = new static();
        $rank->name = $name;
        $rank->color = $color;
        $rank->points = $points;

        if (is_int($groups)) {
            $groups = [$groups];
        }
        $rank->groups = $groups;

        return $rank;
    }

    /**
     * @param $name
     *
     * @return $this
     */
    public function updateName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @param $points
     *
     * @return $this
     */
    public function updatePoints($points)
    {
        $this->points = $points;

        return $this;
    }

    /**
     * @param $color
     *
     * @return $this
     */
    public function updateColor($color)
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @param int|array $color
     *
     * @return $this
     */
    public function updateGroups($groups)
    {
        if (is_int($groups)) {
            $groups = [$groups];
        }
        $this->groups = $groups;

        return $this;
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
