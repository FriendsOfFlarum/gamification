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
use Flarum\Group\Group;
use Flarum\Post\Post;
use Flarum\Tags\Tag;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\EnabledTags;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Gamification is confined to the tags an admin has enabled.
 *
 * This is a feature-availability gate, deliberately *not* a permission: the
 * point of it is that it applies to everyone. Permissions cannot express this
 * on their own — an unrestricted tag has no per-tag permission dimension at
 * all, and admins bypass permission checks entirely, so an admin saw vote
 * controls on every tag on the forum no matter how it was configured.
 *
 * The two layers stay independent. This decides *where* gamification exists;
 * permissions still decide *who* may use it there.
 */
class TagGatingTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const ENABLED_TAG = 10;
    private const OTHER_TAG = 11;
    private const MEMBER = 3;
    private const ADMIN = 1;

    /**
     * @param string[]|null $enabledTags null leaves the setting unset
     */
    private function boot(?array $enabledTags = ['10']): void
    {
        if ($enabledTags !== null) {
            $this->setting(EnabledTags::SETTING, json_encode($enabledTags));
        }

        $this->extension('flarum-tags', 'fof-gamification');

        $now = Carbon::now()->toDateTimeString();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id 2, the author
                ['id' => 3, 'username' => 'member', 'email' => 'member@machine.local', 'is_email_confirmed' => 1],
            ],
            Group::class => [
                ['id' => 100, 'name_singular' => 'Voter', 'name_plural' => 'Voters'],
            ],
            'group_user' => [
                ['user_id' => 2, 'group_id' => 100],
                ['user_id' => 3, 'group_id' => 100],
            ],
            'group_permission' => [
                ['group_id' => 100, 'permission' => 'discussion.votePosts'],
                ['group_id' => 100, 'permission' => 'discussion.canSeeVotes'],
                ['group_id' => 100, 'permission' => 'discussion.canSeeVoters'],
            ],
            Tag::class => [
                ['id' => self::ENABLED_TAG, 'name' => 'Enabled', 'slug' => 'enabled', 'position' => 0, 'is_restricted' => 0],
                ['id' => self::OTHER_TAG, 'name' => 'Other', 'slug' => 'other', 'position' => 1, 'is_restricted' => 0],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'In the enabled tag', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 1, 'is_private' => 0],
                ['id' => 2, 'title' => 'In another tag', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 2, 'first_post_id' => 2, 'comment_count' => 1, 'is_private' => 0],
                ['id' => 3, 'title' => 'Untagged', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 2, 'first_post_id' => 3, 'comment_count' => 1, 'is_private' => 0],
                ['id' => 4, 'title' => 'Both tags', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => 2, 'first_post_id' => 4, 'comment_count' => 1, 'is_private' => 0],
            ],
            'discussion_tag' => [
                ['discussion_id' => 1, 'tag_id' => self::ENABLED_TAG],
                ['discussion_id' => 2, 'tag_id' => self::OTHER_TAG],
                ['discussion_id' => 4, 'tag_id' => self::ENABLED_TAG],
                ['discussion_id' => 4, 'tag_id' => self::OTHER_TAG],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>a</p></t>'],
                ['id' => 2, 'discussion_id' => 2, 'number' => 1, 'created_at' => $now, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>b</p></t>'],
                ['id' => 3, 'discussion_id' => 3, 'number' => 1, 'created_at' => $now, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>c</p></t>'],
                ['id' => 4, 'discussion_id' => 4, 'number' => 1, 'created_at' => $now, 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>d</p></t>'],
            ],
        ]);
    }

    /** @return array<string, mixed> */
    private function postAttributes(int $postId, int $actor): array
    {
        $response = $this->send($this->request('GET', "/api/posts/$postId", ['authenticatedAs' => $actor]));
        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody()->getContents(), true)['data']['attributes'];
    }

    /** @return array<string, mixed> */
    private function discussionAttributes(int $discussionId, int $actor): array
    {
        $response = $this->send($this->request('GET', "/api/discussions/$discussionId", ['authenticatedAs' => $actor]));
        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody()->getContents(), true)['data']['attributes'];
    }

    private function vote(int $postId, int $actor): int
    {
        return $this->send(
            $this->request('PATCH', "/api/posts/$postId", [
                'authenticatedAs' => $actor,
                'json'            => ['data' => ['attributes' => ['vote' => 'up']]],
            ])
        )->getStatusCode();
    }

    #[Test]
    public function a_member_can_vote_in_an_enabled_tag()
    {
        $this->boot();

        $this->assertTrue($this->postAttributes(1, self::MEMBER)['canVote']);
        $this->assertSame(200, $this->vote(1, self::MEMBER));
    }

    #[Test]
    public function a_member_cannot_vote_outside_the_enabled_tags()
    {
        $this->boot();

        $this->assertFalse($this->postAttributes(2, self::MEMBER)['canVote']);
        $this->assertSame(403, $this->vote(2, self::MEMBER));
    }

    #[Test]
    public function an_admin_is_gated_by_the_enabled_tags_too()
    {
        // The whole point: admins bypass permission checks, so before this an
        // admin saw vote controls on every tag regardless of configuration.
        // This gate is not a permission, so it applies to them as well.
        $this->boot();

        $this->assertTrue($this->postAttributes(1, self::ADMIN)['canVote'], 'still available where enabled');
        $this->assertFalse($this->postAttributes(2, self::ADMIN)['canVote'], 'and gone where it is not');
        $this->assertSame(403, $this->vote(2, self::ADMIN));
    }

    #[Test]
    public function the_vote_count_is_hidden_outside_the_enabled_tags()
    {
        $this->boot();

        $this->assertTrue($this->postAttributes(1, self::MEMBER)['canSeeVotes']);
        $this->assertFalse($this->postAttributes(2, self::MEMBER)['canSeeVotes']);
    }

    #[Test]
    public function one_enabled_tag_is_enough_when_a_discussion_has_several()
    {
        // Any enabled tag enables the discussion, which matches how admins
        // describe it — "this is a Q&A tag" — rather than requiring every tag
        // on the discussion to be enabled.
        $this->boot();

        $this->assertTrue($this->postAttributes(4, self::MEMBER)['canVote']);
    }

    #[Test]
    public function untagged_discussions_are_not_gamified_when_tags_are_enabled()
    {
        // An untagged discussion carries no enabled tag, so it is outside the
        // configured area.
        $this->boot();

        $this->assertFalse($this->postAttributes(3, self::MEMBER)['canVote']);
    }

    #[Test]
    public function the_discussion_tally_is_hidden_outside_the_enabled_tags()
    {
        // seeVotes and votes ask the Discussion ability directly rather than
        // going through the post policy, so they need gating of their own. A
        // member holding canSeeVotes forum-wide would otherwise still be shown
        // a tally on a tag where gamification is switched off — the guest case
        // hides this, because a guest fails the permission check anyway.
        $this->boot();

        $enabled = $this->discussionAttributes(1, self::MEMBER);
        $this->assertTrue($enabled['seeVotes']);
        $this->assertArrayHasKey('votes', $enabled);

        $gated = $this->discussionAttributes(2, self::MEMBER);
        $this->assertFalse($gated['seeVotes'], 'no tally outside the enabled tags');
        $this->assertArrayNotHasKey('votes', $gated);
    }

    #[Test]
    public function an_empty_setting_disables_gamification_everywhere()
    {
        // The migration always seeds a value, so an empty list is a deliberate
        // choice rather than an unconfigured forum.
        $this->boot([]);

        $this->assertFalse($this->postAttributes(1, self::MEMBER)['canVote']);
        $this->assertFalse($this->postAttributes(3, self::MEMBER)['canVote']);
    }

    #[Test]
    public function an_unset_setting_leaves_gamification_available_everywhere()
    {
        // A forum that has not run the migration — or has no tags at all —
        // must not silently lose voting.
        $this->boot(null);

        // The seeding migration runs during setup, so clear what it wrote to
        // model a forum that has not been configured.
        $this->app()->getContainer()->make(\Flarum\Settings\SettingsRepositoryInterface::class)
            ->delete(EnabledTags::SETTING);

        $this->assertTrue($this->postAttributes(1, self::MEMBER)['canVote']);
        $this->assertTrue($this->postAttributes(2, self::MEMBER)['canVote']);
        $this->assertTrue($this->postAttributes(3, self::MEMBER)['canVote'], 'including untagged discussions');
    }

    #[Test]
    public function permissions_still_apply_within_an_enabled_tag()
    {
        // The gate decides where gamification exists; permissions still decide
        // who may use it. Revoking the permission must still refuse the vote
        // even though the tag is enabled.
        $this->boot();

        $this->database()->table('group_permission')
            ->where('permission', 'discussion.votePosts')->delete();

        $this->assertSame(403, $this->vote(1, self::MEMBER));
    }
}
