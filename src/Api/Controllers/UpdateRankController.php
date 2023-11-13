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

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use FoF\Gamification\Api\Serializers\RankSerializer;
use FoF\Gamification\Commands\EditRank;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UpdateRankController extends AbstractShowController
{
    public $serializer = RankSerializer::class;

    /**
     * @var Dispatcher
     */
    protected $bus;

    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new EditRank(Arr::get($request->getQueryParams(), 'id'), RequestUtil::getActor($request), Arr::get($request->getParsedBody(), 'data', []))
        );
    }
}
