<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification;

use Flarum\Extend;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
use Flarum\User\User;
use FoF\Extend\Extend\ExtensionSettings;
use FoF\Gamification\Api\Controllers;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__ . '/resources/less/admin/extension.less')
        ->js(__DIR__ . '/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum/extension.less')
        ->route('/rankings', 'rankings'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Model(User::class))
        ->belongsToMany('allVotes', User::class, 'user_id'),

    (new Extend\Model(User::class))
        ->belongsToMany('ranks', Rank::class, 'rank_users'),

    (new Extend\Model(Post::class))
        ->relationship('post_votes', function ($post) {
            return $post->belongsToMany(User::class, 'post_id', 'user_id', null, null, 'upvotes')
                ->where('value', '>', 0);
        }),

    (new Extend\Model(Post::class))
        ->belongsToMany('post_votes', User::class, 'post_id', 'user_id'),


    (new ExtensionSettings())
        ->setPrefix('fof-gamification.')
        ->addKeys([
            'iconName',
            'pointsPlaceholder',
            'showVotesOnDiscussionPage',
            'rankAmt',
            'customRankingImages',
            'useAlternateLayout',
        ]),

    (new Extend\Routes('api'))
        ->post('/fof/gamification/convert', 'fof.gamification.convert', Controllers\ConvertLikesController::class)
        ->post('/fof/gamification/topimage{id}', 'fof.topImage.add', Controllers\UploadTopImageController::class)
        ->delete('/fof/gamification/topimage{id}', 'fof.topImage.delete', Controllers\DeleteTopImageController::class)
        ->get('/ranks', 'ranks.index', Controllers\ListRanksController::class)
        ->post('/ranks', 'ranks.create', Controllers\CreateRankController::class)
        ->patch('/ranks/{id}', 'ranks.update', Controllers\UpdateRankController::class)
        ->delete('/ranks/{id}', 'ranks.delete', Controllers\DeleteRankController::class)
        ->get('/rankings', 'rankings', Controllers\OrderByPointsController::class),

    function (Dispatcher $events) {
        $events->subscribe(Listeners\AddData::class);
        $events->subscribe(Listeners\EventHandlers::class);
        $events->subscribe(Listeners\FilterDiscussionListByHotness::class);

        $events->listen(Saving::class, Listeners\SaveVotesToDatabase::class);
    },
];
