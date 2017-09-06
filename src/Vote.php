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

use Flarum\Core\Post;
use Flarum\Core\User;
use Flarum\Database\AbstractModel;

class Vote extends AbstractModel
{
    protected $table = 'posts_votes';

    /**
     * @param $post_id
     * @param $user_id
     * @param $type
     */
    public static function build(Post $post, User $user, $type)
    {
        $vote = new static();

        $vote->post_id = $post->id;
        $vote->user_id = $user->id;
        $vote->type = $type;

        return $vote;
    }
}
