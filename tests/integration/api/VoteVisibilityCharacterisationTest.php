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
 * Pins the serialized vote fields across the setting/permission/actor matrix.
 *
 * This extension's visible behaviour is the product of several independent
 * switches — `firstPostOnly`, `allowSelfVotes`, three separate permissions, and
 * whether the actor is a guest, the post's author, or someone else — and the
 * fields are resolved in serializer callbacks and a policy rather than in one
 * place. That makes it easy to change the payload by accident while optimising.
 *
 * These tests therefore assert what the extension does *today*, so any change
 * to the observable API is a deliberate decision rather than a side effect. If
 * one of these fails, the payload changed: establish whether that was intended
 * before updating the expectation.
 *
 * The two permissions are deliberately distinct and are pinned separately:
 *   - canSeeVotes  — "See up/down vote count"  (the tally)
 *   - canSeeVoters — "See who voted"           (the identities)
 * Holding one without the other is a legitimate configuration.
 */
class VoteVisibilityCharacterisationTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const AUTHOR = 2;   // wrote both posts
    private const OTHER = 3;    // another member, upvoted the first post
    private const VOTER_GROUP = 101;

    private const FIRST_POST = 1;
    private const REPLY = 2;

    /**
     * @param array<string, mixed> $settings
     * @param string[]|null        $permissions permissions granted to the voter
     *                                          group; null grants all three
     */
    private function boot(array $settings = [], ?array $permissions = null): void
    {
        // Settings must be staged before anything boots the app.
        foreach ($settings as $key => $value) {
            $this->setting($key, $value);
        }

        $this->extension('fof-gamification');

        $now = Carbon::now()->toDateTimeString();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id 2
                ['id' => 3, 'username' => 'other', 'email' => 'other@machine.local', 'is_email_confirmed' => 1],
            ],
            Group::class => [
                ['id' => self::VOTER_GROUP, 'name_singular' => 'Voter', 'name_plural' => 'Voters'],
            ],
            'group_user' => [
                ['user_id' => 2, 'group_id' => self::VOTER_GROUP],
                ['user_id' => 3, 'group_id' => self::VOTER_GROUP],
            ],
            'group_permission' => array_map(
                fn (string $permission) => ['group_id' => self::VOTER_GROUP, 'permission' => $permission],
                $permissions ?? ['discussion.canSeeVotes', 'discussion.canSeeVoters', 'discussion.votePosts']
            ),
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => self::AUTHOR, 'first_post_id' => 1, 'comment_count' => 2, 'is_private' => 0, 'votes' => 1],
            ],
            Post::class => [
                ['id' => self::FIRST_POST, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>first</p></t>'],
                ['id' => self::REPLY, 'discussion_id' => 1, 'number' => 2, 'created_at' => $now, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>reply</p></t>'],
            ],
            'post_votes' => [
                ['id' => 1, 'post_id' => self::FIRST_POST, 'user_id' => self::OTHER, 'value' => 1],
            ],
        ]);
    }

    /** @return array<string, mixed> the discussion's serialized attributes */
    private function discussion(?int $actor): array
    {
        $options = $actor !== null ? ['authenticatedAs' => $actor] : [];

        $response = $this->send($this->request('GET', '/api/discussions', $options));
        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        return $body['data'][0]['attributes'] ?? [];
    }

    /** @return array<int, array<string, mixed>> post id => serialized attributes */
    private function posts(?int $actor): array
    {
        $options = $actor !== null ? ['authenticatedAs' => $actor] : [];

        $response = $this->send($this->request('GET', '/api/posts?filter[discussion]=1', $options));
        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        $posts = [];
        foreach ($body['data'] ?? [] as $row) {
            $posts[(int) $row['id']] = $row['attributes'];
        }

        return $posts;
    }

    // ---------------------------------------------------------------------
    // Guests
    // ---------------------------------------------------------------------

    #[Test]
    public function a_guest_sees_no_vote_state_on_the_discussion_list()
    {
        $this->boot();

        $attributes = $this->discussion(null);

        // hasUpvoted/hasDownvoted/votes are omitted entirely for guests, while
        // seeVotes and canVote are present and false. Optimising the guest path
        // must preserve this exact shape — the frontend reads canVote to decide
        // whether to show a control that prompts for login.
        $this->assertArrayNotHasKey('hasUpvoted', $attributes);
        $this->assertArrayNotHasKey('hasDownvoted', $attributes);
        $this->assertArrayNotHasKey('votes', $attributes);
        $this->assertFalse($attributes['seeVotes']);
        $this->assertFalse($attributes['canVote']);
    }

    #[Test]
    public function a_guest_sees_no_vote_state_on_posts()
    {
        $this->boot();

        foreach ($this->posts(null) as $id => $attributes) {
            $this->assertFalse($attributes['canSeeVotes'], "post $id");
            $this->assertFalse($attributes['canVote'], "post $id");
            $this->assertFalse($attributes['seeVoters'], "post $id");
            $this->assertArrayNotHasKey('votes', $attributes, "post $id");
            $this->assertArrayNotHasKey('hasUpvoted', $attributes, "post $id");
        }
    }

    // ---------------------------------------------------------------------
    // Defaults: firstPostOnly = true, allowSelfVotes = true
    // ---------------------------------------------------------------------

    #[Test]
    public function by_default_only_the_first_post_carries_vote_state()
    {
        $this->boot();

        $posts = $this->posts(self::OTHER);

        $this->assertTrue($posts[self::FIRST_POST]['canSeeVotes']);
        $this->assertTrue($posts[self::FIRST_POST]['canVote']);
        $this->assertSame(1, $posts[self::FIRST_POST]['votes']);
        $this->assertTrue($posts[self::FIRST_POST]['hasUpvoted']);

        // firstPostOnly denies the reply outright, so its vote fields are
        // hidden rather than false-valued.
        $this->assertFalse($posts[self::REPLY]['canSeeVotes']);
        $this->assertFalse($posts[self::REPLY]['canVote']);
        $this->assertArrayNotHasKey('votes', $posts[self::REPLY]);
        $this->assertArrayNotHasKey('hasUpvoted', $posts[self::REPLY]);
    }

    #[Test]
    public function the_discussion_reflects_the_actors_own_vote()
    {
        $this->boot();

        $voted = $this->discussion(self::OTHER);
        $this->assertTrue($voted['hasUpvoted']);
        $this->assertFalse($voted['hasDownvoted']);
        $this->assertSame(1, $voted['votes']);

        // The author has not voted; the count is the same for both.
        $notVoted = $this->discussion(self::AUTHOR);
        $this->assertFalse($notVoted['hasUpvoted']);
        $this->assertFalse($notVoted['hasDownvoted']);
        $this->assertSame(1, $notVoted['votes']);
    }

    // ---------------------------------------------------------------------
    // firstPostOnly = false
    // ---------------------------------------------------------------------

    #[Test]
    public function disabling_first_post_only_exposes_vote_state_on_replies()
    {
        $this->boot(['fof-gamification.firstPostOnly' => 0]);

        $posts = $this->posts(self::OTHER);

        $this->assertTrue($posts[self::REPLY]['canSeeVotes']);
        $this->assertTrue($posts[self::REPLY]['canVote']);
        $this->assertTrue($posts[self::REPLY]['seeVoters']);
        // The reply has no votes at all, which serializes as null (not 0).
        $this->assertNull($posts[self::REPLY]['votes']);
        $this->assertFalse($posts[self::REPLY]['hasUpvoted']);
    }

    // ---------------------------------------------------------------------
    // allowSelfVotes = false
    // ---------------------------------------------------------------------

    #[Test]
    public function disabling_self_votes_only_blocks_the_posts_own_author()
    {
        $this->boot(['fof-gamification.allowSelfVotes' => 0]);

        $author = $this->posts(self::AUTHOR);
        $other = $this->posts(self::OTHER);

        // The author wrote the first post, so cannot vote on it — but can still
        // see the count.
        $this->assertFalse($author[self::FIRST_POST]['canVote']);
        $this->assertTrue($author[self::FIRST_POST]['canSeeVotes']);

        // Everyone else is unaffected.
        $this->assertTrue($other[self::FIRST_POST]['canVote']);

        // The discussion-level canVote follows the same rule, since it resolves
        // through the first post.
        $this->assertFalse($this->discussion(self::AUTHOR)['canVote']);
        $this->assertTrue($this->discussion(self::OTHER)['canVote']);
    }

    #[Test]
    public function self_votes_are_allowed_by_default()
    {
        $this->boot();

        $this->assertTrue($this->posts(self::AUTHOR)[self::FIRST_POST]['canVote']);
        $this->assertTrue($this->discussion(self::AUTHOR)['canVote']);
    }

    // ---------------------------------------------------------------------
    // Permissions, pinned independently
    // ---------------------------------------------------------------------

    #[Test]
    public function can_see_votes_alone_exposes_the_count_but_not_the_voters()
    {
        $this->boot(permissions: ['discussion.canSeeVotes']);

        $post = $this->posts(self::OTHER)[self::FIRST_POST];

        $this->assertTrue($post['canSeeVotes']);
        $this->assertSame(1, $post['votes']);
        $this->assertFalse($post['seeVoters'], 'canSeeVotes must not imply canSeeVoters');
    }

    #[Test]
    public function can_see_voters_is_what_exposes_the_voter_identities()
    {
        $this->boot(permissions: ['discussion.canSeeVotes', 'discussion.canSeeVoters']);

        $this->assertTrue($this->posts(self::OTHER)[self::FIRST_POST]['seeVoters']);
    }

    #[Test]
    public function vote_permissions_can_be_scoped_to_a_tag()
    {
        // discuss.flarum.org grants the three vote permissions only as
        // `tag<id>.discussion.*`, so voting is enabled in one tag and nowhere
        // else. The global permission is absent entirely: an actor's access
        // therefore depends on the discussion's tags, not just their groups.
        // Pinned because a policy or eager-loading change could easily start
        // consulting the global permission instead.
        $this->boot(permissions: ['tag99.discussion.canSeeVotes', 'tag99.discussion.canSeeVoters']);

        $post = $this->posts(self::OTHER)[self::FIRST_POST];

        // The fixture discussion carries no tags, so a tag-scoped grant must
        // not leak into it.
        $this->assertFalse($post['canSeeVotes'], 'a tag-scoped grant must not apply to an untagged discussion');
        $this->assertFalse($post['seeVoters']);
    }

    #[Test]
    public function withholding_can_see_votes_hides_the_count_but_not_the_ability_to_vote()
    {
        // votePosts is granted to Members by default, so an actor can still be
        // entitled to vote while unable to see the tally — a legitimate
        // configuration, and the frontend disables the buttons accordingly.
        $this->boot(permissions: ['discussion.votePosts']);

        $discussion = $this->discussion(self::OTHER);
        $post = $this->posts(self::OTHER)[self::FIRST_POST];

        $this->assertFalse($discussion['seeVotes']);
        $this->assertArrayNotHasKey('votes', $discussion);
        $this->assertFalse($post['canSeeVotes']);
        $this->assertArrayNotHasKey('votes', $post);

        $this->assertTrue($post['canVote']);
    }
}
