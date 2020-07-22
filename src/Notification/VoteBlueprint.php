<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Notification;

use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Post\Post;
use FoF\Gamification\Vote;

class VoteBlueprint implements BlueprintInterface
{
    /**
     * @var Vote
     */
    protected $vote;

    /**
     * VoteBlueprint constructor.
     *
     * @param Vote $vote
     */
    public function __construct(Vote $vote)
    {
        $this->vote = $vote;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->vote->post;
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser()
    {
        return $this->vote->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return $this->vote->value;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'vote';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return Post::class;
    }
}
