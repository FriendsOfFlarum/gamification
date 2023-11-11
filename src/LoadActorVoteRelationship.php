<?php

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
            $loadable = $data->map(function ($model) {
                return $model instanceof Discussion ? $model->firstPost : $model;
            });
        } elseif ($data instanceof Post) {
            $loadable = $data->newCollection([$data]);
        }

        if ($loadable) {
            $loadable->loadSum('actualvotes', 'value');
        }
    }
}
