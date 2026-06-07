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

class RankingsTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-gamification');

        // The ranking query excludes "blocked" users; keep the list empty so the
        // sort is the only thing affecting order.
        $this->setting('fof-gamification.blockedUsers', '');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                $this->userWithVotes(3, 'fifty', 50),
                $this->userWithVotes(4, 'twohundred', 200),
                $this->userWithVotes(5, 'onehundred', 100),
            ],
        ]);
    }

    protected function userWithVotes(int $id, string $username, int $votes): array
    {
        return [
            'id'                 => $id,
            'username'           => $username,
            'password'           => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim', // "too-obscure"
            'email'              => "{$username}@machine.local",
            'is_email_confirmed' => 1,
            'votes'              => $votes,
        ];
    }

    /**
     * This is the contract the rankings page relies on (see issue #148): the
     * `rankable` filter combined with `sort=-votes` must return users ordered by
     * their vote total, descending — not by id.
     */
    #[Test]
    public function rankable_filter_sorts_users_by_votes_descending()
    {
        $response = $this->send(
            $this->request('GET', '/api/users', ['authenticatedAs' => 1])
                ->withQueryParams([
                    'filter' => ['rankable' => 'true'],
                    'sort'   => '-votes',
                ])
        );

        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->__toString());

        $data = json_decode($response->getBody()->__toString(), true)['data'];
        $returnedIds = array_map(fn ($user) => (int) $user['id'], $data);

        // Restrict to the users we seeded with known vote counts and assert their
        // relative order: 4 (200) > 5 (100) > 3 (50).
        $seededOrder = array_values(array_filter($returnedIds, fn ($id) => in_array($id, [3, 4, 5], true)));

        $this->assertEquals([4, 5, 3], $seededOrder);
    }

    /**
     * Documents the root cause of #148: when filter/sort were nested under
     * `page` (as the buggy frontend query did), the API ignores them and falls
     * back to its default id ordering instead of sorting by votes.
     */
    #[Test]
    public function nesting_filter_and_sort_under_page_is_ignored_by_the_api()
    {
        $response = $this->send(
            $this->request('GET', '/api/users', ['authenticatedAs' => 1])
                ->withQueryParams([
                    'page' => [
                        'filter' => ['rankable' => 'true'],
                        'sort'   => '-votes',
                        'limit'  => '10',
                    ],
                ])
        );

        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->__toString());

        $data = json_decode($response->getBody()->__toString(), true)['data'];
        $returnedIds = array_map(fn ($user) => (int) $user['id'], $data);
        $seededOrder = array_values(array_filter($returnedIds, fn ($id) => in_array($id, [3, 4, 5], true)));

        // The vote sort was ignored: users come back in id order, not [4, 5, 3].
        $this->assertEquals([3, 4, 5], $seededOrder);
    }
}
