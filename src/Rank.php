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

/**
 * @property int    $id
 * @property string $name
 * @property string $color
 * @property int    $points
 */
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
     *
     * @return static
     */
    public static function build($name, $color, $points)
    {
        $rank = new static();
        $rank->name = $name;
        $rank->color = $color;
        $rank->points = $points;

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

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
