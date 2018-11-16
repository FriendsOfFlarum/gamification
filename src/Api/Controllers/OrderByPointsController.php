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
use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\Exception\PermissionDeniedException;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Gamification\Gamification;
use Tobscure\JsonApi\Document;

class OrderByPointsController extends AbstractListController
{
    public $serializer = UserSerializer::class;

    /**
     * @var array
     */
    public $include = ['ranks'];

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @param Gamification $gamification
     */
    public function __construct(Gamification $gamification)
    {
        $this->gamification = $gamification;
    }

    /**
     * @param ServerRequestInterface $request
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        if ($request->getAttribute('actor')->cannot('reflar.gamification.viewRankingPage')) {
            throw new PermissionDeniedException();
        }

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        return $this->gamification->orderByPoints($limit, $offset);
    }
}
