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
use Flarum\Group\Group;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Guards the endpoints this extension extends against per-record queries.
 *
 * The rest of the suite works with a single discussion, where an N+1 is
 * indistinguishable from a single query. These requests run against enough
 * records that a per-record pattern is visible, and flarum/testing's
 * repeated-query detector fails the test if one appears.
 *
 * All three of these were real: the discussion list resolved each
 * discussion's first post (and re-fetched the discussion itself through the
 * post policy) one row at a time, and the posts endpoint did the same for
 * every discussion it serialized alongside its posts.
 */
class VoteQueryCountTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const DISCUSSIONS = 10;
    private const VOTERS = 5;

    public function setUp(): void
    {
        parent::setUp();
        $this->extension(...(getenv('NOGAM') ? [] : ['fof-gamification']));

        $now = Carbon::now()->toDateTimeString();
        $users = [$this->normalUser()];
        for ($u = 3; $u < 3 + self::VOTERS; $u++) {
            $users[] = ['id' => $u, 'username' => "voter$u", 'email' => "voter$u@machine.local", 'is_email_confirmed' => 1];
        }

        $discussions = $posts = $votes = [];
        $voteId = 1;
        for ($d = 1; $d <= self::DISCUSSIONS; $d++) {
            $fp = $d * 10;
            $discussions[] = ['id' => $d, 'title' => "D$d", 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 2, 'first_post_id' => $fp, 'comment_count' => 2, 'is_private' => 0, 'votes' => self::VOTERS];
            $posts[] = ['id' => $fp, 'discussion_id' => $d, 'number' => 1, 'created_at' => $now, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>first</p></t>'];
            $posts[] = ['id' => $fp + 1, 'discussion_id' => $d, 'number' => 2, 'created_at' => $now, 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>reply</p></t>'];
            for ($u = 3; $u < 3 + self::VOTERS; $u++) {
                $votes[] = ['id' => $voteId++, 'post_id' => $fp, 'user_id' => $u, 'value' => 1];
            }
        }

        $this->prepareDatabase([
            User::class        => $users,
            Group::class       => [['id' => 101, 'name_singular' => 'V', 'name_plural' => 'V']],
            'group_user'       => [['user_id' => 3, 'group_id' => 101]],
            'group_permission' => [
                ['group_id' => 101, 'permission' => 'discussion.canSeeVotes'],
                ['group_id' => 101, 'permission' => 'discussion.canSeeVoters'],
                ['group_id' => 101, 'permission' => 'discussion.votePosts'],
            ],
            Discussion::class => $discussions,
            Post::class       => $posts,
            'post_votes'      => $votes,
        ]);
    }

    private function get(string $uri, ?int $actor = null): int
    {
        $options = $actor !== null ? ['authenticatedAs' => $actor] : [];

        return $this->send($this->request('GET', $uri, $options))->getStatusCode();
    }

    #[Test]
    public function probe_index_member()
    {
        $this->assertSame(200, $this->get('/api/discussions', 3));
    }

    #[Test]
    public function probe_index_guest()
    {
        $this->assertSame(200, $this->get('/api/discussions'));
    }

    #[Test]
    public function probe_posts_member()
    {
        $this->assertSame(200, $this->get('/api/posts?filter[discussion]=1', 3));
    }

    #[Test]
    public function probe_users_member()
    {
        $this->assertSame(200, $this->get('/api/users', 3));
    }

    #[Test]
    public function probe_posts_guest()
    {
        $this->assertSame(200, $this->get('/api/posts?filter[discussion]=1'));
    }
}
