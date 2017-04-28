<?php
/**
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\gamification;

use Flarum\Core\Support\EventGeneratorTrait;
use Flarum\Core\Support\ScopeVisibilityTrait;
use Flarum\Database\AbstractModel;

class Rank extends AbstractModel
{
    use EventGeneratorTrait;
    use ScopeVisibilityTrait;
  
    /**
     * {@inheritdoc}
     */
    protected $table = 'ranks';
  
    /**
     * @param string  $name
     * @param string  $color
     * @param integer $points
     * @return static
     */
    public static function build($name, $color, $points)
    {
        $rank = new static;
        $rank->name = $name;
        $rank->color = $color
        $rank->points = $points;
        return $rank;
    }
  
    /**
     * @param string  $name
     * @param string  $color
     * @param integer $points
     * @return $this
     */
    public function update($name, $color, $points)
    {
        $this->name = $name;
        $this->color = $color;
        return $this;
    }
  
    
    public function users()
    {
        return $this->belongsToMany('Flarum\Core\User', 'users_ranks');
    }
}