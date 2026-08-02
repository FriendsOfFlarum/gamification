<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Leaderboard;

use Carbon\Carbon;
use Flarum\Settings\SettingsRepositoryInterface;

/**
 * How far back a leaderboard looks.
 *
 * A board that only ever counts all-time is decided years in advance: whoever
 * posted most in the forum's first year stays on the podium, and a member who
 * joined last month can see they will never catch up. Shorter periods give
 * everybody a race they can actually win.
 */
enum Period: string
{
    /**
     * Which window the leaderboard opens on.
     */
    public const DEFAULT_PERIOD = 'fof-gamification.defaultPeriod';

    case Day = 'day';
    case Week = 'week';
    case Month = 'month';
    case Year = 'year';
    case AllTime = 'all';

    /**
     * The start of the period, or null for all time.
     */
    public function since(): ?Carbon
    {
        // Calendar periods, not rolling windows: "this month" means the month
        // we are in, which is what the words say and what a reader assumes.
        // A rolling thirty days also makes movement meaningless, because both
        // windows slide on every page load.
        return match ($this) {
            self::Day     => Carbon::now()->startOfDay(),
            self::Week    => Carbon::now()->startOfWeek(),
            self::Month   => Carbon::now()->startOfMonth(),
            self::Year    => Carbon::now()->startOfYear(),
            self::AllTime => null,
        };
    }

    /**
     * The window immediately before this one, as [start, end].
     *
     * Used to work out which way somebody is moving: the same ranking is
     * computed over the previous window and the positions compared. All-time
     * has no "before" — it already contains everything — so it has none.
     *
     * @return array{0: Carbon, 1: Carbon}|null
     */
    public function previousWindow(): ?array
    {
        $start = $this->since();

        if ($start === null) {
            return null;
        }

        // The whole of the preceding calendar period, so this month is
        // compared against all of last month rather than against an equally
        // long span ending where this one began. That comparison is stable:
        // it does not change as the current period runs on.
        $previous = match ($this) {
            self::Day     => $start->copy()->subDay(),
            self::Week    => $start->copy()->subWeek(),
            self::Month   => $start->copy()->subMonth(),
            self::Year    => $start->copy()->subYear(),
            self::AllTime => null,
        };

        return $previous === null ? null : [$previous, $start];
    }

    /**
     * Resolve a period from the request.
     *
     * Anything unrecognised falls back rather than erroring: the value comes
     * from a query string, and a stale link is not worth an error page.
     */
    public static function fromRequest(?string $value, ?self $fallback = null): self
    {
        return self::tryFrom((string) $value) ?? $fallback ?? self::AllTime;
    }

    /**
     * The window to show when the request did not name one.
     *
     * A year rather than all-time where the admin has not chosen. All-time is
     * a hall of fame, decided long ago and unaffected by anything anybody
     * does now; a calendar year is still open, while being long enough that a
     * quiet week does not leave the board looking empty.
     */
    public static function configured(SettingsRepositoryInterface $settings): self
    {
        return self::tryFrom((string) $settings->get(self::DEFAULT_PERIOD)) ?? self::Year;
    }

    /**
     * @return string[]
     */
    public static function keys(): array
    {
        return array_map(fn (self $period) => $period->value, self::cases());
    }
}
