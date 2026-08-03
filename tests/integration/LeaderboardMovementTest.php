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
use FoF\Gamification\Leaderboard\Metric\PostsWritten;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\Leaderboard\Period;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Which way somebody is moving.
 *
 * A board with a runaway leader tells everybody else they cannot win. Movement
 * is the part that stays winnable: climbing three places is an achievement
 * whoever is top, so it is the number most likely to bring somebody back.
 */
class LeaderboardMovementTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        // Mid-week, mid-month, mid-year: far enough inside every calendar
        // period that "earlier this period" and "the period before" are
        // unambiguous whenever the suite happens to run.
        Carbon::setTestNow(Carbon::parse('2026-08-12 12:00:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    /**
     * Two windows of posting, so the ranking differs between them.
     *
     * Last week: alice 3, bob 1        → alice 1st, bob 2nd
     * This week: bob 4, alice 1        → bob 1st, alice 2nd
     *
     * So bob has climbed one place and alice has dropped one.
     */
    private function boot(bool $newcomer = false): void
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        // Anchored to the calendar, because that is what the periods mean:
        // a day inside this week, and a day inside the week before it.
        $thisWeek = $now->copy()->startOfWeek()->addDay();
        $lastWeek = $now->copy()->startOfWeek()->subWeek()->addDay();

        $posts = [];
        $id = 1;

        $plan = [[3, $lastWeek, 3], [4, $lastWeek, 1], [4, $thisWeek, 4], [3, $thisWeek, 1]];

        if ($newcomer) {
            $plan[] = [5, $thisWeek, 2];
        }

        foreach ($plan as [$userId, $when, $count]) {
            for ($i = 0; $i < $count; $i++) {
                $posts[] = [
                    'id'            => $id++,
                    'discussion_id' => 1,
                    'number'        => $id,
                    'created_at'    => $when->toDateTimeString(),
                    'user_id'       => $userId,
                    'type'          => 'comment',
                    'content'       => '<t><p>x</p></t>',
                ];
            }
        }

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'alice', 'email' => 'alice@machine.local', 'is_email_confirmed' => 1],
                ['id' => 4, 'username' => 'bob', 'email' => 'bob@machine.local', 'is_email_confirmed' => 1],
                ['id' => 5, 'username' => 'carol', 'email' => 'carol@machine.local', 'is_email_confirmed' => 1],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);
    }

    /**
     * @return array<int, int|null> user id => places moved
     */
    private function movement(Period $period): array
    {
        $this->app();

        $registry = $this->app()->getContainer()->make(MetricRegistry::class);
        $metric = $this->app()->getContainer()->make(PostsWritten::class);

        return $registry->movementFor($metric, $period);
    }

    #[Test]
    public function climbing_is_reported_as_a_positive_move()
    {
        $this->boot();

        $this->assertSame(1, $this->movement(Period::Week)[4] ?? null, 'bob went from 2nd to 1st');
    }

    #[Test]
    public function dropping_is_reported_as_a_negative_move()
    {
        $this->boot();

        $this->assertSame(-1, $this->movement(Period::Week)[3] ?? null, 'alice went from 1st to 2nd');
    }

    /**
     * All-time has no previous window to compare against — every post ever
     * made is already in it — so movement is simply not a question it can
     * answer.
     */
    #[Test]
    public function all_time_reports_no_movement()
    {
        $this->boot();

        $this->assertSame([], $this->movement(Period::AllTime));
    }

    /**
     * A place lost is a place lost, however it happened.
     *
     * Somebody who was 1st and is now 7th is six places lower, and that is
     * what they see when they look at the board. Whether the people above
     * them arrived or overtook is not a distinction worth hiding a real
     * change for.
     */
    #[Test]
    public function dropping_down_a_growing_board_is_still_a_drop()
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $thisWeek = $now->copy()->startOfWeek()->addDay();
        $lastWeek = $now->copy()->startOfWeek()->subWeek()->addDay();

        $users = [$this->normalUser()];
        $posts = [];
        $id = 1;

        // The incumbent: alone on the board last week, still posting now.
        $plan = [[3, $lastWeek, 5], [3, $thisWeek, 5]];

        // Six people arrive above them.
        foreach (range(4, 9) as $uid) {
            $plan[] = [$uid, $thisWeek, 20];
        }

        foreach (array_merge([3], range(4, 9)) as $uid) {
            $users[] = ['id' => $uid, 'username' => "u$uid", 'email' => "u$uid@machine.local", 'is_email_confirmed' => 1];
        }

        foreach ($plan as [$uid, $when, $count]) {
            for ($i = 0; $i < $count; $i++) {
                $posts[] = ['id' => $id++, 'discussion_id' => 1, 'number' => $id, 'created_at' => $when->toDateTimeString(), 'user_id' => $uid, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
            }
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);

        // 1st of 1 last week, 7th of 7 now: six places lower.
        $this->assertSame(-6, $this->movement(Period::Week)[3] ?? null);
    }

    /**
     * Arriving is not climbing, but it is worth showing.
     *
     * On a forum whose activity is uneven — most of them — almost nobody on a
     * yearly board held a place the year before, and treating that as "no
     * news" empties the feature exactly when a static board most needs signs
     * of life. So it is reported as its own thing rather than as a number of
     * places gained.
     */
    #[Test]
    public function somebody_new_to_the_board_is_marked_as_an_entry()
    {
        // carol posts only in the current window, so she has no place in the
        // one before it.
        $this->boot(newcomer: true);

        $this->assertSame(MetricRegistry::MOVEMENT_NEW, $this->movement(Period::Week)[5] ?? null);
    }

    /**
     * A new entry is not a climb of zero places, and must not be mistaken for
     * one — they render differently and mean different things.
     */
    #[Test]
    public function a_new_entry_is_distinguishable_from_holding_position()
    {
        $this->boot();

        $this->assertNotSame(0, MetricRegistry::MOVEMENT_NEW);
    }

    #[Test]
    public function somebody_with_no_previous_position_reports_an_entry_rather_than_a_climb()
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'alice', 'email' => 'alice@machine.local', 'is_email_confirmed' => 1],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => 1, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now->copy()->startOfWeek()->addDay()->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>x</p></t>'],
            ],
        ]);

        $this->assertSame(MetricRegistry::MOVEMENT_NEW, $this->movement(Period::Week)[3] ?? null);
    }
}
