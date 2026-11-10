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
use Flarum\Testing\integration\ConsoleTestCase;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\Guest;
use Flarum\User\User;
use FoF\Gamification\Events\UserPointsUpdated;
use FoF\Gamification\Jobs\AutoAssignUserGroups;
use FoF\Gamification\PointGrants;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Queue\Events\JobProcessing;
use InvalidArgumentException;
use PHPUnit\Framework\Attributes\Test;

/**
 * Points another extension grants a member, through {@see PointGrants}.
 *
 * A member's points are recounted from their posts' votes on every vote, on
 * auto-upvote and by `fof:gamification:resyncUsers`, so what matters most is
 * that a grant survives each of those recounts rather than being wiped by the
 * next one.
 */
class PointGrantsTest extends ConsoleTestCase
{
    use RetrievesAuthorizedUsers;

    private const AUTHOR = 2;
    private const VOTER = 3;
    private const BYSTANDER = 4;
    private const VOTER_GROUP = 101;

    /**
     * @param array<string, mixed> $settings
     */
    private function boot(array $settings = []): void
    {
        foreach ($settings as $key => $value) {
            $this->setting($key, $value);
        }

        $this->extension('flarum-tags', 'fof-gamification');

        // Long enough ago that replying is not refused as flooding.
        $earlier = Carbon::now()->subHour()->toDateTimeString();

        $this->prepareDatabase([
            User::class => [
                // The author's stored total matches the two votes on post 2.
                ['votes' => 2] + $this->normalUser(),
                ['id' => 3, 'username' => 'voter', 'email' => 'voter@machine.local', 'is_email_confirmed' => 1],
                ['id' => 4, 'username' => 'bystander', 'email' => 'bystander@machine.local', 'is_email_confirmed' => 1],
            ],
            Group::class => [
                ['id' => self::VOTER_GROUP, 'name_singular' => 'Voter', 'name_plural' => 'Voters'],
            ],
            'group_user' => [
                ['user_id' => 2, 'group_id' => self::VOTER_GROUP],
                ['user_id' => 3, 'group_id' => self::VOTER_GROUP],
                ['user_id' => 4, 'group_id' => self::VOTER_GROUP],
            ],
            'group_permission' => [
                ['group_id' => self::VOTER_GROUP, 'permission' => 'discussion.votePosts'],
                ['group_id' => self::VOTER_GROUP, 'permission' => 'discussion.canSeeVotes'],
            ],
            Tag::class => [
                ['id' => 1, 'name' => 'Gamified', 'slug' => 'gamified', 'position' => 0, 'is_restricted' => 0],
            ],
            'discussion_tag' => [
                ['discussion_id' => 1, 'tag_id' => 1],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $earlier, 'last_posted_at' => $earlier, 'user_id' => self::AUTHOR, 'first_post_id' => 1, 'last_post_id' => 2, 'last_post_number' => 2, 'comment_count' => 2, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $earlier, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>first</p></t>'],
                ['id' => 2, 'discussion_id' => 1, 'number' => 2, 'created_at' => $earlier, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>reply</p></t>'],
            ],
            'post_votes' => [
                ['id' => 1, 'post_id' => 2, 'user_id' => self::VOTER, 'value' => 1],
                ['id' => 2, 'post_id' => 2, 'user_id' => self::BYSTANDER, 'value' => 1],
            ],
            'ranks' => [
                ['id' => 1, 'points' => 5, 'name' => 'Regular', 'color' => '#ffffff'],
                ['id' => 2, 'points' => 20, 'name' => 'Veteran', 'color' => '#000000'],
            ],
        ]);
    }

    /**
     * The vote write path reloads the same user several times within one
     * request; that is pinned (and allowed) by VoteWritePathTest, and is not
     * what these tests are about.
     */
    protected function allowedRepeatedQueries(): array
    {
        return ['users"."id" = ?', 'users`.`id` = ?'];
    }

    private function grants(): PointGrants
    {
        return $this->app()->getContainer()->make(PointGrants::class);
    }

    private function user(int $id): User
    {
        return User::query()->findOrFail($id);
    }

    private function points(int $id = self::AUTHOR): int
    {
        return (int) $this->database()->table('users')->where('id', $id)->value('votes');
    }

    private function grantRows(int $id = self::AUTHOR): int
    {
        return $this->database()->table('gamification_point_grants')->where('user_id', $id)->count();
    }

    /** @return int[] */
    private function rankIds(int $id = self::AUTHOR): array
    {
        return $this->database()->table('rank_users')->where('user_id', $id)
            ->pluck('rank_id')->map(fn ($rankId) => (int) $rankId)->sort()->values()->all();
    }

    /** @var int[] the total carried by each UserPointsUpdated, in order */
    private array $pointsUpdates = [];

    /** @var string[] the class of each queued job that ran, in order */
    private array $jobsRun = [];

    /**
     * Record UserPointsUpdated events and queued jobs from here on. The queue
     * is the sync driver, so a job pushed by a listener runs straight away.
     */
    private function listen(): void
    {
        $events = $this->app()->getContainer()->make(Dispatcher::class);

        $events->listen(UserPointsUpdated::class, function (UserPointsUpdated $event) {
            $this->pointsUpdates[] = $event->user->votes;
        });
        $events->listen(JobProcessing::class, function (JobProcessing $event) {
            $this->jobsRun[] = $event->job->resolveName();
        });
    }

    #[Test]
    public function a_grant_adds_to_the_points_earned_from_votes()
    {
        $this->boot();

        $this->assertTrue($this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10));

        $this->assertSame(12, $this->points(), 'two from votes, ten granted');
        $this->assertSame(10, $this->grants()->total($this->user(self::AUTHOR)));
        $this->assertSame(1, $this->grantRows());
    }

