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
use FoF\Gamification\Leaderboard\Metric\DiscussionsStarted;
use FoF\Gamification\Leaderboard\Metric\PostsWritten;
use FoF\Gamification\Leaderboard\Metric\UpvotesReceived;
use FoF\Gamification\Leaderboard\MetricInterface;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\Leaderboard\Period;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * What each metric counts, and — just as importantly — what it does not.
 *
 * Every metric here has to agree on the same exclusions: content nobody can
 * see should not earn anybody a place on a public board. They are asserted per
 * metric rather than once, because each builds its own query and there is
 * nothing forcing them to agree.
 */
class LeaderboardMetricsTest extends EnhancedTestCase
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

    private function boot(): void
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        // A previous calendar year, so it is outside every shorter period.
        $old = $now->copy()->startOfYear()->subMonths(2);

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'alice', 'email' => 'alice@machine.local', 'is_email_confirmed' => 1],
                ['id' => 4, 'username' => 'bob', 'email' => 'bob@machine.local', 'is_email_confirmed' => 1],
            ],
            Discussion::class => [
                // alice: 2 visible discussions, one of them a year old.
                ['id' => 1, 'title' => 'A1', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => 1, 'is_private' => 0],
                ['id' => 2, 'title' => 'A2', 'created_at' => $old->toDateTimeString(), 'last_posted_at' => $old->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 3, 'comment_count' => 1, 'is_private' => 0],
                // bob: 1 visible, 1 hidden, 1 private — only the first counts.
                ['id' => 3, 'title' => 'B1', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 4, 'first_post_id' => 4, 'comment_count' => 1, 'is_private' => 0],
                ['id' => 4, 'title' => 'B-hidden', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 4, 'first_post_id' => 5, 'comment_count' => 1, 'is_private' => 0, 'hidden_at' => $now->toDateTimeString()],
                ['id' => 5, 'title' => 'B-private', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 4, 'first_post_id' => 6, 'comment_count' => 1, 'is_private' => 1],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>a</p></t>'],
                ['id' => 2, 'discussion_id' => 1, 'number' => 2, 'created_at' => $now->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>a</p></t>'],
                ['id' => 3, 'discussion_id' => 2, 'number' => 1, 'created_at' => $old->toDateTimeString(), 'user_id' => 3, 'type' => 'comment', 'content' => '<t><p>a</p></t>'],
                ['id' => 4, 'discussion_id' => 3, 'number' => 1, 'created_at' => $now->toDateTimeString(), 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>b</p></t>'],
                // Hidden, private, and a non-comment event post: none count.
                ['id' => 5, 'discussion_id' => 4, 'number' => 1, 'created_at' => $now->toDateTimeString(), 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>b</p></t>', 'hidden_at' => $now->toDateTimeString()],
                ['id' => 6, 'discussion_id' => 5, 'number' => 1, 'created_at' => $now->toDateTimeString(), 'user_id' => 4, 'type' => 'comment', 'content' => '<t><p>b</p></t>', 'is_private' => 1],
                ['id' => 7, 'discussion_id' => 3, 'number' => 2, 'created_at' => $now->toDateTimeString(), 'user_id' => 4, 'type' => 'discussionRenamed', 'content' => '<t></t>'],
            ],
            'post_votes' => [
                // alice: +1 and -1 on her posts → net 0, but 1 upvote.
                ['id' => 1, 'post_id' => 1, 'user_id' => 4, 'value' => 1, 'created_at' => $now->toDateTimeString()],
                ['id' => 2, 'post_id' => 2, 'user_id' => 4, 'value' => -1, 'created_at' => $now->toDateTimeString()],
                // bob: 2 upvotes, one of them a year old.
                ['id' => 3, 'post_id' => 4, 'user_id' => 3, 'value' => 1, 'created_at' => $now->toDateTimeString()],
                ['id' => 4, 'post_id' => 4, 'user_id' => 2, 'value' => 1, 'created_at' => $old->toDateTimeString()],
                // A vote on a hidden post must not count for anyone.
                ['id' => 5, 'post_id' => 5, 'user_id' => 3, 'value' => 1, 'created_at' => $now->toDateTimeString()],
            ],
        ]);
    }

    /**
     * @return array<int, int> user id => score
     */
    private function scores(string $metricClass, ?\DateTimeInterface $since = null): array
    {
        $this->app();

        /** @var MetricRegistry $registry */
        $registry = $this->app()->getContainer()->make(MetricRegistry::class);
        /** @var MetricInterface $metric */
        $metric = $this->app()->getContainer()->make($metricClass);

        $scores = [];

        foreach ($registry->rankingQuery($metric, $since)->get() as $row) {
            $scores[(int) $row->user_id] = (int) $row->score;
        }

        return $scores;
    }

    #[Test]
    public function upvotes_received_ignores_downvotes()
    {
        $this->boot();

        // Net votes would give alice 0; counting upvotes alone gives her 1.
        // Bob has 2 (the hidden post's upvote is not one of them).
        $this->assertSame([4 => 2, 3 => 1], $this->scores(UpvotesReceived::class));
    }

    #[Test]
    public function upvotes_received_respects_a_period()
    {
        $this->boot();

        // Bob's year-old upvote drops out, leaving both on 1.
        $this->assertSame([3 => 1, 4 => 1], $this->scores(UpvotesReceived::class, Period::Week->since()));
    }

    #[Test]
    public function posts_written_counts_only_visible_comments()
    {
        $this->boot();

        // alice 3 comments; bob 1 (hidden, private and the event post excluded).
        $this->assertSame([3 => 3, 4 => 1], $this->scores(PostsWritten::class));
    }

    #[Test]
    public function posts_written_respects_a_period()
    {
        $this->boot();

        // alice's year-old post drops out.
        $this->assertSame([3 => 2, 4 => 1], $this->scores(PostsWritten::class, Period::Week->since()));
    }

    #[Test]
    public function discussions_started_counts_only_visible_discussions()
    {
        $this->boot();

        // alice 2; bob 1 (hidden and private excluded).
        $this->assertSame([3 => 2, 4 => 1], $this->scores(DiscussionsStarted::class));
    }

    #[Test]
    public function discussions_started_respects_a_period()
    {
        $this->boot();

        // alice's year-old discussion drops out.
        $this->assertSame([3 => 1, 4 => 1], $this->scores(DiscussionsStarted::class, Period::Week->since()));
    }
}
