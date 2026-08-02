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
use FoF\Gamification\Leaderboard\Period;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * What a period actually covers.
 *
 * Calendar periods, not rolling windows: "this month" means the month we are
 * in, the way a reader assumes when they see the words, rather than the last
 * thirty days. It also makes movement meaningful — this month against last
 * month is a fixed comparison, where two sliding windows shift under you on
 * every page load.
 */
class LeaderboardPeriodTest extends EnhancedTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // A date far enough into every period that boundaries are unambiguous.
        Carbon::setTestNow(Carbon::parse('2026-08-02 14:30:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    #[Test]
    public function this_year_starts_in_january()
    {
        $this->assertSame('2026-01-01 00:00:00', Period::Year->since()?->toDateTimeString());
    }

    #[Test]
    public function this_month_starts_on_the_first()
    {
        $this->assertSame('2026-08-01 00:00:00', Period::Month->since()?->toDateTimeString());
    }

    #[Test]
    public function today_starts_at_midnight()
    {
        $this->assertSame('2026-08-02 00:00:00', Period::Day->since()?->toDateTimeString());
    }

    #[Test]
    public function all_time_has_no_start()
    {
        $this->assertNull(Period::AllTime->since());
    }

    /**
     * The window before is the whole of the previous calendar period, not a
     * span of equal length ending where this one began.
     */
    #[Test]
    public function the_previous_year_is_the_whole_of_last_year()
    {
        [$start, $end] = Period::Year->previousWindow();

        $this->assertSame('2025-01-01 00:00:00', $start->toDateTimeString());
        $this->assertSame('2026-01-01 00:00:00', $end->toDateTimeString());
    }

    #[Test]
    public function the_previous_month_is_the_whole_of_last_month()
    {
        [$start, $end] = Period::Month->previousWindow();

        $this->assertSame('2026-07-01 00:00:00', $start->toDateTimeString());
        $this->assertSame('2026-08-01 00:00:00', $end->toDateTimeString());
    }

    #[Test]
    public function the_previous_day_is_yesterday()
    {
        [$start, $end] = Period::Day->previousWindow();

        $this->assertSame('2026-08-01 00:00:00', $start->toDateTimeString());
        $this->assertSame('2026-08-02 00:00:00', $end->toDateTimeString());
    }

    #[Test]
    public function all_time_has_no_previous_window()
    {
        $this->assertNull(Period::AllTime->previousWindow());
    }
}
