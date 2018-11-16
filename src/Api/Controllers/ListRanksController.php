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

namespace Reflar\Gamification\Api\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Gamification\Api\Serializers\RankSerializer;
use Reflar\Gamification\Rank;
use Tobscure\JsonApi\Document;

class ListRanksController extends AbstractListController
{
    /**
     * @var RankSerializer
     */
    public $serializer = RankSerializer::class;

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return Rank::all();
    }
}
