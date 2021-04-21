<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Commands;

use Flarum\User\Exception\PermissionDeniedException;
use FoF\Gamification\Rank;
use FoF\Gamification\Validator\RankValidator;
use Illuminate\Support\Arr;

class CreateRankHandler
{
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
        $command->actor->assertAdmin();
        $data = $command->data;

        $rank = Rank::build(
            Arr::get($data, 'attributes.name'),
            Arr::get($data, 'attributes.color'),
            Arr::get($data, 'attributes.points')
        );

        $this->validator->assertValid($rank->getAttributes());

        $rank->save();

        return $rank;
    }
}
