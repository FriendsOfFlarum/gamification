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
use Flarum\Tags\Tag;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * The `upvotes` and `downvotes` relationships name the people who voted, so
 * they belong to `canSeeVoters` just as the `seeVoters` flag does.
 *
 * `includable()` is not a permission: include validation asks only whether a
 * field may be included at all, never whether this actor may see it. These
 * tests therefore request the relationships rather than reading the flag —
 * the flag was already gated correctly while the relationships beside it were
 * not, so only asking for them directly covers this.
 */
class VoterIdentityDisclosureTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const AUTHOR = 2;   // wrote the post
    private const VOTER = 3;    // upvoted it — the identity to protect
    private const NOSY = 4;     // a member with no canSeeVoters grant
    private const ALLOWED = 5;  // a member who may see who voted

    private const POST = 1;

    private const NOSY_GROUP = 101;
    private const ALLOWED_GROUP = 102;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-tags', 'fof-gamification');

        $now = Carbon::now()->toDateTimeString();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id 2, the author
                ['id' => self::VOTER, 'username' => 'voter', 'email' => 'voter@machine.local', 'is_email_confirmed' => 1],
                ['id' => self::NOSY, 'username' => 'nosy', 'email' => 'nosy@machine.local', 'is_email_confirmed' => 1],
                ['id' => self::ALLOWED, 'username' => 'allowed', 'email' => 'allowed@machine.local', 'is_email_confirmed' => 1],
            ],
            Group::class => [
                ['id' => self::NOSY_GROUP, 'name_singular' => 'Nosy', 'name_plural' => 'Nosy'],
                ['id' => self::ALLOWED_GROUP, 'name_singular' => 'Allowed', 'name_plural' => 'Allowed'],
            ],
            'group_user' => [
                ['user_id' => self::NOSY, 'group_id' => self::NOSY_GROUP],
                ['user_id' => self::ALLOWED, 'group_id' => self::ALLOWED_GROUP],
            ],
            'group_permission' => [
                // Deliberately granted the tally but not the identities: this
                // is the configuration the disclosure was most damaging in.
                ['group_id' => self::NOSY_GROUP, 'permission' => 'discussion.canSeeVotes'],
                ['group_id' => self::ALLOWED_GROUP, 'permission' => 'discussion.canSeeVotes'],
                ['group_id' => self::ALLOWED_GROUP, 'permission' => 'discussion.canSeeVoters'],
            ],
            Tag::class => [
                ['id' => 1, 'name' => 'Gamified', 'slug' => 'gamified', 'position' => 0, 'is_restricted' => 0],
            ],
            'discussion_tag' => [
                ['discussion_id' => 1, 'tag_id' => 1],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => self::AUTHOR, 'first_post_id' => self::POST, 'comment_count' => 1, 'is_private' => 0, 'votes' => 1],
            ],
            Post::class => [
                ['id' => self::POST, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>first</p></t>'],
            ],
            'post_votes' => [
                ['id' => 1, 'post_id' => self::POST, 'user_id' => self::VOTER, 'value' => 1],
            ],
        ]);
    }

    /**
     * Ask for the voter identities the way an attacker would, and report every
     * route by which they could come back.
     *
     * Linkage ids and included resources are checked separately because they
     * leak independently: a relationship can carry identities in its `data`
     * without the full user resources being compounded into `included`.
     *
     * @return array{linkage: string[], included: string[], seeVoters: mixed}
     */
    private function askWhoVoted(?int $actor): array
    {
        $options = $actor !== null ? ['authenticatedAs' => $actor] : [];

        // Includes go through withQueryParams(): the request builder takes the
        // path verbatim, so a `?include=` written inline is never seen.
        $response = $this->send(
            $this->request('GET', '/api/posts/'.self::POST, $options)
                ->withQueryParams(['include' => 'upvotes,downvotes'])
        );

        $this->assertEquals(200, $response->getStatusCode(), 'the request itself must succeed');

        $body = json_decode($response->getBody()->getContents(), true);
        $relationships = $body['data']['relationships'] ?? [];

        $linkage = [];
        foreach (['upvotes', 'downvotes'] as $name) {
            foreach ($relationships[$name]['data'] ?? [] as $identifier) {
                $linkage[] = (string) $identifier['id'];
            }
        }

        // The post author is legitimately compounded via `user`, so only users
        // who are not otherwise part of the payload count as a voter leak.
        $included = [];
        foreach ($body['included'] ?? [] as $resource) {
            if ($resource['type'] === 'users') {
                $included[] = (string) $resource['id'];
            }
        }

        return [
            'linkage'   => $linkage,
            'included'  => $included,
            'seeVoters' => $body['data']['attributes']['seeVoters'] ?? null,
        ];
    }

    #[Test]
    public function a_guest_cannot_learn_who_voted()
    {
        $result = $this->askWhoVoted(null);

        $this->assertFalse($result['seeVoters'], 'precondition: a guest is refused the flag');
        $this->assertSame([], $result['linkage'], 'no voter may be named in the relationship linkage');
        $this->assertNotContains((string) self::VOTER, $result['included'], 'the voter must not be compounded into the payload');
    }

    #[Test]
    public function a_member_without_the_permission_cannot_learn_who_voted()
    {
        $result = $this->askWhoVoted(self::NOSY);

        $this->assertFalse($result['seeVoters'], 'precondition: this member holds canSeeVotes but not canSeeVoters');
        $this->assertSame([], $result['linkage'], 'the tally permission must not also reveal the identities');
        $this->assertNotContains((string) self::VOTER, $result['included'], 'the voter must not be compounded into the payload');
    }

    #[Test]
    public function an_actor_with_the_permission_still_sees_who_voted()
    {
        $result = $this->askWhoVoted(self::ALLOWED);

        $this->assertTrue($result['seeVoters'], 'precondition: this member holds canSeeVoters');
        $this->assertSame([(string) self::VOTER], $result['linkage'], 'the feature must keep working for those allowed it');
        $this->assertContains((string) self::VOTER, $result['included'], 'the voter resource must still be compounded');
    }
}
