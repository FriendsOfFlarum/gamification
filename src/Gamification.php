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

use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;

class Gamification
{
    /**
     * Sets the maximum number of user exposed through the ranking api.
     */
    const MAXIMUM_USER_EXPOSED = 25;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * The Reddit hotness algorithm from https://github.com/reddit/reddit.
     *
     * @param $discussion
     */
    public function calculateHotness($discussion)
    {
        $date = strtotime($discussion->created_at);

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

        $discussion->hotness = round($order + (($sign * $seconds) / 45000), 10);

        $discussion->save();
    }

    /**
     * @return mixed
     */
    public function orderByPoints(int $limit, int $offset)
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
     * @param $postId
     * @param $userId
     */
    public function convertLike($postId, $userId)
    {
        $user = User::find($userId);
        $post = Post::find($postId);

        if ($post && $post->user && $user) {
            Vote::updateUserVotes($post->user)->save();

            if ($post->number === 1) {
                Vote::updateDiscussionVotes($post->discussion);
            }

            $vote = Vote::build($post, $user);
            $vote->value = 1;
            $vote->save();

            $ranks = json_decode($this->settings->get('fof-gamification.ranks'), true);

            if (isset($ranks[$post->user->votes])) {
                $post->user->rank = $ranks[$post->user->votes];
                $post->user->save();
            }
        }
    }
}
