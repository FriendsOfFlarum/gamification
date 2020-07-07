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
use Illuminate\Database\Eloquent\Collection;

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

    /**
     * @param Collection $votes
     * @return int
     */
    public static function calculate($votes): int
    {
        return $votes->pluck('type')->map(function ($item) {
            return $item === 'Down' ? -1 : 1;
        })->sum();
    }
}
