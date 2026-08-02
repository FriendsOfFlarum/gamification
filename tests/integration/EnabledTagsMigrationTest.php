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

use FoF\Gamification\EnabledTags;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * The upgrade must not change where voting works.
 *
 * Voting is currently expressed through permissions, and forums express it in
 * two quite different shapes. Both are real, and the seed is written against
 * both:
 *
 *  - **Global grant.** `discussion.votePosts` is granted forum-wide, so voting
 *    is available on every tag. Restricted tags then subtract it, and re-grant
 *    it through `tag<id>.discussion.votePosts` where members should keep it.
 *    Those per-tag rows are part of a general access-control setup for the
 *    restricted tag — they sit alongside `reply`, `likePosts`, `viewForum` and
 *    the rest — so they say nothing about where gamification is *wanted*.
 *    Reading them as intent would wrongly narrow the forum to those tags.
 *
 *  - **No global grant.** Voting exists only where a tag explicitly grants it.
 *    Here the per-tag rows *are* the intent, and are the only signal available.
 *
 * So the global grant decides which reading applies. Anything else silently
 * turns voting off somewhere it currently works.
 */
class EnabledTagsMigrationTest extends EnhancedTestCase
{
    /**
     * @param string[] $permissions
     * @param int[]    $tagIds
     *
     * @return string[]
     */
    private function seed(array $permissions, array $tagIds): array
    {
        return EnabledTags::seedFromPermissions($permissions, $tagIds);
    }

    #[Test]
    public function a_forum_with_a_global_grant_enables_every_tag()
    {
        // dev.flarum.one: Member holds discussion.votePosts forum-wide, so
        // voting works on all 33 tags today and must continue to.
        $seeded = $this->seed(
            ['discussion.votePosts', 'discussion.canSeeVotes', 'tag35.discussion.votePosts'],
            [34, 35, 13, 26]
        );

        $this->assertSame(['34', '35', '13', '26'], $seeded);
    }

    #[Test]
    public function per_tag_grants_are_ignored_when_a_global_grant_exists()
    {
        // The restricted tag's own votePosts row is part of re-granting normal
        // abilities inside that tag, not a statement that gamification belongs
        // only there. Narrowing to it would disable voting on every other tag.
        $seeded = $this->seed(
            ['discussion.votePosts', 'tag35.discussion.votePosts'],
            [34, 35]
        );

        $this->assertContains('34', $seeded, 'the unrestricted tag keeps voting');
    }

    #[Test]
    public function a_forum_without_a_global_grant_enables_only_the_granted_tags()
    {
        // discuss.flarum.org: no global grant at all, and exactly one tag
        // carries the vote permissions. Voting is confined there today.
        $seeded = $this->seed(
            ['tag97.discussion.votePosts', 'tag97.discussion.canSeeVotes', 'tag97.discussion.canSeeVoters'],
            [97, 12, 45]
        );

        $this->assertSame(['97'], $seeded);
    }

    #[Test]
    public function the_see_votes_permission_alone_enables_a_tag()
    {
        // A tag that only exposes the tally still shows gamification, so it
        // must stay enabled or the counts vanish on upgrade.
        $seeded = $this->seed(['tag5.discussion.canSeeVotes'], [5, 6]);

        $this->assertSame(['5'], $seeded);
    }

    #[Test]
    public function unrelated_tag_permissions_do_not_enable_a_tag()
    {
        // A restricted tag re-grants many abilities; only the vote ones count.
        $seeded = $this->seed(
            ['tag26.discussion.reply', 'tag26.discussion.likePosts', 'tag26.viewForum'],
            [26, 27]
        );

        $this->assertSame([], $seeded);
    }

    #[Test]
    public function a_forum_with_no_vote_permissions_at_all_enables_nothing()
    {
        $this->assertSame([], $this->seed(['discussion.reply'], [1, 2]));
    }

    #[Test]
    public function a_grant_for_a_deleted_tag_is_dropped()
    {
        // Permission rows outlive the tags they name; seeding a stale id would
        // put an unresolvable tag in the setting.
        $seeded = $this->seed(['tag999.discussion.votePosts'], [1, 2]);

        $this->assertSame([], $seeded);
    }

    #[Test]
    public function the_two_real_forum_configurations_are_preserved_exactly()
    {
        // Taken verbatim from the two forums this was designed against, so the
        // shapes here are real rather than imagined.

        // dev: Member holds discussion.votePosts forum-wide; tag 35 is a
        // restricted tag whose members have been re-granted the normal set of
        // abilities, voting among them.
        $devPermissions = [
            'discussion.canSeeVotes', 'discussion.votePosts', 'tag26.discussion.polls.vote',
            'tag35.discussion.canSeeReactions', 'tag35.discussion.canSeeVoters', 'tag35.discussion.canSeeVotes',
            'tag35.discussion.flagPosts', 'tag35.discussion.likePosts', 'tag35.discussion.reactPosts',
            'tag35.discussion.reply', 'tag35.discussion.votePosts', 'tag35.startDiscussion', 'tag35.viewForum',
        ];
        $devTags = [1, 6, 13, 26, 34, 35];

        $this->assertSame(
            ['1', '6', '13', '26', '34', '35'],
            $this->seed($devPermissions, $devTags),
            'voting is forum-wide there today and must stay so'
        );

        // discuss: no global grant; exactly one tag carries the vote
        // permissions, and voting is confined to it.
        $this->assertSame(
            ['97'],
            $this->seed(
                ['tag97.discussion.canSeeVoters', 'tag97.discussion.canSeeVotes', 'tag97.discussion.votePosts'],
                [12, 45, 97]
            ),
            'voting is confined to one tag there today and must stay so'
        );
    }

    #[Test]
    public function the_seed_is_json_encodable_as_strings()
    {
        // The setting is consumed by the tag selector, which round-trips a JSON
        // array of string ids.
        $seeded = $this->seed(['discussion.votePosts'], [7, 8]);

        $this->assertSame('["7","8"]', json_encode($seeded));
    }
}
