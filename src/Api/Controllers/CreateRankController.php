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

namespace Reflar\gamification\Api\Controllers;

use Flarum\Api\Controller\AbstractCreateController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Reflar\gamification\Api\Serializers\RankSerializer;
use Reflar\gamification\Commands\CreateRank;

class CreateRankController extends AbstractCreateController
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
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new CreateRank($request->getAttribute('actor'), array_get($request->getParsedBody(), 'data', []))
        );
    }
}
