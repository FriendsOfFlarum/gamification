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
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

/**
 * `canHaveVotingNotifications` decides whether the forum offers the vote
 * notification setting, so only the signed-in user's own value is ever read.
 *
 * It used to be serialized for every user in every response, answered with a
 * permission lookup per distinct set of groups among them. Every author here
 * is in a group of their own, as on a forum that uses many role or badge
 * groups. The other query-count tests put every author in the same groups,
 * which is why the repeated-query detector never saw it.
 */
class VotingNotificationsFieldTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const AUTHORS = 10;

    public function setUp(): void
    {
        parent::setUp();
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $users = [$this->normalUser()];
        $groups = $groupUser = $discussions = $posts = [];

        for ($i = 1; $i <= self::AUTHORS; $i++) {
            $id = 100 + $i;
            $at = $now->copy()->subMinutes($i)->toDateTimeString();
            $users[] = ['id' => $id, 'username' => "author$i", 'email' => "author$i@machine.local", 'is_email_confirmed' => 1, 'joined_at' => $at];
            $groups[] = ['id' => $id, 'name_singular' => "G$i", 'name_plural' => "G$i"];
            $groupUser[] = ['user_id' => $id, 'group_id' => $id];
            $discussions[] = ['id' => $i, 'title' => "D$i", 'created_at' => $at, 'last_posted_at' => $at, 'user_id' => $id, 'first_post_id' => $id, 'comment_count' => 1, 'is_private' => 0];
            $posts[] = ['id' => $id, 'discussion_id' => $i, 'number' => 1, 'created_at' => $at, 'user_id' => $id, 'type' => 'comment', 'content' => '<t><p>first</p></t>'];
        }

        $this->prepareDatabase([
            User::class        => $users,
            Group::class       => $groups,
            'group_user'       => $groupUser,
            'group_permission' => [
                ['group_id' => Group::MEMBER_ID, 'permission' => 'viewUserList'],
                ['group_id' => 101, 'permission' => 'discussion.upvote_notifications'],
            ],
            Discussion::class => $discussions,
            Post::class       => $posts,
        ]);
    }

    private function queriesFor(string $uri, ?int $actor): int
    {
        $this->database()->enableQueryLog();
        $this->database()->flushQueryLog();

        $response = $this->send($this->request('GET', $uri, $actor ? ['authenticatedAs' => $actor] : []));
        $this->assertSame(200, $response->getStatusCode());
        $this->assertNotEmpty(json_decode((string) $response->getBody(), true)['data']);

        return count($this->database()->getQueryLog());
    }

    public static function listings(): array
    {
        $cases = [];

        foreach (['users' => '/api/users', 'posts' => '/api/posts?sort=createdAt', 'discussions' => '/api/discussions?include=user,firstPost.user'] as $name => $uri) {
            foreach (['guest' => null, 'member' => 2, 'admin' => 1] as $who => $actor) {
                // A guest can't list users.
                if ($name !== 'users' || $actor !== null) {
                    $cases["$name as $who"] = [$uri, $actor];
                }
            }
        }

        return $cases;
    }

    #[Test]
    #[DataProvider('listings')]
    public function a_listing_costs_the_same_with_one_author_as_with_many(string $uri, ?int $actor)
    {
        // The first request of a test also pays one-off costs, such as loading
        // the settings, that the second would not. Pay them before measuring,
        // on a request that serializes no user but the actor: anything
        // memoised for the listing itself would make the comparison prove
        // nothing.
        $this->queriesFor('/api', $actor);

        $many = $this->queriesFor($uri, $actor);

        // Down to a single author, with their discussion and post.
        $this->database()->table('posts')->where('user_id', '>', 101)->delete();
        $this->database()->table('discussions')->where('user_id', '>', 101)->delete();
        $this->database()->table('users')->where('id', '>', 101)->delete();

        $this->assertSame($this->queriesFor($uri, $actor), $many);
    }

    private function attributesOf(int $user, int $actor): array
    {
        $response = $this->send($this->request('GET', "/api/users/$user", ['authenticatedAs' => $actor]));

        return json_decode((string) $response->getBody(), true)['data']['attributes'];
    }

    #[Test]
    public function a_user_is_told_whether_they_can_have_voting_notifications()
    {
        // The extension's migration grants both to every member; take that
        // away so that only author1's own group has it.
        $this->database()->table('group_permission')->where('group_id', Group::MEMBER_ID)->whereIn('permission', ['discussion.upvote_notifications', 'discussion.downvote_notifications'])->delete();

        $this->assertTrue($this->attributesOf(101, 101)['canHaveVotingNotifications'], 'Granted through their group');
        $this->assertFalse($this->attributesOf(102, 102)['canHaveVotingNotifications']);
    }

    #[Test]
    public function the_forum_document_carries_it_for_the_signed_in_user()
    {
        // Where the frontend reads it from: the session user preloaded with the forum.
        $body = json_decode((string) $this->send($this->request('GET', '/api', ['authenticatedAs' => 101]))->getBody(), true);
        $actor = collect($body['included'])->firstWhere(fn ($r) => $r['type'] === 'users' && $r['id'] === '101');

        $this->assertTrue($actor['attributes']['canHaveVotingNotifications']);
    }

    #[Test]
    public function nobody_else_is_told()
    {
        $this->assertArrayNotHasKey('canHaveVotingNotifications', $this->attributesOf(101, 2));
        $this->assertArrayNotHasKey('canHaveVotingNotifications', $this->attributesOf(101, 1), 'Not even an admin');
    }
}
