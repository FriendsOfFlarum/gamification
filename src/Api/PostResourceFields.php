<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api;

use Carbon\Carbon;
use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Post\Exception\FloodingException;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Gamification\Events\PostWasVoted;
use FoF\Gamification\Events\UserPointsUpdated;
use FoF\Gamification\Gamification;
use FoF\Gamification\Rank;
use FoF\Gamification\Vote;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Pusher\Pusher;

class PostResourceFields
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Gamification $gamification,
        protected Dispatcher $events,
        protected Container $container,
    ) {
    }

    public function __invoke(): array
    {
        return [
            Schema\Boolean::make('hasUpvoted')
                ->visible(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                })
                ->get(function (Post $post, Context $context) {
                    if ($context->getActor()->exists) {
                        /** @phpstan-ignore-next-line */
                        $vote = $post->actualvotes->first();

                        return $vote && $vote->isUpvote();
                    }

                    return null;
                }),
            Schema\Boolean::make('hasDownvoted')
                ->visible(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                })
                ->get(function (Post $post, Context $context) {
                    if ($context->getActor()->exists) {
                        /** @phpstan-ignore-next-line */
                        $vote = $post->actualvotes->first();

                        return $vote && $vote->isDownvote();
                    }

                    return null;
                }),
            Schema\Boolean::make('canSeeVotes')
                ->get(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                }),
            Schema\Number::make('votes')
                ->sumRelation('actualvotes', 'value')
                ->visible(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVotes', $post->discussion)
                        && $context->getActor()->can('canSeeVotes', $post);
                }),
            Schema\Boolean::make('canVote')
                ->get(function (Post $post, Context $context) {
                    return $context->getActor()->can('vote', $post);
                }),
            Schema\Boolean::make('seeVoters')
                ->get(function (Post $post, Context $context) {
                    return $context->getActor()->can('canSeeVoters', $post->discussion)
                        && $context->getActor()->can('canSeeVoters', $post);
                }),

            Schema\Str::make('vote')
                ->hidden()
                ->writable(function (Post $post, Context $context) {
                    return $context->updating()
                        && $context->getActor()->can('vote', $post);
                })
                ->in(['up', 'down'])
                ->nullable()
                ->set(function (Post $post, ?string $value, Context $context) {
                    if ($this->settings->get('fof-gamification.rateLimit')) {
                        $this->assertNotFlooding($context->getActor());
                    }

                    $this->vote($post, $value, $context->getActor());
                }),

            Schema\Relationship\ToMany::make('upvotes')
                ->includable()
                ->type('users'),
            Schema\Relationship\ToMany::make('downvotes')
                ->includable()
                ->type('users'),
        ];
    }

    public function vote(Post $post, ?string $voteValue, User $actor)
    {
        $vote = Vote::build($post, $actor);

        $vote->value = match (true) {
            $voteValue === 'up'   => 1,
            $voteValue === 'down' => -1,
            default               => 0,
        };

        $vote->save();

        $this->pushNewVote($vote);

        $this->updatePoints($post->user, $post);

        if ($voteUser = $vote->post->user) {
            $ranks = Rank::where('points', '<=', $voteUser->votes)->pluck('id');

            $voteUser->ranks()->sync($ranks);
        }

        $actor->last_vote_time = Carbon::now();
        $actor->save();

        $this->events->dispatch(
            new PostWasVoted($vote)
        );
    }

    public function updatePoints(?User $user, Post $post)
    {
        if ($user) {
            $user = Vote::updateUserVotes($user);
            $user->save();

            $this->events->dispatch(new UserPointsUpdated($user));
        }

        $discussion = $post->discussion;

        if ($post->id === $discussion->first_post_id) {
            $this->gamification->calculateHotness(
                Vote::updateDiscussionVotes($discussion)
            );
        }
    }

    public function pushNewVote(Vote $vote)
    {
        if ($this->container->bound(Pusher::class)) {
            $this->container->make(Pusher::class)->trigger('public', 'newVote', [
                'post_id' => $vote->post->id,
                'user_id' => $vote->user->id,
                'votes'   => $vote->post->votes()->sum('value'),
            ]);
        }
    }

    public function assertNotFlooding(User $actor): void
    {
        if ($actor->last_vote_time !== null && Carbon::parse($actor->last_vote_time)->greaterThanOrEqualTo(Carbon::now()->subSeconds(10))) {
            throw new FloodingException();
        }
    }
}
