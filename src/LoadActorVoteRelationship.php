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

use Flarum\Discussion\Discussion;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Psr\Http\Message\ServerRequestInterface;

class LoadActorVoteRelationship
{
    public static function mutateRelation(HasMany $query, ServerRequestInterface $request): HasMany
    {
        $actor = RequestUtil::getActor($request);

        return $query
            // So that we can tell if the current user has liked the post.
            ->where('user_id', $actor->id);
    }

    public static function sumRelation($controller, $data): void
    {
        $loadable = null;

        if ($data instanceof Discussion) {
            $loadable = $data->newCollection($data->posts)->filter(function ($post) {
                return $post instanceof Post;
            });
        } elseif ($data instanceof Collection) {
            $loadable = (new Post())->newCollection($data->map(function ($model) {
                return $model instanceof Discussion ? ($model->mostRelevantPost ?? $model->firstPost) : $model;
            })->filter());
        } elseif ($data instanceof Post) {
            $loadable = $data->newCollection([$data]);
        }

        if ($loadable && $loadable instanceof Collection) {
            $loadable->loadSum('actualvotes', 'value');
        }
    }
}
