<?php

namespace FoF\Gamification\Listeners;

use Flarum\Post\Event\Deleting;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;

class RemoveVoteHandler
{
    public function handle(Deleting $event)
    {
        $post = $event->post;

        $voteNumber = Vote::calculate(['post_id' => $post->id]);
        $user = $event->post->user;
        $user->votes = $user->votes - $voteNumber;

        $user->save();

        $ranks = Rank::whereBetween('points', [$user->votes + 1, $user->votes + 2])->get();

        if (null !== $ranks) {
            $user->ranks()->detach($ranks);
        }
    }
}
