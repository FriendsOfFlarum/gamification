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
use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\LeaderboardEligibility;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Who may appear on the leaderboard.
 *
 * The three exclusion reasons are asserted separately because they behave
 * differently: the admin's own list and the group list are preferences,
 * suspension lapses on its own, and anonymisation is not configurable.
 */
class LeaderboardEligibilityTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    /**
     * @param array<string, mixed> $settings
     * @param string[]             $extensions gamification is always enabled
     */
    private function boot(array $settings = [], array $extensions = [], bool $suspended = false, bool $anonymised = false): void
    {
        foreach ($settings as $key => $value) {
            $this->setting($key, $value);
        }

        $this->extension('fof-gamification', ...$extensions);

        $alice = $this->userWithVotes(3, 'alice', 50);
        $bob = $this->userWithVotes(4, 'bob', 200);
        $carol = $this->userWithVotes(5, 'carol', 100);

        if ($suspended) {
            // Suspended well into the future, so it has not lapsed.
            $alice['suspended_until'] = Carbon::now()->addYear()->toDateTimeString();
        }

        if ($anonymised) {
            $alice['anonymized'] = true;
        }

        $this->prepareDatabase([
            User::class => [$this->normalUser(), $alice, $bob, $carol],
            Group::class => [
                ['id' => 100, 'name_singular' => 'Staff', 'name_plural' => 'Staff'],
            ],
            'group_user' => [
                ['user_id' => 5, 'group_id' => 100],
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
     * @return string[]
     */
    private function rankedUsernames(): array
    {
        $response = $this->send(
            $this->request('GET', '/api/users', ['authenticatedAs' => 1])
                ->withQueryParams(['filter' => ['rankable' => 'true'], 'sort' => '-votes'])
        );

        $this->assertEquals(200, $response->getStatusCode(), $response->getBody()->__toString());

        $data = json_decode($response->getBody()->__toString(), true)['data'];
        $names = array_map(fn ($user) => $user['attributes']['username'] ?? null, $data);

        return array_values(array_intersect($names, ['alice', 'bob', 'carol']));
    }

    #[Test]
    public function everyone_ranks_by_default()
    {
        $this->boot();

        $this->assertEquals(['bob', 'carol', 'alice'], $this->rankedUsernames());
    }

    #[Test]
    public function users_the_admin_excluded_do_not_rank()
    {
        $this->boot([LeaderboardEligibility::EXCLUDED_USERS => json_encode([3])]);

        $this->assertEquals(['bob', 'carol'], $this->rankedUsernames());
    }

    #[Test]
    public function members_of_an_excluded_group_do_not_rank()
    {
        $this->boot([LeaderboardEligibility::EXCLUDED_GROUPS => json_encode([100])]);

        // Carol is the only member of group 100.
        $this->assertEquals(['bob', 'alice'], $this->rankedUsernames());
    }

    #[Test]
    public function suspended_users_do_not_rank_when_the_setting_is_on()
    {
        $this->boot(
            [LeaderboardEligibility::EXCLUDE_SUSPENDED => true],
            ['flarum-suspend'],
            suspended: true
        );

        $this->assertEquals(['bob', 'carol'], $this->rankedUsernames());
    }

    #[Test]
    public function suspended_users_rank_when_the_setting_is_off()
    {
        $this->boot(
            [LeaderboardEligibility::EXCLUDE_SUSPENDED => false],
            ['flarum-suspend'],
            suspended: true
        );

        $this->assertEquals(['bob', 'carol', 'alice'], $this->rankedUsernames());
    }

    /**
     * A suspension with a past date is over, so it must not keep anyone off the
     * board — this mirrors how flarum/suspend itself reads the column.
     */
    #[Test]
    public function an_expired_suspension_does_not_exclude()
    {
        $this->setting(LeaderboardEligibility::EXCLUDE_SUSPENDED, true);
        $this->extension('fof-gamification', 'flarum-suspend');

        $alice = $this->userWithVotes(3, 'alice', 50);
        $alice['suspended_until'] = Carbon::now()->subDay()->toDateTimeString();

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                $alice,
                $this->userWithVotes(4, 'bob', 200),
                $this->userWithVotes(5, 'carol', 100),
            ],
        ]);

        $this->assertEquals(['bob', 'carol', 'alice'], $this->rankedUsernames());
    }

    /**
     * Anonymisation is a request to be erased, and it is honoured whatever the
     * admin has configured — there is deliberately no setting for this.
     */
    #[Test]
    public function anonymised_users_never_rank()
    {
        $this->boot([], ['flarum-gdpr'], anonymised: true);

        $this->assertEquals(['bob', 'carol'], $this->rankedUsernames());
    }

    /**
     * The exclusions must not depend on optional extensions being installed:
     * with neither enabled the columns they read may not even exist.
     */
    #[Test]
    public function exclusions_work_without_the_optional_extensions()
    {
        $this->boot([LeaderboardEligibility::EXCLUDED_USERS => json_encode([3])]);

        $this->assertEquals(['bob', 'carol'], $this->rankedUsernames());
    }
}
