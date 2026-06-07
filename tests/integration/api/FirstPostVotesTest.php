<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Tests\integration\api;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

class FirstPostVotesTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-gamification');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id 2 — another voter
                [
                    'id'                 => 3,
                    'username'           => 'actor',
                    'password'           => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // "too-obscure"
                    'email'              => 'actor@machine.local',
                    'is_email_confirmed' => 1,
                ],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'Voted discussion', 'created_at' => Carbon::now()->toDateTimeString(), 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 1, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => Carbon::now()->toDateTimeString(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>first post</p></t>'],
            ],
            // The actor (user 3) upvoted; another user (user 2, a lower user_id)
            // downvoted. An unconstrained `actualvotes->first()` returns the row
            // that sorts first by the (user_id, post_id) index — user 2's
            // downvote — instead of the actor's own vote.
            'post_votes' => [
                ['id' => 1, 'post_id' => 1, 'user_id' => 2, 'value' => -1],
                ['id' => 2, 'post_id' => 1, 'user_id' => 3, 'value' => 1],
            ],
        ]);
    }

    #[Test]
    public function discussion_list_reflects_only_the_actors_vote()
    {
        $attributes = $this->discussionAttributes(
            $this->send($this->request('GET', '/api/discussions', ['authenticatedAs' => 3])),
            1
        );

        $this->assertTrue($attributes['hasUpvoted'], 'hasUpvoted should be true for the actor who upvoted');
        $this->assertFalse($attributes['hasDownvoted'], 'hasDownvoted should be false for the actor who upvoted');
    }

    #[Test]
    public function single_discussion_reflects_only_the_actors_vote()
    {
        $response = $this->send($this->request('GET', '/api/discussions/1', ['authenticatedAs' => 3]));

        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->__toString());

        $attributes = json_decode($response->getBody()->__toString(), true)['data']['attributes'];

        $this->assertTrue($attributes['hasUpvoted'], 'hasUpvoted should be true for the actor who upvoted');
        $this->assertFalse($attributes['hasDownvoted'], 'hasDownvoted should be false for the actor who upvoted');
    }

    protected function discussionAttributes($response, int $id): array
    {
        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->__toString());

        $data = json_decode($response->getBody()->__toString(), true)['data'];

        foreach ($data as $discussion) {
            if ((int) $discussion['id'] === $id) {
                return $discussion['attributes'];
            }
        }

        $this->fail("Discussion {$id} not found in response");
    }
}
