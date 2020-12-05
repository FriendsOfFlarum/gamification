<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api\Controllers;

use Flarum\Api\Controller\AbstractShowController;
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

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new EditRank(Arr::get($request->getQueryParams(), 'id'), $request->getAttribute('actor'), Arr::get($request->getParsedBody(), 'data', []))
        );
    }
}
