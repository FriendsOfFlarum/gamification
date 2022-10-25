<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Access;

use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class PostPolicy extends AbstractPolicy
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    private function isFirstPostOnlyMode(): bool
    {
        return $this->settings->get('fof-gamification.firstPostOnly');
    }

    private function voteForSelfEnabled(): bool
    {
        return $this->settings->get('fof-gamification.allowSelfVotes');
    }

    public function vote(User $actor, Post $post)
    {
        if ($post->number !== 1 && $this->isFirstPostOnlyMode()) {
            return $this->deny();
        }

        if ($actor->id === $post->user_id && !$this->voteForSelfEnabled()) {
            return $this->deny();
        }

        return $actor->can('votePosts', $post->discussion);
    }

    public function canSeeVotes(User $actor, Post $post)
    {
        if ($post->number !== 1 && $this->isFirstPostOnlyMode()) {
            return $this->deny();
        }

        return $actor->can('canSeeVotes', $post->discussion);
    }

    public function canSeeVoters(User $actor, Post $post)
    {
        if ($post->number !== 1 && $this->isFirstPostOnlyMode()) {
            return $this->deny();
        }

        return $actor->can('canSeeVoters', $post->discussion);
    }
}
