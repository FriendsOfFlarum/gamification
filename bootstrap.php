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

namespace Reflar\Gamification;

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Gamification\Api\Controllers;

return [
    (new Extend\Assets('admin'))
        ->asset(__DIR__.'/less/admin/extension.less')
        ->asset(__DIR__.'/js/admin/dist/extension.js')
        ->bootstrapper('reflar/gamification/main'),
    (new Extend\Assets('forum'))
        ->asset(__DIR__.'/js/forum/dist/extension.js')
        ->asset(__DIR__.'/less/forum/extension.less')
        ->bootstrapper('reflar/gamification/main'),
    new Extend\Locales(__DIR__.'/locale'),
    (new Extend\Routes('api'))
        ->post('/reflar/gamification/convert', 'reflar.gamification.convert', Controllers\ConvertLikesController::class)
        ->get('/ranks', 'ranks.index', Controllers\ListRanksController::class)
        ->post('/ranks', 'ranks.create', Controllers\CreateRankController::class)
        ->post('/reflar/topimage/{id}', 'reflar.topImage', Controllers\UploadTopImageController::class)
        ->patch('/ranks/{id}', 'ranks.update', Controllers\UpdateRankController::class)
        ->delete('/ranks/{id}', 'ranks.delete', Controllers\DeleteRankController::class)
        ->get('/rankings', 'rankings', Controllers\OrderByPointsController::class),
    (new Extend\Routes('forum'))
        ->get('/rankings', 'rankings', null)
        ->get('/hot', 'hot', null),
    function (Dispatcher $events) {
        $events->subscribe(Listeners\AddRelationships::class);
        $events->subscribe(Listeners\EventHandlers::class);
        $events->subscribe(Listeners\SaveVotesToDatabase::class);
        $events->subscribe(Listeners\FilterDiscussionListByHotness::class);

        $events->subscribe(Access\DiscussionPolicy::class);
    },
];
