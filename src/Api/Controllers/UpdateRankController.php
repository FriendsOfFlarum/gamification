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

use Flarum\Api\Controller\AbstractResourceController;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Reflar\gamification\Api\Serializers\RankSerializer;
use Reflar\gamification\Commands\EditRank;

class UpdateRankController extends AbstractResourceController
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
        $id = array_get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $data = array_get($request->getParsedBody(), 'data', []);
      
        return $this->bus->dispatch(
            new EditRank($id, $actor, $data)
        );
    }
}
