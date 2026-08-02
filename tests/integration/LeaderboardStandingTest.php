<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Tests\integration;

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Leaderboard\Metric\VotesReceived;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\LeaderboardEligibility;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Where the viewer stands.
 *
 * The most interesting fact on a leaderboard, for the person reading it, is
 * their own position — and it is the one thing a page of the top twenty cannot
 * tell someone who is 87th. It has to be looked up rather than counted from
 * the rows on screen.
 */
class LeaderboardStandingTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        // Frozen mid-week and mid-month. These fixtures place rows relative to
        // "now", and the periods they are checked against are calendar-based,
        // so on a Monday a row two days old falls into the previous week and
        // the expectations change under you.
        Carbon::setTestNow(Carbon::parse('2026-08-12 12:00:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    /**
     * Five users with distinct scores: 3 => 5, 4 => 4, 5 => 3, 6 => 2, 7 => 1.
     */
    private function boot(): void
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();

        $users = [$this->normalUser()];
        $posts = [];
        $votes = [];
        $voteId = 1;

        // A pool of voters: post_votes is unique on (post_id, user_id), so a
        // score of five means five different people, not one person five
        // times.
        $voters = range(20, 30);

        foreach ($voters as $voterId) {
            $users[] = ['id' => $voterId, 'username' => "voter$voterId", 'email' => "voter$voterId@machine.local", 'is_email_confirmed' => 1];
        }

        foreach ([3 => 5, 4 => 4, 5 => 3, 6 => 2, 7 => 1] as $userId => $score) {
            $users[] = ['id' => $userId, 'username' => "user$userId", 'email' => "user$userId@machine.local", 'is_email_confirmed' => 1];
            $posts[] = ['id' => $userId, 'discussion_id' => 1, 'number' => $userId, 'created_at' => $now->toDateTimeString(), 'user_id' => $userId, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];

            for ($i = 0; $i < $score; $i++) {
                $votes[] = ['id' => $voteId++, 'post_id' => $userId, 'user_id' => $voters[$i], 'value' => 1, 'created_at' => $now->toDateTimeString()];
            }
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 3, 'comment_count' => 5, 'is_private' => 0],
            ],
            Post::class  => $posts,
            'post_votes' => $votes,
        ]);
    }

    /**
     * @return array{position: int, score: int}|null
     */
    private function standing(int $userId): ?array
    {
        $this->app();

        $registry = $this->app()->getContainer()->make(MetricRegistry::class);
        $metric = $this->app()->getContainer()->make(VotesReceived::class);

        return $registry->standingFor($metric, null, $userId);
    }

    #[Test]
    public function the_leader_is_first()
    {
        $this->boot();

        $this->assertSame(['position' => 1, 'score' => 5, 'toNext' => null], $this->standing(3));
    }

    #[Test]
    public function someone_in_the_middle_gets_their_own_position()
    {
        $this->boot();

        $this->assertSame(['position' => 3, 'score' => 3, 'toNext' => 1], $this->standing(5));
    }

    #[Test]
    public function the_last_place_is_counted_from_the_top()
    {
        $this->boot();

        $this->assertSame(['position' => 5, 'score' => 1, 'toNext' => 1], $this->standing(7));
    }

    /**
     * Someone who has never scored is not on the board at all, which is a
     * different answer from being last.
     */
    /**
     * The gap to the place above turns an unreachable board into a next step:
     * "two more posts" is actionable where "you are 5th" is not.
     */
    #[Test]
    public function the_standing_says_how_far_it_is_to_the_next_place()
    {
        $this->boot();

        // user 5 has 3, the person above has 4.
        $this->assertSame(1, $this->standing(5)['toNext'] ?? null);
    }

    #[Test]
    public function the_leader_has_nobody_to_catch()
    {
        $this->boot();

        $standing = $this->standing(3);

        $this->assertArrayHasKey('toNext', $standing);
        $this->assertNull($standing['toNext'], 'nobody is above the leader to catch');
    }

    #[Test]
    public function a_user_with_no_score_has_no_standing()
    {
        $this->boot();

        $this->assertNull($this->standing(2));
    }

    #[Test]
    public function a_guest_has_no_standing()
    {
        $this->boot();

        $this->assertNull($this->standing(0));
    }

    /**
     * Excluding somebody removes them from the board, so they have no standing
     * on it — and everybody below them moves up.
     */
    #[Test]
    public function an_excluded_user_has_no_standing_and_others_move_up()
    {
        $this->setting(LeaderboardEligibility::EXCLUDED_USERS, json_encode([3]));

        $this->boot();

        $this->assertNull($this->standing(3), 'the excluded user is not ranked');
        $this->assertSame(['position' => 1, 'score' => 4, 'toNext' => null], $this->standing(4), 'the next user is now first');
    }
}
