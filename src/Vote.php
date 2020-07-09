<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification;

use Flarum\Database\AbstractModel;
use Flarum\Post\Post;
use Flarum\User\User;

/**
 * @property int user_id
 * @property int post_id
 * @property string type
 */
class Vote extends AbstractModel
{
    protected $table = 'post_votes';

    /**
     * @param Post $post
     * @param User $user
     *
     * @return static
     */
    public static function build(Post $post, User $user)
    {
        $vote = new static();

        $vote->post_id = $post->id;
        $vote->user_id = $user->id;

        return $vote;
    }

    public static function calculate($paramsOrQuery, $advanced = false): int
    {
        $query = $paramsOrQuery;

        if (is_array($paramsOrQuery)) {
            $query = self::query()
                ->where($paramsOrQuery);
        }

        $prefix = '';

        if ($advanced) {
            $prefix = self::query()->getConnection()->getTablePrefix().(new self())->getTable().'.';
        }

        return $query
            ->selectRaw("SUM(CASE WHEN {$prefix}type = \"Up\" THEN 1 WHEN {$prefix}type = \"Down\" THEN -1 ELSE 0 END) as vote")
            ->pluck('vote')
            ->sum();
    }
}
