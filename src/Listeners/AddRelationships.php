<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Listeners;

use Flarum\Api\Controller;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Event\WillSerializeData;
use Flarum\Api\Serializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Gamification\Api\Controllers\OrderByPointsController;
use FoF\Gamification\Api\Serializers\RankSerializer;
use FoF\Gamification\Rank;
use Illuminate\Contracts\Events\Dispatcher;

class AddRelationships
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(WillSerializeData::class, [$this, 'loadRanksRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiAttributes']);
        $events->listen(Serializing::class, [$this, 'prepareApiAttributes']);
        $events->listen(WillGetData::class, [$this, 'includeLikes']);
    }

    /**
     * @param GetModelRelationship $event
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany|null
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Post::class, 'upvotes')) {
            return $event->model->belongsToMany(User::class, 'post_votes', 'post_id', 'user_id', null, null, 'upvotes')->where('type', 'Up');
        }

        if ($event->isRelationship(Post::class, 'downvotes')) {
            return $event->model->belongsToMany(User::class, 'post_votes', 'post_id', 'user_id', null, null, 'downvotes')->where('type', 'Down');
        }

        if ($event->isRelationship(User::class, 'ranks')) {
            return $event->model->belongsToMany(Rank::class, 'rank_users', null, null, null, null, 'ranks');
        }
    }

    /**
     * @param GetApiRelationship $event
     *
     * @return \Tobscure\JsonApi\Relationship|null
     */
    public function getApiAttributes(GetApiRelationship $event)
    {
        if ($event->isRelationship(Serializer\PostSerializer::class, 'upvotes')) {
            return $event->serializer->hasMany($event->model, Serializer\BasicUserSerializer::class, 'upvotes');
        }

        if ($event->isRelationship(Serializer\PostSerializer::class, 'downvotes')) {
            return $event->serializer->hasMany($event->model, Serializer\BasicUserSerializer::class, 'downvotes');
        }

        if ($event->isRelationship(Serializer\ForumSerializer::class, 'ranks') || $event->isRelationship(Serializer\UserSerializer::class, 'ranks')) {
            return $event->serializer->hasMany($event->model, RankSerializer::class, 'ranks');
        }
    }

    /**
     * @param WillSerializeData $event
     */
    public function loadRanksRelationship(WillSerializeData $event)
    {
        if ($event->isController(Controller\ShowForumController::class)) {
            $event->data['ranks'] = Rank::get();
        }
    }

    /**
     * @param Serializing $event
     */
    public function prepareApiAttributes(Serializing $event)
    {
        if ($event->isSerializer(Serializer\UserSerializer::class)) {
            $event->attributes['canViewRankingPage'] = (bool) $event->actor->can('fof.gamification.viewRankingPage');
            $event->attributes['Points'] = $event->model->votes;
        }

        if ($event->isSerializer(Serializer\ForumSerializer::class)) {
            $event->attributes['IconName'] = $this->settings->get('fof-gamification.iconName');
            $event->attributes['PointsPlaceholder'] = $this->settings->get('fof-gamification.pointsPlaceholder');
            $event->attributes['DefaultLocale'] = $this->settings->get('default_locale');
            $event->attributes['showVotesOnDiscussionPage'] = (bool) $this->settings->get('fof-gamification.showVotesOnDiscussionPage');
            $event->attributes['CustomRankingImages'] = $this->settings->get('fof-gamification.customRankingImages');
            $event->attributes['topimage1Url'] = "/assets/{$this->settings->get('topimage1_path')}";
            $event->attributes['topimage2Url'] = "/assets/{$this->settings->get('topimage2_path')}";
            $event->attributes['topimage3Url'] = "/assets/{$this->settings->get('topimage3_path')}";
            $event->attributes['ranksAmt'] = $this->settings->get('fof-gamification.rankAmt');
        }

        if ($event->isSerializer(Serializer\DiscussionSerializer::class)) {
            $event->attributes['votes'] = (int) $event->model->votes;
            $event->attributes['canVote'] = (bool) $event->actor->can('vote', $event->model);
            $event->attributes['canSeeVotes'] = (bool) $event->actor->can('canSeeVotes', $event->model);
        }
    }

    /**
     * @param WillGetData $event
     */
    public function includeLikes(WillGetData $event)
    {
        if ($event->isController(Controller\ListUsersController::class)
            || $event->isController(Controller\ShowUserController::class)
            || $event->isController(Controller\CreateUserController::class)
            || $event->isController(OrderByPointsController::class)
            || $event->isController(Controller\UpdateUserController::class)) {
            $event->addInclude('ranks');
        }
        if ($event->isController(Controller\ShowDiscussionController::class)) {
            $event->addInclude(['posts.upvotes', 'posts.downvotes', 'posts.user.ranks']);
        }
        if ($event->isController(Controller\ListPostsController::class)
            || $event->isController(Controller\ShowPostController::class)
            || $event->isController(Controller\CreatePostController::class)
            || $event->isController(Controller\UpdatePostController::class)) {
            $event->addInclude(['upvotes', 'downvotes', 'user.ranks']);
        }
        if ($event->isController(Controller\ShowForumController::class)) {
            $event->addInclude('ranks');
        }
    }
}
