<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2020 FriendsOfFlarum.
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
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Gamification\Api\Controllers\OrderByPointsController;
use FoF\Gamification\Api\Serializers\RankSerializer;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;
use Illuminate\Contracts\Events\Dispatcher;

class AddData
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
        $events->listen(WillSerializeData::class, [$this, 'loadRanksRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiAttributes']);
        $events->listen(Serializing::class, [$this, 'prepareApiAttributes']);
        $events->listen(WillGetData::class, [$this, 'includeLikes']);
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
        if ($event->isSerializer(Serializer\ForumSerializer::class)) {
            $prefix = 'fof-gamification';

            $event->attributes["$prefix.topimage1Url"] = "/assets/{$this->settings->get("$prefix.topimage1_path")}";
            $event->attributes["$prefix.topimage2Url"] = "/assets/{$this->settings->get("$prefix.topimage2_path")}";
            $event->attributes["$prefix.topimage3Url"] = "/assets/{$this->settings->get("$prefix.topimage3_path")}";
        }

        if ($event->isSerializer(Serializer\UserSerializer::class)) {
            $event->attributes['canViewRankingPage'] = (bool) $event->actor->can('fof.gamification.viewRankingPage');
            $event->attributes['points'] = $event->model->votes;
        }

        if ($event->isSerializer(Serializer\DiscussionSerializer::class)) {
            $post = $event->model->firstPost ?: $event->model->posts()->where('number', 1)->first();

            if ($event->actor->exists && $post) {
                $vote = Vote::query()->where([
                    'post_id' => $post->id,
                    'user_id' => $event->actor->id,
                ])->first(['value']);

                $event->attributes['hasUpvoted'] = $vote && $vote->isUpvote();
                $event->attributes['hasDownvoted'] = $vote && $vote->isDownvote();
            }

            $event->attributes['votes'] = (int) $event->model->votes;

            $event->attributes['canVote'] = $post && $event->actor->can('vote', $post);
        }

        if ($event->isSerializer(Serializer\PostSerializer::class)) {
            if ($event->actor->exists) {
                $vote = Vote::query()->where(['post_id' => $event->model->id, 'user_id' => $event->actor->id])->first(['value']);

                $event->attributes['hasUpvoted'] = $vote && $vote->isUpvote();
                $event->attributes['hasDownvoted'] = $vote && $vote->isDownvote();
            }

            $event->attributes['votes'] = Vote::calculate(['post_id' => $event->model->id]);

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
            $event->addInclude('posts.user.ranks');
        }
        if ($event->isController(Controller\ListDiscussionsController::class)) {
            $event->addSortField('hotness');
        }
        if ($event->isController(Controller\ListPostsController::class)
            || $event->isController(Controller\ShowPostController::class)
            || $event->isController(Controller\CreatePostController::class)
            || $event->isController(Controller\UpdatePostController::class)) {
            $event->addInclude(['user.ranks']);
            $event->addOptionalInclude('upvotes');
        }
        if ($event->isController(Controller\ShowForumController::class)) {
            $event->addInclude('ranks');
        }
    }
}
