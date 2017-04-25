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

namespace Reflar\gamification\Notification;

use Flarum\Core\Notification\BlueprintInterface;
use Flarum\Core\User;

class RankupBlueprint implements BlueprintInterface
{

    /**
     * @var string
     */
    public $rank;

    /**
     * @var User
     */
    public $user;

    /**
     * @param $rank
     * @param User $user
     */
    public function __construct($rank, User $user)
    {
        $this->rank = $rank;
        $this->user = $user;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getSender()
    {
        return $this->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return ['rank' => $this->rank];
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'userPromoted';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return User::class;
    }
}