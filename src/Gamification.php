<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification;

use Flarum\Post\PostRepository;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Flarum\User\UserRepository;

class Gamification
{
    /**
     * Sets the maximum number of user exposed through the ranking api.
     */
    const MAXIMUM_USER_EXPOSED = 25;

    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @var UserRepository
     */
    protected $users;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param PostRepository              $posts
     * @param UserRepository              $users
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(PostRepository $posts, UserRepository $users, SettingsRepositoryInterface $settings)
    {
        $this->posts = $posts;
        $this->users = $users;
        $this->settings = $settings;
    }

    /**
     * The Reddit hotness algorithm from https://github.com/reddit/reddit.
     *
     * @param $discussion
     */
    public function calculateHotness($discussion)
    {
        $date = strtotime($discussion->start_time);

        $s = $discussion->votes;
        $order = log10(max(abs($s), 1));

        if ($s > 0) {
            $sign = 1;
        } elseif ($s < 0) {
            $sign = -1;
        } else {
            $sign = 0;
        }

        $seconds = $date - 1134028003;

        $discussion->hotness = round($sign * $order + $seconds / 45000, 10);

        $discussion->save();
    }

    /**
     * @return mixed
     */
    public function orderByPoints($limit, $offset)
    {
        $blockedUsers = explode(', ', $this->settings->get('fof-gamification.blockedUsers'));

        if ($limit > self::MAXIMUM_USER_EXPOSED) {
            $limit = self::MAXIMUM_USER_EXPOSED;
        }

        if ($offset >= self::MAXIMUM_USER_EXPOSED) {
            return [];
        }

        if (($limit + $offset) > self::MAXIMUM_USER_EXPOSED) {
            $limit = $limit + $offset - self::MAXIMUM_USER_EXPOSED;
        }

        $query = User::query()
            ->whereNotIn('username', $blockedUsers)
            ->orderBy('votes', 'desc')
            ->offset($offset)
            ->take($limit)
            ->get();

        return $query;
    }

    /**
     * @param $post_id
     * @param $user_id
     * @param User $actor
     */
    public function convertLike($post_id, $user_id)
    {
        $user = $this->users->query()->where('id', $user_id)->first();
        $post = $this->posts->query()->where('id', $post_id)->first();

        if (null !== $post && null !== $post->user && null !== $user) {
            $post->user->increment('votes');

            if ($post->number = 1) {
                $post->discussion->increment('votes');
            }

            $vote = Vote::build($post, $user);
            $vote->type = 'Up';
            $vote->save();

            $ranks = json_decode($this->settings->get('fof-gamification.ranks'), true);

            if (isset($ranks[$post->user->votes])) {
                $post->user->rank = $ranks[$post->user->votes];
                $post->user->save();
            }
        }
    }
}
