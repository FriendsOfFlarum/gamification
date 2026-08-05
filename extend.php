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
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Event\Started;
use Flarum\Discussion\Search\DiscussionSearcher;
use Flarum\Extend;
use Flarum\Post\Event\Deleted;
use Flarum\Post\Event\Posted;
use Flarum\Post\Filter\PostSearcher;
use Flarum\Post\Post;
use Flarum\User\Search\UserSearcher;
use Flarum\User\User;
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
        ->cast('trending', 'float'),

    (new Extend\Routes('api'))
        ->post('/fof/gamification/convert', 'fof.gamification.convert', Controllers\ConvertLikesController::class)
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
    new Extend\ApiResource(Api\Resource\LeaderboardResource::class),

    (new Extend\Settings())
        ->default('fof-gamification.iconName', 'thumbs')
        ->default('fof-gamification.iconNameAlt', 'arrow')
        ->default('fof-gamification.showVotesOnDiscussionPage', true)
        ->default('fof-gamification.useAlternateLayout', false)
        ->default('fof-gamification.upVotesOnly', false)
        ->default('fof-gamification.altPostVotingUi', false)
        ->default('fof-gamification.blockedUsers', '')
        ->default(LeaderboardEligibility::EXCLUDED_USERS, '[]')
        ->default(LeaderboardEligibility::EXCLUDED_GROUPS, '[]')
        ->default(LeaderboardEligibility::EXCLUDE_SUSPENDED, true)
        ->default(Leaderboard\MetricRegistry::DEFAULT_METRIC, Leaderboard\Metric\PostsWritten::KEY)
        ->default(Leaderboard\Period::DEFAULT_PERIOD, Leaderboard\Period::Year->value)
        ->default('fof-gamification.rankAmt', 2)
        ->default('fof-gamification.firstPostOnly', true)
        ->default('fof-gamification.allowSelfVotes', true)
        ->default(EnabledTags::SETTING, '')
        ->serializeToForum('fof-gamification.showVotesOnDiscussionPage', 'fof-gamification.showVotesOnDiscussionPage', 'boolval')
        ->serializeToForum('fof-gamification.useAlternateLayout', 'fof-gamification.useAlternateLayout', 'boolval')
        ->serializeToForum('fof-gamification.upVotesOnly', 'fof-gamification.upVotesOnly', 'boolval')
        ->serializeToForum('fof-gamification.altPostVotingUi', 'fof-gamification.altPostVotingUi', 'boolval')
        ->serializeToForum('fof-gamification.iconName', 'fof-gamification.iconName')
        ->serializeToForum('fof-gamification.iconNameAlt', 'fof-gamification.iconNameAlt')
        ->serializeToForum('fof-gamification.rankAmt', 'fof-gamification.rankAmt', 'intval')
        ->serializeToForum('fof-gamification.firstPostOnly', 'fof-gamification.firstPostOnly', 'boolval'),

    (new Extend\ApiResource(Resource\UserResource::class))
        ->endpoint(['show', 'update', 'create', 'index'], function (Endpoint\Show|Endpoint\Update|Endpoint\Create|Endpoint\Index $endpoint) {
            return $endpoint->addDefaultInclude(['ranks']);
        })
        ->fields(Api\UserResourceFields::class)
        ->sorts(fn () => [
            SortColumn::make('votes')
                ->visible(function (Context $context) {
                    return $context->getActor()->can('fof.gamification.viewRankingPage');
                }),
        ]),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->fields(Api\DiscussionResourceFields::class)
        ->sorts(fn () => [
            SortColumn::make('trending')
                ->descendingAlias('trending'),
            SortColumn::make('votes')
                ->descendingAlias('votes'),
        ])
        // The discussion's vote fields resolve through its first post, so load
        // it and the actor's own vote on it for the whole page at once.
        ->endpoint('index', function (Endpoint\Index $endpoint) {
            return $endpoint
                // The first post is loaded unconstrained. Narrowing it to the
                // gamified tags skipped the dependent vote load on pages that
                // carry none, but `eagerLoadWhere()` feeds `loadMissing()`, and
                // a relation loaded with no match is still *marked* loaded — so
                // a discussion outside those tags served `firstPost` as
                // present-and-null, and a client that explicitly asked for
                // `include=firstPost` was handed nothing. Flarum's admin
                // announcements widget reads its excerpts from that include and
                // rendered every card blank.
                //
                // The saving belongs on the votes load itself, which is what was
                // ever worth avoiding: it is this extension's query, and
                // narrowing it changes no relation the API promises.
                ->eagerLoad('firstPost')
                ->eagerLoadWhere('firstPost.actualvotes', function ($query, Context $context) {
                    // Only the discussions gamification applies to can show a
                    // vote, so there is nothing to fetch for the rest. This
                    // query is on `post_votes`, so the gate is applied through
                    // the vote's own post.
                    $query->whereHas('post', function ($posts) {
                        resolve(TagGate::class)->constrainToEnabled($posts);
                    });

                    // A guest has no votes to find; constraining on a null id
                    // would run the query anyway and match nothing.
                    $query->where('user_id', $context->getActor()->id ?? 0);
                });
        }),

    (new Extend\ApiResource(Resource\PostResource::class))
        ->fields(Api\PostResourceFields::class)
        ->endpoint(['index', 'show', 'create', 'update'], function (Endpoint\Index|Endpoint\Show|Endpoint\Create|Endpoint\Update $endpoint) {
            return $endpoint->addDefaultInclude(['user.ranks']);
        })
        ->endpoint(['index', 'show', 'update'], function (Endpoint\Index|Endpoint\Show|Endpoint\Update $endpoint) {
            return $endpoint
                ->eagerLoadWhere('actualvotes', function ($query, Context $context) {
                    $query->where('user_id', $context->getActor()->id ?? 0);
                })
                // Each post serializes its discussion, whose own vote fields
                // resolve through that discussion's first post. Without these
                // the first post and its votes were fetched one discussion at
                // a time.
                ->eagerLoad('discussion.firstPost')
                ->eagerLoadWhere('discussion.firstPost.actualvotes', function ($query, Context $context) {
                    $query->where('user_id', $context->getActor()->id ?? 0);
                });
        }),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(Api\ForumResourceFields::class)
        ->endpoint('show', function (Endpoint\Show $endpoint) {
            return $endpoint->addDefaultInclude(['ranks']);
        }),

    (new Extend\Notification())
        ->type(VoteBlueprint::class, ['alert']),

    (new Extend\ServiceProvider())
        ->register(Provider\LeaderboardProvider::class),

    (new Extend\Console())
        ->command(Console\ResyncUserVotes::class)
        ->command(Console\AutoAssignGroups::class)
        ->command(Console\ResyncDiscussionVotes::class),

    (new Extend\View())
        ->namespace('fof-gamification', __DIR__.'/resources/views'),

    (new Extend\SearchDriver(\Flarum\Search\Database\DatabaseSearchDriver::class))
        ->addFilter(DiscussionSearcher::class, Search\TrendingFilter::class)
        ->addFilter(PostSearcher::class, Filter\VotedFilter::class)
        ->addFilter(UserSearcher::class, Filter\RankableFilter::class),
];
