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
                /** @phpstan-ignore-next-line */
                $vote = $post->actualvotes->first();

                $attributes['hasUpvoted'] = $vote && $vote->isUpvote();
                $attributes['hasDownvoted'] = $vote && $vote->isDownvote();
            } else {
                $attributes['hasUpvoted'] = null;
                $attributes['hasDownvoted'] = null;
            }
            $attributes['canSeeVotes'] = $canSeeVotes;
            /** @phpstan-ignore-next-line */
            $attributes['votes'] = $post->actualvotes_sum_value;
        } else {
            $attributes['votes'] = null;
        }

        $attributes['canVote'] = (bool) $actor->can('vote', $post);
        $attributes['seeVoters'] = (bool) $actor->can('canSeeVoters', $post->discussion) && (bool) $actor->can('canSeeVoters', $post);

        return $attributes;
    }
}
