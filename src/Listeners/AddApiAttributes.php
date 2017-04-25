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

namespace Reflar\gamification\Listeners;

use Flarum\Event\ConfigureApiRoutes;
// use Flarum\Event\ConfigureForumRoutes;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\gamification\Api\Controllers\ConvertLikesController;
use Reflar\gamification\Api\Controllers\ListTopThreeController;

class AddApiAttributes
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        // $events->listen(ConfigureForumRoutes::class, [$this, 'configureForumRoutes']);
    }

    /**
     * @param ConfigureApiRoutes $event
     */
    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->post('/reflar/gamification/convert', 'reflar.gamification.convert', ConvertLikesController::class);
        // $event->get('/rankings', 'rankings', ListTopThreeController::class);
    }

    /*
     * @param ConfigureForumRoutes $event
     */
    /* public function configureForumRoutes(ConfigureForumRoutes $event)
    {
        $event->get('/rankings', 'rankings');
    } **/
}
