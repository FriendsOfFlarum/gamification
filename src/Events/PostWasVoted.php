<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Events;

use Flarum\Post\Post;
use Flarum\User\User;

class PostWasVoted
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var User
     */
    public $user;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var string
     */
    public $type;

    /**
     * PostWasVoted constructor.
     *
     * @param Post   $post
     * @param User   $user
     * @param User   $actor
     * @param string $type
     */
    public function __construct(Post $post, User $user, User $actor, $type)
    {
        $this->post = $post;
        $this->user = $user;
        $this->actor = $actor;
        $this->type = $type;
    }
}
