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
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/less/admin/extension.less')
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum/extension.less')
        ->route('/rankings', 'rankings')
        ->route('/hot', 'hot'),
    new Extend\Locales(__DIR__.'/locale'),
    (new Extend\Routes('api'))
        ->post('/reflar/gamification/convert', 'reflar.gamification.convert', Controllers\ConvertLikesController::class)
        ->get('/ranks', 'ranks.index', Controllers\ListRanksController::class)
        ->post('/ranks', 'ranks.create', Controllers\CreateRankController::class)
        ->post('/reflar/topimage/{id}', 'reflar.topImage', Controllers\UploadTopImageController::class)
        ->patch('/ranks/{id}', 'ranks.update', Controllers\UpdateRankController::class)
        ->delete('/ranks/{id}', 'ranks.delete', Controllers\DeleteRankController::class)
        ->get('/rankings', 'rankings', Controllers\OrderByPointsController::class),
    function (Dispatcher $events) {
        $events->subscribe(Listeners\AddRelationships::class);
        $events->subscribe(Listeners\EventHandlers::class);
        $events->subscribe(Listeners\SaveVotesToDatabase::class);
        $events->subscribe(Listeners\FilterDiscussionListByHotness::class);

        $events->subscribe(Access\DiscussionPolicy::class);
    },
];
