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
 * Pins what casting a vote actually changes.
 *
 * Nothing in the suite cast a vote before this: every test read pre-seeded
 * rows. That left the whole write path unprotected — a single vote updates the
 * vote row, the author's running total, the discussion's tally and hotness,
 * and the author's ranks, then dispatches events that drive notifications and
 * auto-assigned groups. A wrong change here corrupts scores silently rather
 * than raising an error, which is exactly the kind of failure a test suite has
 * to catch.
 *
 * As with the visibility tests, these assert what the extension does *today*.
 */
class VoteWritePathTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    private const AUTHOR = 2;
    private const VOTER = 3;
    private const OTHER_VOTER = 4;
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

        $now = Carbon::now()->toDateTimeString();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(), // id 2, the author
                ['id' => 3, 'username' => 'voter', 'email' => 'voter@machine.local', 'is_email_confirmed' => 1],
                ['id' => 4, 'username' => 'voter2', 'email' => 'voter2@machine.local', 'is_email_confirmed' => 1],
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
                ['id' => 1, 'title' => 'D', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => self::AUTHOR, 'first_post_id' => 1, 'comment_count' => 2, 'is_private' => 0],
                // Deliberately left untagged, to prove gamification does not
                // reach a discussion outside the enabled tags.
                ['id' => 2, 'title' => 'Untagged', 'created_at' => $now, 'last_posted_at' => $now, 'user_id' => self::AUTHOR, 'first_post_id' => 3, 'comment_count' => 1, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => $now, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>first</p></t>'],
                ['id' => 2, 'discussion_id' => 1, 'number' => 2, 'created_at' => $now, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>reply</p></t>'],
                ['id' => 3, 'discussion_id' => 2, 'number' => 1, 'created_at' => $now, 'user_id' => self::AUTHOR, 'type' => 'comment', 'content' => '<t><p>untagged</p></t>'],
            ],
            'ranks' => [
                ['id' => 1, 'points' => 1, 'name' => 'Rookie', 'color' => '#ffffff'],
                ['id' => 2, 'points' => 5, 'name' => 'Pro', 'color' => '#000000'],
            ],
        ]);
    }

    /**
     * The write path reloads the same user several times within one request —
     * the vote handler, the points update and the rank sync each work from
     * their own instance. It is a real inefficiency, measured but deliberately
     * not fixed here: these tests exist to pin behaviour first, so that the
     * write path can be optimised against them afterwards.
     */
    protected function allowedRepeatedQueries(): array
    {
        return ['select * from "users" where "users"."id" = ?'];
    }

    private function vote(int $actor, ?string $value, int $postId = 1): int
    {
        return $this->send(
            $this->request('PATCH', "/api/posts/$postId", [
                'authenticatedAs' => $actor,
                'json'            => ['data' => ['attributes' => ['vote' => $value]]],
            ])
        )->getStatusCode();
    }

    private function discussionRow(): object
    {
        return $this->database()->table('discussions')->where('id', 1)->first();
    }

    private function authorVotes(): int
    {
        return (int) $this->database()->table('users')->where('id', self::AUTHOR)->value('votes');
    }

    /** @return array<int, int> user id => vote value */
    private function voteRows(int $postId = 1): array
    {
        return $this->database()->table('post_votes')->where('post_id', $postId)
            ->pluck('value', 'user_id')->map(fn ($v) => (int) $v)->all();
    }

    /** @return int[] */
    private function authorRankIds(): array
    {
        return $this->database()->table('rank_users')->where('user_id', self::AUTHOR)
            ->pluck('rank_id')->map(fn ($id) => (int) $id)->sort()->values()->all();
    }

    #[Test]
    public function an_upvote_records_the_vote_and_updates_every_tally()
    {
        $this->boot();

        $this->assertSame(200, $this->vote(self::VOTER, 'up'));

        $this->assertSame([self::VOTER => 1], $this->voteRows());
        $this->assertSame(1, $this->authorVotes(), "the author's running total");
        $this->assertSame(1, (int) $this->discussionRow()->votes, 'the discussion tally');
    }

    #[Test]
    public function voting_the_same_way_twice_is_idempotent()
    {
        $this->boot();

        $this->vote(self::VOTER, 'up');
        $this->assertSame(200, $this->vote(self::VOTER, 'up'));

        // One row, not two, and no double-counting.
        $this->assertSame([self::VOTER => 1], $this->voteRows());
        $this->assertSame(1, $this->authorVotes());
        $this->assertSame(1, (int) $this->discussionRow()->votes);
    }

    #[Test]
    public function switching_from_up_to_down_swings_the_tally_by_two()
    {
        $this->boot();

        $this->vote(self::VOTER, 'up');
        $this->assertSame(200, $this->vote(self::VOTER, 'down'));

        $this->assertSame([self::VOTER => -1], $this->voteRows());
        $this->assertSame(-1, $this->authorVotes());
        $this->assertSame(-1, (int) $this->discussionRow()->votes);
    }

    #[Test]
    public function clearing_a_vote_zeroes_the_row_rather_than_deleting_it()
    {
        $this->boot();

        $this->vote(self::VOTER, 'up');
        $this->assertSame(200, $this->vote(self::VOTER, null));

        // The row survives with value 0 — worth pinning, because anything that
        // reasons about "has this user voted" by row existence rather than by
        // value would read this as a vote.
        $this->assertSame([self::VOTER => 0], $this->voteRows());
        $this->assertSame(0, $this->authorVotes());
        $this->assertSame(0, (int) $this->discussionRow()->votes);
    }

    #[Test]
    public function votes_from_several_users_accumulate()
    {
        $this->boot();

        $this->vote(self::VOTER, 'up');
        $this->vote(self::OTHER_VOTER, 'up');

        $this->assertSame([self::VOTER => 1, self::OTHER_VOTER => 1], $this->voteRows());
        $this->assertSame(2, $this->authorVotes());
        $this->assertSame(2, (int) $this->discussionRow()->votes);
    }

    #[Test]
    public function the_author_gains_a_rank_on_reaching_its_points_and_loses_it_again()
    {
        $this->boot();

        $this->assertSame([], $this->authorRankIds(), 'no ranks before any votes');

        $this->vote(self::VOTER, 'up');
        $this->assertSame([1], $this->authorRankIds(), 'the 1-point rank is granted');

        // Ranks are re-synced from the running total, so they are revoked when
        // the total falls back below the threshold.
        $this->vote(self::VOTER, 'down');
        $this->assertSame([], $this->authorRankIds(), 'and revoked when points drop');
    }

    #[Test]
    public function hotness_tracks_the_discussion_tally()
    {
        $this->boot();

        $this->assertSame(0.0, (float) $this->discussionRow()->hotness);

        $this->vote(self::VOTER, 'up');
        $positive = (float) $this->discussionRow()->hotness;
        $this->assertGreaterThan(0, $positive);

        // A net-negative discussion mirrors it: same magnitude, opposite sign.
        $this->vote(self::VOTER, 'down');
        $this->assertSame(-$positive, (float) $this->discussionRow()->hotness);

        $this->vote(self::VOTER, null);
        $this->assertSame(0.0, (float) $this->discussionRow()->hotness);
    }

    #[Test]
    public function only_the_first_posts_votes_reach_the_discussion_tally()
    {
        // firstPostOnly is off, so the reply is votable — but a discussion's
        // tally is defined as its first post's votes, not the sum of all posts.
        $this->boot(['fof-gamification.firstPostOnly' => 0]);

        $this->vote(self::VOTER, 'up', 2);

        $this->assertSame([self::VOTER => 1], $this->voteRows(2));
        $this->assertSame(1, $this->authorVotes(), 'the author is credited for the reply');
        $this->assertSame(0, (int) $this->discussionRow()->votes, 'but the discussion tally is unmoved');
    }

    #[Test]
    public function a_vote_on_a_reply_is_refused_while_first_post_only_is_on()
    {
        $this->boot();

        $this->assertSame(403, $this->vote(self::VOTER, 'up', 2));
        $this->assertSame([], $this->voteRows(2));
        $this->assertSame(0, $this->authorVotes());
    }

    #[Test]
    public function the_author_can_vote_on_their_own_post_by_default()
    {
        $this->boot();

        $this->assertSame(200, $this->vote(self::AUTHOR, 'up'));
        $this->assertSame(1, $this->authorVotes(), 'and it counts toward their own total');
    }

    #[Test]
    public function disabling_self_votes_refuses_the_authors_vote_and_records_nothing()
    {
        $this->boot(['fof-gamification.allowSelfVotes' => 0]);

        $this->assertSame(403, $this->vote(self::AUTHOR, 'up'));
        $this->assertSame([], $this->voteRows());
        $this->assertSame(0, $this->authorVotes());
    }

    #[Test]
    public function a_user_without_the_vote_permission_is_refused()
    {
        $this->boot();

        // User 1 is the admin, so use a member outside the voter group: revoke
        // the group's permission instead.
        $this->database()->table('group_permission')
            ->where('permission', 'discussion.votePosts')->delete();

        $this->assertSame(403, $this->vote(self::VOTER, 'up'));
        $this->assertSame([], $this->voteRows());
    }

    #[Test]
    public function a_vote_on_an_untagged_discussion_is_refused_and_records_nothing()
    {
        // The tag gate applies to the write path too, not just to what is
        // serialized: a refused vote must leave no row and move no tally.
        $this->boot();

        $this->assertSame(403, $this->vote(self::VOTER, 'up', 3));
        $this->assertSame([], $this->voteRows(3));
        $this->assertSame(0, $this->authorVotes());
    }

    #[Test]
    public function a_guest_cannot_vote()
    {
        $this->boot();

        // Authenticated requests get the CSRF bypass for free via
        // authenticatedAs; a guest request has to ask for it, or the response
        // is a CSRF failure rather than the authorization outcome under test.
        $response = $this->send(
            $this->request('PATCH', '/api/posts/1', [
                'json' => ['data' => ['attributes' => ['vote' => 'up']]],
            ])->withAttribute('bypassCsrfToken', true)
        );

        $this->assertSame(401, $response->getStatusCode());
        $this->assertSame([], $this->voteRows());
    }
}
