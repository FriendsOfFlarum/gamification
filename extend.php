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

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Sort\SortColumn;
use Flarum\Api\Controller;
use Flarum\Api\Serializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Started;
use Flarum\Discussion\Search\DiscussionSearcher;
use Flarum\Extend;
use Flarum\Post\Event\Deleted;
use Flarum\Post\Event\Posted;
use Flarum\Post\Event\Saving;
use Flarum\Post\Filter\PostSearcher;
use Flarum\Post\Post;
use Flarum\User\Search\UserSearcher;
use Flarum\User\User;
use FoF\Extend\Extend\ExtensionSettings;
use FoF\Gamification\Api\Controllers;
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
        ->cast('votes', 'int')
        ->cast('rank', 'string')
        ->cast('last_vote_time', 'datetime')
        ->belongsToMany('ranks', Rank::class, 'rank_users'),

    (new Extend\Model(Post::class))
        ->belongsToMany('votes', User::class, 'post_votes', 'post_id', 'user_id')
        ->relationship('upvotes', function (Post $post) {
            return $post->votes()->where('value', '>', 0);
        })
        ->relationship('downvotes', function (Post $post) {
            return $post->votes()->where('value', -1);
        })
        ->relationship('actualvotes', function (Post $post) {
            return $post->hasMany(Vote::class, 'post_id');
        }),

    (new Extend\Model(Discussion::class))
        ->cast('votes', 'int')
        ->cast('hotness', 'float'),

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
        ->post('/fof/gamification/topimage{id}', 'fof.topImage.add', Controllers\UploadTopImageController::class),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\PostPolicy::class),

    (new Extend\Event())
        ->listen(Posted::class, Listeners\AddVoteHandler::class)
        ->listen(Deleted::class, Listeners\RemoveVoteHandler::class)
        ->listen(Started::class, Listeners\AddDiscussionVotes::class)
        ->listen(Events\UserPointsUpdated::class, Listeners\UpdateAutoAssignedGroups::class)
        ->subscribe(Listeners\QueueJobs::class),

    new Extend\ApiResource(Api\Resource\RankResource::class),

    (new Extend\Settings())
        ->default('fof-gamification.blockedUsers', '')
        ->default('fof-gamification.rankAmt', 2)
        ->default('fof-gamification.firstPostOnly', false)
        ->default('fof-gamification.allowSelfVotes', true),

    (new Extend\ApiResource(Resource\UserResource::class))
        ->endpoint(['show', 'update', 'create', 'index'], function (Endpoint\Show|Endpoint\Update|Endpoint\Create|Endpoint\Index $endpoint) {
            return $endpoint->addDefaultInclude(['ranks']);
        })
        ->fields(Api\UserResourceFields::class)
        ->sorts(fn () => [
            SortColumn::make('votes')
                ->visible(function (Context $context) {
                    return $context->getActor()->can('fof.gamification.viewRankingPage');
                })
        ]),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->fields(Api\DiscussionResourceFields::class)
        ->sorts(fn () => [
            SortColumn::make('hotness')
                ->descendingAlias('hot'),
            SortColumn::make('votes')
                ->descendingAlias('votes'),
        ])
        ->endpoint('index', function (Endpoint\Index $endpoint) {
            return $endpoint->eagerLoadWhere('firstPost.actualvotes', function ($query, Context $context) {
                $query->where('user_id', $context->getActor()->id);
            });
        }),

    (new Extend\ApiResource(Resource\PostResource::class))
        ->fields(Api\PostResourceFields::class)
        ->endpoint(['index', 'show', 'create', 'update'], function (Endpoint\Index|Endpoint\Show|Endpoint\Create|Endpoint\Update $endpoint) {
            return $endpoint->addDefaultInclude(['user.ranks']);
        })
        ->endpoint(['index', 'show', 'update'], function (Endpoint\Index|Endpoint\Show|Endpoint\Update $endpoint) {
            return $endpoint->eagerLoadWhere('actualvotes', function ($query, Context $context) {
                $query->where('user_id', $context->getActor()->id);
            });
        }),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(Api\ForumResourceFields::class)
        ->endpoint('show', function (Endpoint\Show $endpoint) {
            return $endpoint->addDefaultInclude(['ranks']);
        }),

    (new Extend\Notification())
        ->type(VoteBlueprint::class, ['alert']),

    (new Extend\Console())
        ->command(Console\ResyncUserVotes::class)
        ->command(Console\AutoAssignGroups::class)
        ->command(Console\ResyncDiscussionVotes::class),

    (new Extend\View())
        ->namespace('fof-gamification', __DIR__.'/resources/views'),

    (new Extend\SearchDriver(\Flarum\Search\Database\DatabaseSearchDriver::class))
        ->addFilter(DiscussionSearcher::class, Search\HotFilter::class)
        ->addFilter(PostSearcher::class, Filter\VotedFilter::class)
        ->addFilter(UserSearcher::class, Filter\RankableFilter::class),
];
