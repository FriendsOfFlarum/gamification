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

namespace Reflar\Gamification\Listeners;

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
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Gamification\Api\Controllers\OrderByPointsController;
use Reflar\Gamification\Api\Serializers\RankSerializer;
use Reflar\Gamification\Rank;

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
            return $event->model->belongsToMany(User::class, 'posts_votes', 'post_id', 'user_id', null, null, 'upvotes')->where('type', 'Up');
        }

        if ($event->isRelationship(Post::class, 'downvotes')) {
            return $event->model->belongsToMany(User::class, 'posts_votes', 'post_id', 'user_id', null, null, 'downvotes')->where('type', 'Down');
        }

        if ($event->isRelationship(User::class, 'ranks')) {
            return $event->model->belongsToMany(Rank::class, 'users_ranks', null, null, null, null, 'ranks');
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
            $event->attributes['canViewRankingPage'] = (bool) $event->actor->can('reflar.gamification.viewRankingPage');
            $event->attributes['Points'] = $event->model->votes;
        }
        if ($event->isSerializer(Serializer\ForumSerializer::class)) {
            $event->attributes['IconName'] = $this->settings->get('reflar.gamification.iconName');
            $event->attributes['PointsPlaceholder'] = $this->settings->get('reflar.gamification.pointsPlaceholder');
            $event->attributes['DefaultLocale'] = $this->settings->get('default_locale');
            $event->attributes['CustomRankingImages'] = $this->settings->get('reflar.gamification.customRankingImages');
            $event->attributes['TopImage1'] = $this->settings->get('reflar.gamification.topimage.1');
            $event->attributes['TopImage2'] = $this->settings->get('reflar.gamification.topimage.2');
            $event->attributes['TopImage3'] = $this->settings->get('reflar.gamification.topimage.3');
            $event->attributes['ranksAmt'] = $this->settings->get('reflar.gamification.rankAmt');
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
