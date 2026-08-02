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

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * The `rankable` filter decides who appears on the rankings page, so the
 * excluded-users setting is the only thing keeping an admin's chosen names off
 * it.
 *
 * The list is stored as free text, which means the parsing has to cope with
 * however an admin actually typed it, and the filter has to stay closed no
 * matter what the caller passes as the filter value.
 */
class RankableExclusionTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    /**
     * Seed with a fixed excluded-users setting.
     *
     * Settings must be staged before anything boots the app, so each test calls
     * this instead of setUp() doing it once.
     */
    private function boot(string $blockedUsers): void
    {
        $this->setting('fof-gamification.blockedUsers', $blockedUsers);

        $this->extension('fof-gamification');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                $this->userWithVotes(3, 'alice', 50),
                $this->userWithVotes(4, 'bob', 200),
                $this->userWithVotes(5, 'carol', 100),
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function userWithVotes(int $id, string $username, int $votes): array
    {
        return [
            'id'                 => $id,
            'username'           => $username,
            'email'              => "{$username}@machine.local",
            'is_email_confirmed' => 1,
            'votes'              => $votes,
        ];
    }

    /**
     * @param array<string, mixed> $filter
     *
     * @return string[] the usernames returned, in response order
     */
    private function rankedUsernames(array $filter = ['rankable' => 'true']): array
    {
        $response = $this->send(
            $this->request('GET', '/api/users', ['authenticatedAs' => 1])
                ->withQueryParams(['filter' => $filter, 'sort' => '-votes'])
        );

        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->__toString());

        $data = json_decode($response->getBody()->__toString(), true)['data'];

        $names = array_map(fn ($user) => $user['attributes']['username'] ?? null, $data);

        // Only the seeded users are of interest; the actor is incidental.
        return array_values(array_intersect($names, ['alice', 'bob', 'carol']));
    }

    #[Test]
    public function an_empty_setting_excludes_nobody()
    {
        $this->boot('');

        $this->assertEquals(['bob', 'carol', 'alice'], $this->rankedUsernames());
    }

    #[Test]
    public function a_comma_space_list_excludes_those_users()
    {
        $this->boot('alice, carol');

        $this->assertEquals(['bob'], $this->rankedUsernames());
    }

    /**
     * The separator an admin is most likely to type. Splitting on a literal
     * ', ' leaves this as one unmatched name, so nobody is excluded and the
     * setting silently does nothing.
     */
    #[Test]
    public function a_list_without_spaces_still_excludes_those_users()
    {
        $this->boot('alice,carol');

        $this->assertEquals(['bob'], $this->rankedUsernames());
    }

    /**
     * Stray whitespace and trailing separators are ordinary in a free-text
     * field and must not turn into empty names that match nothing.
     */
    #[Test]
    public function untidy_input_is_parsed_forgivingly()
    {
        $this->boot("  alice ,\tcarol , ");

        $this->assertEquals(['bob'], $this->rankedUsernames());
    }

    /**
     * The filter value comes from the query string. Negating it must not turn
     * the exclusion inside out and hand back precisely the list of people the
     * admin asked to hide.
     */
    #[Test]
    public function negating_the_filter_cannot_enumerate_the_excluded_users()
    {
        $this->boot('alice, carol');

        $names = $this->rankedUsernames(['-rankable' => 'true']);

        $this->assertNotContains('alice', $names, 'a negated filter must not reveal excluded users');
        $this->assertNotContains('carol', $names, 'a negated filter must not reveal excluded users');
    }
}
