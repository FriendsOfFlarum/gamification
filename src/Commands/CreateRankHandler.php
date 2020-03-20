<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Commands;

use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Gamification\Rank;
use FoF\Gamification\Validator\RankValidator;

class CreateRankHandler
{
    use AssertPermissionTrait;

    /**
     * @var RankValidator
     */
    protected $validator;

    /**
     * @param RankValidator $validator
     */
    public function __construct(RankValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param CreateRank $command
     *
     * @throws PermissionDeniedException
     *
     * @return Rank
     */
    public function handle(CreateRank $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $rank = Rank::build(
            array_get($data, 'attributes.name'),
            array_get($data, 'attributes.color'),
            array_get($data, 'attributes.points')
        );

        $this->validator->assertValid($rank->getAttributes());

        $rank->save();

        return $rank;
    }
}
