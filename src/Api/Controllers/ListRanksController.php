<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api\Controllers;

use Flarum\Api\Controller\AbstractListController;
use FoF\Gamification\Api\Serializers\RankSerializer;
use FoF\Gamification\Rank;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListRanksController extends AbstractListController
{
    public $serializer = RankSerializer::class;

    protected function data(ServerRequestInterface $request, Document $document)
    {
        return Rank::all();
    }
}
