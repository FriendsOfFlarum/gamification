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

use Flarum\Core\Support\ScopeVisibilityTrait;
use Flarum\Database\AbstractModel;

class Rank extends AbstractModel
{
    use ScopeVisibilityTrait;
    /**
     * {@inheritdoc}
     */
    protected $table = 'ranks';

    public function users()
    {
        return $this->belongsToMany('Flarum\Core\User', 'users_groups');
    }
}