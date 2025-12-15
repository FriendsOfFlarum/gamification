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
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Http\RequestUtil;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Gamification\Gamification;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class OrderByPointsController extends AbstractListController
{
    public $serializer = UserSerializer::class;

    public $include = ['ranks'];

    public function __construct(protected Gamification $gamification)
    {
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        if (RequestUtil::getActor($request)->cannot('fof.gamification.viewRankingPage')) {
            throw new PermissionDeniedException();
        }

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        return $this->gamification->orderByPoints($limit, $offset);
    }
}
