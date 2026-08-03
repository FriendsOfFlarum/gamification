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
use FoF\Gamification\LeaderboardEligibility;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Recognition for people the podium will never reach.
 *
 * A board ranked by a lifetime total is decided years in advance, and tells
 * everybody outside the top three that turning up changes nothing. These are
 * the awards that stay winnable: who climbed furthest, who had their best
 * week, who arrived and made an impression.
 */
class LeaderboardHighlightsTest extends EnhancedTestCase
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
     * Highlights start below the podium, so the fixture needs a real field
     * under it rather than three or four people in total.
     *
     * Podium (this week): 10, 11, 12.
     * Below it: dave is the busiest, bob the biggest climber, carol the
     * newcomer, and alice drops away.
     */
    private function boot(): void
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        // Anchored to the calendar, because that is what the periods mean:
        // a day inside this week, and a day inside the week before it.
        $thisWeek = $now->copy()->startOfWeek()->addDay();
        $lastWeek = $now->copy()->startOfWeek()->subWeek()->addDay();

        $users = [$this->normalUser()];
        $posts = [];
        $id = 1;

        $plan = [
            // The podium: present in both windows, well clear of the rest.
            [10, $lastWeek, 60], [10, $thisWeek, 60],
            [11, $lastWeek, 50], [11, $thisWeek, 50],
            [12, $lastWeek, 40], [12, $thisWeek, 40],
            // dave: top of the field below the podium — the busiest.
            [6, $lastWeek, 15], [6, $thisWeek, 20],
            // bob: last of the returning field before, well up now — climber.
            [4, $lastWeek, 1],  [4, $thisWeek, 12],
            // alice: was ahead of bob, quiet now — drops.
            [3, $lastWeek, 20], [3, $thisWeek, 6],
            // carol: absent last week — the newcomer.
            [5, $thisWeek, 5],
        ];

        foreach ([3, 4, 5, 6, 10, 11, 12] as $uid) {
            $users[] = ['id' => $uid, 'username' => "u$uid", 'email' => "u$uid@machine.local", 'is_email_confirmed' => 1];
        }

        foreach ($plan as [$uid, $when, $count]) {
            for ($i = 0; $i < $count; $i++) {
                $posts[] = [
                    'id'            => $id++,
                    'discussion_id' => 1,
                    'number'        => $id,
                    'created_at'    => $when->toDateTimeString(),
                    'user_id'       => $uid,
                    'type'          => 'comment',
                    'content'       => '<t><p>x</p></t>',
                ];
            }
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function highlights(Period $period = Period::Week): array
    {
        $this->app();

        $registry = $this->app()->getContainer()->make(MetricRegistry::class);
        $metric = $this->app()->getContainer()->make(PostsWritten::class);

        return $registry->highlightsFor($metric, $period);
    }

    #[Test]
    public function the_biggest_climber_is_the_one_who_gained_most_places()
    {
        $this->boot();

        $climber = $this->highlights()['climber'] ?? null;

        // Dave gained the most places. He is no longer claimed by a "busiest"
        // award, so the climb is his on merit rather than by elimination.
        $this->assertSame(6, $climber['userId'] ?? null);
        $this->assertGreaterThan(0, $climber['places'] ?? 0);
    }

    /**
     * Turning up regularly is the one thing a total cannot show.
     *
     * Somebody who posts a little most days is doing something a leaderboard
     * ranked on volume never notices, and it is a far more reachable thing to
     * be than the busiest person on the forum.
     */
    #[Test]
    public function the_most_consistent_is_whoever_was_active_on_the_most_days()
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $weekStart = $now->copy()->startOfWeek();

        $users = [$this->normalUser()];
        $posts = [];
        $id = 1;

        // Steady: one post on each of five days.
        foreach (range(0, 4) as $day) {
            $posts[] = ['id' => $id++, 'discussion_id' => 1, 'number' => $id, 'created_at' => $weekStart->copy()->addDays($day)->addHours(9)->toDateTimeString(), 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
        }

        // Bursty: far more posts, but all on one day. Tops the board and so
        // must not also take this award.
        for ($i = 0; $i < 30; $i++) {
            $posts[] = ['id' => $id++, 'discussion_id' => 1, 'number' => $id, 'created_at' => $weekStart->copy()->addHours(10)->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
        }

        foreach ([3, 4] as $uid) {
            $users[] = ['id' => $uid, 'username' => "u$uid", 'email' => "u$uid@machine.local", 'is_email_confirmed' => 1];
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);

        $consistent = $this->highlights()['consistent'] ?? null;

        $this->assertSame(4, $consistent['userId'] ?? null, 'five days beats one big day');
        $this->assertSame(5, $consistent['days'] ?? null);
    }

    /**
     * Consistency counts separate days, so a window that is itself one day
     * gives everybody a score of one and the award means nothing.
     */
    #[Test]
    public function consistency_is_not_offered_when_the_window_is_a_single_day()
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $today = $now->copy()->startOfDay()->addHours(9);
        $yesterday = $now->copy()->startOfDay()->subDay()->addHours(9);

        $users = [$this->normalUser()];
        $posts = [];
        $id = 1;

        // Two people active today, and both active yesterday too, so the
        // previous window exists and the other awards can still resolve.
        foreach ([[3, 6], [4, 3]] as [$uid, $count]) {
            $users[] = ['id' => $uid, 'username' => "u$uid", 'email' => "u$uid@machine.local", 'is_email_confirmed' => 1];

            foreach ([$today, $yesterday] as $when) {
                for ($i = 0; $i < $count; $i++) {
                    $posts[] = ['id' => $id++, 'discussion_id' => 1, 'number' => $id, 'created_at' => $when->toDateTimeString(), 'user_id' => $uid, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
                }
            }
        }

        $this->prepareDatabase([
            User::class => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);

        // Everybody has exactly one distinct day, so nobody is more
        // consistent than anybody else.
        $this->assertArrayNotHasKey('consistent', $this->highlights(Period::Day));
    }

    #[Test]
    public function the_newcomer_is_somebody_who_was_not_here_before()
    {
        $this->boot();

        $newcomer = $this->highlights()['newcomer'] ?? null;

        $this->assertSame(5, $newcomer['userId'] ?? null, 'carol only started this week');
    }

    #[Test]
    public function one_person_never_holds_two_awards()
    {
        $this->boot();

        $winners = array_column($this->highlights(), 'userId');

        $this->assertSame($winners, array_unique($winners), 'each award goes to a different person');
    }

    /**
     * Somebody topping the board is not a new face, whatever the previous
     * window says about them — a forum whose history predates the window will
     * otherwise crown its most established member as the newcomer.
     */
    #[Test]
    public function the_leader_is_never_the_newcomer()
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $posts = [];

        // One person, no history before this window: first on the board, and
        // absent from the window before it.
        for ($i = 0; $i < 5; $i++) {
            $posts[] = ['id' => $i + 1, 'discussion_id' => 1, 'number' => $i + 2, 'created_at' => $now->copy()->startOfWeek()->addDay()->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
        }

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'u3', 'email' => 'u3@machine.local', 'is_email_confirmed' => 1],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => 5, 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);

        $this->assertArrayNotHasKey('newcomer', $this->highlights());
    }

    /**
     * A previous window with almost nobody in it makes everybody look new.
     * That happens for real — a forum with a gap in its history, or one whose
     * first period is being viewed — and crowning the runner-up as a new face
     * is worse than saying nothing.
     */
    #[Test]
    public function nobody_is_a_new_face_when_the_previous_window_was_empty()
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $posts = [];
        $id = 1;

        // Four people this week, none before it.
        foreach ([[3, 10], [4, 8], [5, 6], [6, 4]] as [$uid, $count]) {
            for ($i = 0; $i < $count; $i++) {
                $posts[] = ['id' => $id++, 'discussion_id' => 1, 'number' => $id, 'created_at' => $now->copy()->startOfWeek()->addDay()->toDateTimeString(), 'user_id' => $uid, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
            }
        }

        $users = [$this->normalUser()];

        foreach ([3, 4, 5, 6] as $uid) {
            $users[] = ['id' => $uid, 'username' => "u$uid", 'email' => "u$uid@machine.local", 'is_email_confirmed' => 1];
        }

        $this->prepareDatabase([
            User::class       => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);

        $this->assertArrayNotHasKey('newcomer', $this->highlights(), 'everybody being new means nobody is');
    }

    /**
     * All-time has no window before it, so none of these questions have an
     * answer — better to say nothing than to invent one.
     */
    #[Test]
    public function all_time_has_no_highlights()
    {
        $this->boot();

        $this->assertSame([], $this->highlights(Period::AllTime));
    }

    /**
     * Highlights are still a ranking, so somebody the admin has excluded must
     * not be celebrated by the back door.
     */
    #[Test]
    public function excluded_users_are_never_highlighted()
    {
        $this->setting(LeaderboardEligibility::EXCLUDED_USERS, json_encode([4]));

        $this->boot();

        $highlights = $this->highlights();

        $this->assertNotSame(4, $highlights['climber']['userId'] ?? null);
        $this->assertNotSame(4, $highlights['busiest']['userId'] ?? null);
    }
}
