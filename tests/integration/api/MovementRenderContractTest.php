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
use Flarum\Post\Post;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Movement has to reach the rows below the podium, not just the viewer's own.
 *
 * It is computed for the whole board but only rendered from fourth place down,
 * so an off-by-one or a lookup keyed on the wrong thing shows up as arrows
 * appearing for one person and nobody else.
 */
class MovementRenderContractTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow(Carbon::parse('2026-08-12 12:00:00'));
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    /**
     * Six people ranked in both months, in a different order each time.
     */
    private function boot(): void
    {
        $this->extension('fof-gamification');

        $now = Carbon::now();
        $thisMonth = $now->copy()->startOfMonth()->addDay();
        $lastMonth = $now->copy()->startOfMonth()->subMonth()->addDay();

        $users = [$this->normalUser()];
        $posts = [];
        $id = 1;

        // Last month: 3 > 4 > 5 > 6 > 7. This month the order reverses.
        $plan = [
            [3, $lastMonth, 20], [3, $thisMonth, 1],
            [4, $lastMonth, 16], [4, $thisMonth, 4],
            [5, $lastMonth, 12], [5, $thisMonth, 8],
            [6, $lastMonth, 8],  [6, $thisMonth, 12],
            [7, $lastMonth, 4],  [7, $thisMonth, 16],
        ];

        foreach ([3, 4, 5, 6, 7] as $uid) {
            $users[] = ['id' => $uid, 'username' => "u$uid", 'email' => "u$uid@machine.local", 'is_email_confirmed' => 1];
        }

        foreach ($plan as [$uid, $when, $count]) {
            for ($i = 0; $i < $count; $i++) {
                $posts[] = ['id' => $id++, 'discussion_id' => 1, 'number' => $id, 'created_at' => $when->toDateTimeString(), 'user_id' => $uid, 'type' => 'comment', 'content' => '<t><p>x</p></t>'];
            }
        }

        $this->prepareDatabase([
            User::class => $users,
            Discussion::class => [
                ['id' => 1, 'title' => 'D', 'created_at' => $now->toDateTimeString(), 'last_posted_at' => $now->toDateTimeString(), 'user_id' => 3, 'first_post_id' => 1, 'comment_count' => count($posts), 'is_private' => 0],
            ],
            Post::class => $posts,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function entries(): array
    {
        $response = $this->send(
            $this->request('GET', '/api/leaderboard-entries', ['authenticatedAs' => 1])
                ->withQueryParams(['filter' => ['metric' => 'posts', 'period' => 'month']])
        );

        $this->assertEquals(200, $response->getStatusCode());

        return json_decode($response->getBody()->__toString(), true)['data'];
    }

    /**
     * The rows the page actually renders arrows on start at fourth place, so
     * those are the ones that have to carry a value.
     */
    #[Test]
    public function every_row_below_the_podium_reports_its_movement()
    {
        $this->boot();

        $below = array_slice($this->entries(), 3);

        $this->assertNotEmpty($below, 'the fixture must produce rows beyond the podium');

        foreach ($below as $row) {
            $this->assertNotNull(
                $row['attributes']['movement'],
                "position {$row['attributes']['position']} should report movement"
            );
        }
    }

    #[Test]
    public function movement_is_reported_for_every_ranked_person_not_only_the_viewer()
    {
        $this->boot();

        $movements = array_map(fn ($row) => $row['attributes']['movement'], $this->entries());

        // Nobody is absent from the previous month, so nobody should be null.
        $this->assertNotContains(null, $movements);

        // And the board genuinely reordered, so it cannot be all zeroes.
        $this->assertNotEmpty(array_filter($movements), 'the fixture reverses the order, so people must have moved');
    }
}
