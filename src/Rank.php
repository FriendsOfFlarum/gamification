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
     * @param string $name
     *
     * @return $this
     */
    public function updateName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @param int $points
     *
     * @return $this
     */
    public function updatePoints(int $points): self
    {
        $this->points = $points;

        return $this;
    }

    /**
     * @param string $color
     *
     * @return $this
     */
    public function updateColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function users(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
