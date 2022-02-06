<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Jobs;

use Flarum\Notification\Notification;
use Flarum\Notification\NotificationSyncer;
use FoF\Gamification\Notification\VoteBlueprint;
use FoF\Gamification\Vote;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;

class VoteNotificationsJob implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    /**
     * @var Vote
     */
    protected $vote;

    public function __construct(Vote $vote)
    {
        $this->vote = $vote;
    }

    public function handle(NotificationSyncer $notifications)
    {
        $post = $this->vote->post;
        $user = $post->user;

        $notif = Notification::query()->where([
            'from_user_id'  => $this->vote->user->id,
            'type'          => 'vote',
            'subject_id'    => $post->id,
        ])->first();

        if ($notif) {
            if ($this->vote->value === 0) {
                $notif->delete();
            } else {
                $notif->data = $this->vote->value;
                $notif->save();
            }
        } elseif ($user && $user->id !== $this->vote->user->id && $this->vote->value !== 0) {
            if ($user->can('canSeeVoters', $post->discussion)) {
                if ($this->vote->value === 1 && $user->can('upvote_notifications', $post->discussion) || $this->vote->value === -1 && $user->can('downvote_notifications', $post->discussion)) {
                    $notifications->sync(
                        new VoteBlueprint($this->vote),
                        [$user]
                    );
                }
            }
        }
    }
}
