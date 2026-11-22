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

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\User\User;

/**
 * Points given to a member by another extension. Write them through
 * {@see PointGrants}, which keeps the member's total and ranks in step.
 *
 * @property int         $id
 * @property int         $user_id
 * @property string      $source
 * @property string      $reason
 * @property int         $points
 * @property Carbon|null $created_at
 * @property User        $user
 */
class PointGrant extends AbstractModel
{
    public const UPDATED_AT = null;

    protected $table = 'gamification_point_grants';

    protected $casts = [
        'user_id'    => 'int',
        'points'     => 'int',
        'created_at' => 'datetime',
    ];

    public $timestamps = true;

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
