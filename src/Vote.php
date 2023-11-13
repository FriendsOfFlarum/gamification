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

use Flarum\Database\AbstractModel;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\User\User;

/**
 * @property int  $id
 * @property int  $user_id
 * @property int  $post_id
 * @property int  $value
 * @property Post $post
 * @property User $user
 */
class Vote extends AbstractModel
{
    protected $table = 'post_votes';

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $fillable = [
        'user_id',
        'post_id',
    ];

    public $timestamps = true;

    /**
     * @param Post $post
     * @param User $user
     *
     * @return Vote
     */
    public static function build(Post $post, User $user): Vote
    {
        return Vote::firstOrNew([
            'post_id' => $post->id,
            'user_id' => $user->id,
        ]);
    }

    public static function calculate($paramsOrQuery): int
    {
        $query = $paramsOrQuery;

        if (is_array($paramsOrQuery)) {
            $query = self::query()
                ->where($paramsOrQuery);
        }

        return $query->sum('value');
    }

    public static function updateUserVotes(User $user): User
    {
        $user->votes = self::calculate(
            self::query()
                ->join('posts', 'posts.id', '=', 'post_votes.post_id')
                ->where('posts.user_id', $user->id)
        );

        return $user;
    }

    public static function updateDiscussionVotes(Discussion $discussion): Discussion
    {
        $discussion->votes = self::calculate(['post_id' => $discussion->first_post_id]);

        return $discussion;
    }

    public function isUpvote()
    {
        return $this->value > 0;
    }

    public function isDownvote()
    {
        return $this->value < 0;
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