    #[Test]
    public function granting_the_same_source_and_reason_twice_gives_the_points_once()
    {
        $this->boot();
        $this->listen();

        $this->assertTrue($this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10));

        $author = $this->user(self::AUTHOR);
        $this->database()->flushQueryLog();
        $this->database()->enableQueryLog();
        $this->assertFalse($this->grants()->grant($author, 'onramp', 'step:1', 50), 'a repeat is refused, whatever its points');
        $this->assertCount(1, $this->database()->getQueryLog(), 'a repeat costs one lookup and attempts no write');
        $this->database()->disableQueryLog();

        $this->assertSame(12, $this->points());
        $this->assertSame(1, $this->grantRows());
        $this->assertSame([12], $this->pointsUpdates, 'and changes nothing, so announces nothing');
    }

    #[Test]
    public function a_grant_is_identified_by_its_source_as_well_as_its_reason()
    {
        $this->boot();

        $this->assertTrue($this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10));
        $this->assertTrue($this->grants()->grant($this->user(self::AUTHOR), 'quests', 'step:1', 3));

        $this->assertSame(15, $this->points());
        $this->assertSame(13, $this->grants()->total($this->user(self::AUTHOR)));
    }

    #[Test]
    public function a_grant_that_loses_the_race_to_an_identical_one_is_refused()
    {
        $this->boot();

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);

        // Stands in for a concurrent request that inserted the same grant
        // after this one checked for it: the check never sees the row, so only
        // the unique index stops the duplicate.
        $racing = new class($this->app()->getContainer()->make(Dispatcher::class)) extends PointGrants {
            protected function find(User $user, string $source, string $reason): \Illuminate\Database\Eloquent\Builder
            {
                return parent::find($user, $source, $reason)->whereRaw('1 = 0');
            }
        };

        $this->assertFalse($racing->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10));
        $this->assertSame(12, $this->points());
        $this->assertSame(1, $this->grantRows());
    }

    #[Test]
    public function a_grant_may_take_points_away()
    {
        $this->boot();

        $this->assertTrue($this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'penalty:1', -5));

        $this->assertSame(-3, $this->points());
        $this->assertSame(-5, $this->grants()->total($this->user(self::AUTHOR)));
    }

    #[Test]
    public function a_grant_survives_the_recount_a_vote_makes()
    {
        $this->boot(['fof-gamification.firstPostOnly' => 0]);

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);

        $response = $this->send($this->request('PATCH', '/api/posts/1', [
            'authenticatedAs' => self::VOTER,
            'json'            => ['data' => ['attributes' => ['vote' => 'up']]],
        ]));

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame(13, $this->points(), 'three from votes, ten granted');
    }

    #[Test]
    public function a_grant_survives_the_recount_an_auto_upvote_makes()
    {
        $this->boot(['fof-gamification.autoUpvotePosts' => 1]);

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);

        $response = $this->send($this->request('POST', '/api/posts', [
            'authenticatedAs' => self::AUTHOR,
            'json'            => ['data' => [
                'attributes'    => ['content' => 'another reply'],
                'relationships' => ['discussion' => ['data' => ['type' => 'discussions', 'id' => '1']]],
            ]],
        ]));

        $this->assertSame(201, $response->getStatusCode());
        $this->assertSame(1, $this->database()->table('post_votes')->where('user_id', self::AUTHOR)->count(), 'the auto-upvote was cast');

        // 12 is two from votes plus the grant. It leaves out the auto-upvote
        // itself because AddVoteHandler recounts before saving that vote: that
        // is how 2.x behaves today, pinned here and out of scope for this
        // change. What this test is about is that the recount kept the grant.
        $this->assertSame(12, $this->points());
    }

    #[Test]
    public function a_grant_survives_a_full_resync()
    {
        $this->boot();

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);

        $this->database()->table('users')->where('id', self::AUTHOR)->update(['votes' => 0]);

        $this->runCommand(['command' => 'fof:gamification:resyncUsers']);

        $this->assertSame(12, $this->points());
    }

    #[Test]
    public function a_resync_leaves_members_without_grants_as_they_were()
    {
        $this->boot();

        $output = $this->runCommand(['command' => 'fof:gamification:resyncUsers']);

        $this->assertSame(2, $this->points(), 'votes only, as before grants existed');
        $this->assertSame(0, $this->points(self::VOTER));
        $this->assertStringContainsString('Updated 0 users.', $output);
    }

    #[Test]
    public function revoking_a_grant_takes_its_points_back()
    {
        $this->boot();
        $this->listen();

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);

        $this->assertTrue($this->grants()->revoke($this->user(self::AUTHOR), 'onramp', 'step:1'));
        $this->assertSame(2, $this->points());
        $this->assertSame(0, $this->grantRows());
        $this->assertSame(0, $this->grants()->total($this->user(self::AUTHOR)));

        $this->assertFalse($this->grants()->revoke($this->user(self::AUTHOR), 'onramp', 'step:1'), 'nothing left to revoke');
        $this->assertSame([12, 2], $this->pointsUpdates, 'one event per change, none for the empty revoke');
    }

    #[Test]
    public function revoking_leaves_other_grants_alone()
    {
        $this->boot();

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);
        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:2', 4);
        $this->grants()->grant($this->user(self::BYSTANDER), 'onramp', 'step:1', 7);

        $this->grants()->revoke($this->user(self::AUTHOR), 'onramp', 'step:1');

        $this->assertSame(6, $this->points());
        $this->assertSame(7, $this->points(self::BYSTANDER));
    }

    #[Test]
    public function a_grant_and_its_revocation_move_the_members_ranks()
    {
        $this->boot();

        $this->assertSame([], $this->rankIds());

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 3);
        $this->assertSame([1], $this->rankIds(), 'five points reaches the first rank');

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:2', 20);
        $this->assertSame([1, 2], $this->rankIds());

        $this->grants()->revoke($this->user(self::AUTHOR), 'onramp', 'step:1');
        $this->assertSame([1, 2], $this->rankIds(), 'twenty-two is still past both');

        $this->grants()->revoke($this->user(self::AUTHOR), 'onramp', 'step:2');
        $this->assertSame([], $this->rankIds(), 'and both go when the points do');
    }

    #[Test]
    public function a_grant_announces_the_new_points()
    {
        $this->boot();
        $this->listen();

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);

        $this->assertSame([12], $this->pointsUpdates);
        $this->assertSame([AutoAssignUserGroups::class], $this->jobsRun, 'which re-checks auto-assigned groups');
    }

    #[Test]
    public function a_grant_that_leaves_the_total_unchanged_announces_nothing()
    {
        $this->boot();

        // A stored total that was already out of step: 12 where the votes
        // make 2. Granting 10 recounts to 12, so nothing moved.
        $this->database()->table('users')->where('id', self::AUTHOR)->update(['votes' => 12]);
        $this->listen();

        $this->assertTrue($this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10));

        $this->assertSame(12, $this->points());
        $this->assertSame([], $this->pointsUpdates, 'no event');
        $this->assertSame([], $this->jobsRun, 'and no group re-check');
        $this->assertSame([], $this->rankIds(), 'and no rank sync, though 12 is past the first rank');
    }

    #[Test]
    public function an_unchanged_total_announces_nothing_on_a_user_saved_before()
    {
        $this->boot();
        $grants = $this->grants();
        $author = $this->user(self::AUTHOR);
        $this->assertTrue($grants->grant($author, 'onramp', 'step:1', 10));

        // A grant written behind the service's back, so that the next grant
        // on the same instance lands on the total the instance already has.
        $this->database()->table('gamification_point_grants')->insert([
            'user_id' => self::AUTHOR, 'source' => 'elsewhere', 'reason' => 'x', 'points' => -5,
        ]);
        $this->listen();

        $this->assertTrue($grants->grant($author, 'onramp', 'step:2', 5));

        $this->assertSame(12, $this->points());
        $this->assertSame([], $this->pointsUpdates, "the instance's earlier save is not mistaken for this one");
    }

    #[Test]
    public function a_grant_of_zero_points_is_refused()
    {
        $this->boot();

        try {
            $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 0);
            $this->fail('A zero-point grant was accepted.');
        } catch (InvalidArgumentException) {
        }

        $this->assertSame(0, $this->grantRows());
    }

    #[Test]
    public function a_guest_or_unsaved_user_is_refused()
    {
        $this->boot();

        foreach ([new User(), new Guest()] as $user) {
            foreach ([
                fn () => $this->grants()->grant($user, 'onramp', 'step:1', 10),
                fn () => $this->grants()->revoke($user, 'onramp', 'step:1'),
            ] as $call) {
                try {
                    $call();
                    $this->fail(get_class($user).' was accepted.');
                } catch (InvalidArgumentException) {
                }
            }
        }

        $this->assertSame(0, $this->database()->table('gamification_point_grants')->count());
    }

    #[Test]
    public function deleting_a_voted_post_keeps_the_grant()
    {
        $this->boot();

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);
        $this->assertSame(12, $this->points());

        $response = $this->send($this->request('DELETE', '/api/posts/2', ['authenticatedAs' => 1]));

        $this->assertSame(204, $response->getStatusCode());
        $this->assertSame(1, $this->grantRows());

        // RemoveVoteHandler subtracts the votes it can still find on the post
        // from the stored total, leaving the grant in it. Where the database
        // enforces post_votes' foreign key, those rows are already gone by the
        // time the Deleted event fires, so it finds none; flarum/testing turns
        // SQLite's foreign keys off, so there it finds both.
        $votesSeenByHandler = $this->database()->table('post_votes')->where('post_id', 2)->count();
        $this->assertSame(12 - $votesSeenByHandler, $this->points());

        // Either way, a recount lands on the grant alone.
        $this->runCommand(['command' => 'fof:gamification:resyncUsers']);
        $this->assertSame(10, $this->points());
    }

    #[Test]
    public function deleting_a_member_deletes_their_grants()
    {
        $this->boot();

        // flarum/testing switches SQLite's foreign keys off for its test
        // transaction, so the cascade cannot be observed there. A real SQLite
        // install has them on (`foreign_key_constraints` in config.php).
        if ($this->database()->getDriverName() === 'sqlite') {
            $this->markTestSkipped('flarum/testing disables foreign keys on SQLite.');
        }

        $this->grants()->grant($this->user(self::AUTHOR), 'onramp', 'step:1', 10);
        $this->grants()->grant($this->user(self::BYSTANDER), 'onramp', 'step:1', 7);

        $response = $this->send($this->request('DELETE', '/api/users/'.self::AUTHOR, ['authenticatedAs' => 1]));

        $this->assertSame(204, $response->getStatusCode());
        $this->assertSame(0, $this->grantRows());
        $this->assertSame(1, $this->grantRows(self::BYSTANDER), "nobody else's");
    }

    #[Test]
    public function an_oversized_source_or_reason_is_refused_rather_than_truncated()
    {
        $this->boot();

        $longSource = str_repeat('s', PointGrants::SOURCE_LENGTH + 1);
        $longReason = str_repeat('r', PointGrants::REASON_LENGTH + 1);

        foreach ([
            'grant, reason'  => fn () => $this->grants()->grant($this->user(self::AUTHOR), 'onramp', $longReason, 10),
            'grant, source'  => fn () => $this->grants()->grant($this->user(self::AUTHOR), $longSource, 'step:1', 10),
            'revoke, reason' => fn () => $this->grants()->revoke($this->user(self::AUTHOR), 'onramp', $longReason),
            'revoke, source' => fn () => $this->grants()->revoke($this->user(self::AUTHOR), $longSource, 'step:1'),
        ] as $case => $call) {
            try {
                $call();
                $this->fail("An over-long value was accepted ($case).");
            } catch (InvalidArgumentException) {
            }
        }

        // The limits themselves fit, multibyte characters included.
        $source = str_repeat('é', PointGrants::SOURCE_LENGTH);
        $reason = str_repeat('é', PointGrants::REASON_LENGTH);
        $this->assertTrue($this->grants()->grant($this->user(self::AUTHOR), $source, $reason, 1));
        $this->assertSame(1, $this->grantRows());
        $this->assertTrue($this->grants()->revoke($this->user(self::AUTHOR), $source, $reason));
    }
}
