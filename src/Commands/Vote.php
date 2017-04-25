<?php
/**
 *
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 *
 */

namespace Reflar\gamification\Commands;


class Vote
{
    /**.
     * @var integer
     */
    public $post_id;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var string
     */
    public $type;

    /**
     * @param int $post_id
     * @param User $actor
     * @param string $type
     */
    public function __construct($post_id, User $actor, $type)
    {
        $this->post_id = $post_id;
        $this->actor = $actor;
        $this->type = $type;
    }
}