<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Validator;

use Flarum\Foundation\AbstractValidator;

class RankValidator extends AbstractValidator
{
    protected $rules = [
        'name'   => ['required', 'string'],
        'color'  => ['required', 'string'],
        'points' => ['required', 'integer'],
    ];
}
