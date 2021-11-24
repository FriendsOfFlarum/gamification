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

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;

class AddPostData
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(PostSerializer $serializer, Post $post, array $attributes): array
    {
        $actor = $serializer->getActor();

        $canSeeVotes = (bool) $actor->can('canSeeVotes', $post->discussion) && (bool) $actor->can('canSeeVotes', $post);

        if ($canSeeVotes) {
            if ($actor->exists) {
                $vote = Vote::query()->where(['post_id' => $post->id, 'user_id' => $actor->id])->first(['value']);
    
                $attributes['hasUpvoted'] = $vote && $vote->isUpvote();
                $attributes['hasDownvoted'] = $vote && $vote->isDownvote();
            } else {
                $attributes['hasUpvoted'] = null;
                $attributes['hasDownvoted'] = null;
            }
            $attributes['canSeeVotes'] = $canSeeVotes;
            $attributes['votes'] = Vote::calculate(['post_id' => $post->id]);
        } else {
            $attributes['votes'] = null;
        }

        $attributes['canVote'] = (bool) $actor->can('vote', $post);
        $attributes['seeVoters'] = (bool) $actor->can('canSeeVoters', $post->discussion) && (bool) $actor->can('canSeeVoters', $post);

        return $attributes;
    }
}
