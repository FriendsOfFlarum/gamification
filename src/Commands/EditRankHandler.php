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

namespace Reflar\gamification\Commands;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\PermissionDeniedException;
use Reflar\gamification\Rank;
use Reflar\gamification\Validator\RankValidator;

class EditRankHandler
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
     * @param EditRank $command
     * @return Rank
     * @throws PermissionDeniedException
     */
    public function handle(EditRank $command)
    {
        $actor = $command->actor;
        $data = $command->data;
      
        $this->assertAdmin($actor);

        $rank = Rank::where('id', $command->rankId)->findOrFail();

        $attributes = array_get($data, 'attributes', []);

        $rank->update($attributes);
      
        $this->validator->assertValid($rank->getDirty());

        $rank->save();

        return $rank;
    }
}
