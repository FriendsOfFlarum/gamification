<?php
/**
 *
 *  This file is part of reflar/gamification.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 *
 */

namespace Reflar\gamification\Api\Controllers;

use Flarum\Api\Controller\AbstractCollectionController;
use Flarum\Core\Post\Floodgate;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Reflar\gamification\Repository\Gamification;
use Reflar\gamificarion\Api\Serializers\TopThreeSerializer;

class ListTopThreeController extends AbstractCollectionController
{
  
    public $serializer = 'Flarum\Api\Serializer\UserSerializer';
 
    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @var Floodgate
     */
    protected $floodgate;

    /**
     * @param Gamification $gamification
     */
    public function __construct(Gamification $gamification, Floodgate $floodgate)
    {
        $this->gamification = $gamification;
        $this->floodgate = $floodgate;
    }

    /**
     * @param ServerRequestInterface $request
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        if (! $request->getAttribute('bypassFloodgate')) {
            $this->floodgate->assertNotFlooding($request->getAttribute('actor'));
        }
        return $this->gamification->findTopThree();
    }
}