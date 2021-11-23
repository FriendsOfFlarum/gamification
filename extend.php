<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification;

use Flarum\Api\Controller;
use Flarum\Api\Serializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Discussion\Event\Started;
use Flarum\Discussion\Search\DiscussionSearcher;
use Flarum\Extend;
use Flarum\Post\Event\Deleted;
use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
use Flarum\User\User;
use FoF\Extend\Extend\ExtensionSettings;
use FoF\Gamification\Api\Controllers;
use FoF\Gamification\Api\Serializers;
use FoF\Gamification\Notification\VoteBlueprint;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin/extension.less')
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum/extension.less')
        ->route('/rankings', 'rankings'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\Model(User::class))
        ->belongsToMany('allVotes', User::class, 'user_id'),

    (new Extend\Model(User::class))
        ->belongsToMany('ranks', Rank::class, 'rank_users'),

    (new Extend\Model(Post::class))
        ->relationship('upvotes', function (Post $post) {
            return $post->belongsToMany(User::class, 'post_votes', 'post_id', 'user_id', null, null, 'upvotes')
                ->where('value', '>', 0);
        }),

    (new Extend\Model(Post::class))
        ->belongsToMany('votes', User::class, 'post_votes', 'post_id', 'user_id'),

    (new ExtensionSettings())
        ->setPrefix('fof-gamification.')
        ->addKeys([
            'iconName',
            'pointsPlaceholder',
            'showVotesOnDiscussionPage',
            'rankAmt',
            'customRankingImages',
            'useAlternateLayout',
            'upVotesOnly',
            'iconNameAlt',
            'altPostVotingUi',
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

    (new Extend\Event())
        ->listen(Saving::class, Listeners\SaveVotesToDatabase::class)
        ->listen(Posted::class, Listeners\AddVoteHandler::class)
        ->listen(Deleted::class, Listeners\RemoveVoteHandler::class)
        ->listen(Started::class, Listeners\AddDiscussionVotes::class),

    (new Extend\ApiSerializer(Serializer\PostSerializer::class))
        ->hasMany('upvotes', Serializer\BasicUserSerializer::class),

    (new Extend\ApiSerializer(Serializer\UserSerializer::class))
        ->hasMany('ranks', Serializers\RankSerializer::class),

    (new Extend\ApiSerializer(Serializer\ForumSerializer::class))
        ->hasMany('ranks', Serializers\RankSerializer::class),

    (new Extend\ApiController(Controller\ShowForumController::class))
        ->prepareDataForSerialization(function (Controller\ShowForumController $controller, &$data) {
            $data['ranks'] = Rank::get();
        }),

    (new Extend\Settings())
        ->serializeToForum('fof-gamification.topimage1Url', 'fof-gamification.topimage1_path', function ($value) {
            return $value ? "/assets/$value" : null;
        })
        ->serializeToForum('fof-gamification.topimage2Url', 'fof-gamification.topimage2_path', function ($value) {
            return $value ? "/assets/$value" : null;
        })
        ->serializeToForum('fof-gamification.topimage3Url', 'fof-gamification.topimage3_path', function ($value) {
            return $value ? "/assets/$value" : null;
        }),

    (new Extend\ApiSerializer(Serializer\UserSerializer::class))
        ->attributes(function (Serializer\UserSerializer $serializer, User $user, array $attributes) {
            $attributes['canViewRankingPage'] = (bool) $serializer->getActor()->can('fof.gamification.viewRankingPage');
            $attributes['points'] = $user->votes;

            return $attributes;
        }),

    (new Extend\ApiSerializer(Serializer\DiscussionSerializer::class))
        ->attributes(AddDiscussionData::class),

    (new Extend\ApiSerializer(Serializer\PostSerializer::class))
        ->attributes(AddPostData::class),

    (new Extend\ApiController(Controller\ListUsersController::class))
        ->addInclude('ranks'),

    (new Extend\ApiController(Controller\ShowUserController::class))
        ->addInclude('ranks'),

    (new Extend\ApiController(Controller\CreateUserController::class))
        ->addInclude('ranks'),

    (new Extend\ApiController(Controllers\OrderByPointsController::class))
        ->addInclude('ranks'),

    (new Extend\ApiController(Controller\UpdateUserController::class))
        ->addInclude('ranks'),

    (new Extend\ApiController(Controller\ShowDiscussionController::class))
        ->addInclude('posts.user.ranks'),

    (new Extend\ApiController(Controller\ListDiscussionsController::class))
        ->addSortField('hotness')
        ->addSortField('votes'),

    (new Extend\ApiController(Controller\ListPostsController::class))
        ->addInclude('user.ranks')
        ->addOptionalInclude('upvotes'),

    (new Extend\ApiController(Controller\ShowPostController::class))
        ->addInclude('user.ranks')
        ->addOptionalInclude('upvotes'),

    (new Extend\ApiController(Controller\CreatePostController::class))
        ->addInclude('user.ranks')
        ->addOptionalInclude('upvotes'),

    (new Extend\ApiController(Controller\UpdatePostController::class))
        ->addInclude('user.ranks')
        ->addOptionalInclude('upvotes'),

    (new Extend\ApiController(Controller\ShowForumController::class))
        ->addInclude('ranks'),

    (new Extend\Notification())
        ->type(VoteBlueprint::class, Serializer\BasicPostSerializer::class, ['alert']),

    (new Extend\SimpleFlarumSearch(DiscussionSearcher::class))
        ->addGambit(Search\HotFilterGambit::class),

    (new Extend\Filter(DiscussionFilterer::class))
        ->addFilter(Search\HotFilterGambit::class),

    (new Extend\Console())
        ->command(Console\ResyncDiscussionVotes::class),

    (new Extend\View())
        ->namespace('fof-gamification', __DIR__.'/resources/views'),
];
