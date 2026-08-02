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

use FoF\Gamification\LeaderboardEligibility;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Moving the exclusion list from usernames to ids must not change who is
 * excluded on a forum that upgrades.
 *
 * The migration resolves the names it finds against the users table, so the
 * parsing is the part that has to be right — a name the parser misses is a
 * person who silently starts appearing on the leaderboard again. It is shared
 * with the filter's legacy fallback so the two cannot drift apart.
 */
class ExcludedUsersMigrationTest extends EnhancedTestCase
{
    #[Test]
    public function an_empty_list_yields_no_names()
    {
        $this->assertSame([], LeaderboardEligibility::parseLegacyUsernames(''));
        $this->assertSame([], LeaderboardEligibility::parseLegacyUsernames(null));
        $this->assertSame([], LeaderboardEligibility::parseLegacyUsernames('   '));
    }

    #[Test]
    public function a_comma_space_list_is_split()
    {
        $this->assertSame(
            ['alice', 'carol'],
            LeaderboardEligibility::parseLegacyUsernames('alice, carol')
        );
    }

    /**
     * The separator the old filter could not handle. A forum that typed it this
     * way was excluding nobody, but the intent is plain, so the migration
     * honours it rather than preserving the bug.
     */
    #[Test]
    public function a_list_without_spaces_is_split()
    {
        $this->assertSame(
            ['alice', 'carol'],
            LeaderboardEligibility::parseLegacyUsernames('alice,carol')
        );
    }

    #[Test]
    public function untidy_input_does_not_produce_empty_names()
    {
        $this->assertSame(
            ['alice', 'carol'],
            LeaderboardEligibility::parseLegacyUsernames("  alice ,\tcarol , ")
        );
    }

    #[Test]
    public function a_single_name_is_kept()
    {
        $this->assertSame(['alice'], LeaderboardEligibility::parseLegacyUsernames('alice'));
    }
}
