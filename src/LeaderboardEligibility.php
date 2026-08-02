<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification;

use Carbon\Carbon;
use Flarum\Extension\ExtensionManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Decides who may appear on the leaderboard.
 *
 * Every metric answers a different question — votes received, posts written,
 * best answers — but they all answer it about the same set of people. Keeping
 * that set in one place means a new metric cannot forget to apply it, which is
 * the failure this class exists to prevent.
 *
 * Exclusions come from three places with genuinely different natures:
 *
 *  - users and groups the admin has chosen to hide, which is a preference;
 *  - suspended users, which is temporary and lapses on its own;
 *  - anonymised users, which is a standing legal obligation and so is not
 *    configurable at all.
 */
class LeaderboardEligibility
{
    public const EXCLUDED_USERS = 'fof-gamification.excludedUsers';
    public const EXCLUDED_GROUPS = 'fof-gamification.excludedGroups';
    public const EXCLUDE_SUSPENDED = 'fof-gamification.excludeSuspended';

    /**
     * Whether the columns the optional exclusions read actually exist,
     * resolved once per request.
     */
    private ?bool $suspendEnabled = null;
    private ?bool $gdprEnabled = null;

    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected ExtensionManager $extensions
    ) {
    }

    /**
     * Split the pre-migration free-text exclusion list into usernames.
     *
     * Lives here rather than in the migration so the migration and the legacy
     * fallback in RankableFilter cannot disagree about what the admin typed.
     *
     * @return string[]
     */
    public static function parseLegacyUsernames(?string $setting): array
    {
        if ($setting === null || trim($setting) === '') {
            return [];
        }

        return array_values(array_filter(
            array_map('trim', preg_split('/\s*,\s*/', trim($setting)) ?: []),
            fn (string $username) => $username !== ''
        ));
    }

    /**
     * Restrict a query on `users` to those eligible for the leaderboard.
     *
     * @param Builder<\Flarum\User\User>|QueryBuilder $query
     */
    public function constrain(Builder|QueryBuilder $query): void
    {
        $this->excludeChosenUsers($query);
        $this->excludeChosenGroups($query);
        $this->excludeSuspended($query);
        $this->excludeAnonymised($query);
    }

    /**
     * @param Builder<\Flarum\User\User>|QueryBuilder $query
     */
    private function excludeChosenUsers(Builder|QueryBuilder $query): void
    {
        if ($ids = $this->idsFromSetting(self::EXCLUDED_USERS)) {
            $query->whereNotIn('users.id', $ids);
        }
    }

    /**
     * @param Builder<\Flarum\User\User>|QueryBuilder $query
     */
    private function excludeChosenGroups(Builder|QueryBuilder $query): void
    {
        $ids = $this->idsFromSetting(self::EXCLUDED_GROUPS);

        if ($ids === []) {
            return;
        }

        // A user is excluded by belonging to any one of the groups, so this
        // asks the pivot directly rather than loading each user's groups.
        $query->whereNotExists(function ($sub) use ($ids) {
            $sub->selectRaw('1')
                ->from('group_user')
                ->whereColumn('group_user.user_id', 'users.id')
                ->whereIn('group_user.group_id', $ids);
        });
    }

    /**
     * @param Builder<\Flarum\User\User>|QueryBuilder $query
     */
    private function excludeSuspended(Builder|QueryBuilder $query): void
    {
        if (!$this->suspendIsEnabled() || !$this->settings->get(self::EXCLUDE_SUSPENDED)) {
            return;
        }

        // Mirrors flarum/suspend's own filter: a suspension that has expired
        // is no longer a suspension.
        $query->where(function ($outer) {
            $outer->whereNull('users.suspended_until')
                ->orWhere('users.suspended_until', '<', Carbon::now());
        });
    }

    /**
     * @param Builder<\Flarum\User\User>|QueryBuilder $query
     */
    private function excludeAnonymised(Builder|QueryBuilder $query): void
    {
        if (!$this->gdprIsEnabled()) {
            return;
        }

        // Deliberately not configurable. Anonymisation is a user exercising
        // their right to erasure, and their posts — and so their score —
        // survive it. Ranking them anyway would keep publishing a profile for
        // someone who asked to be erased.
        $query->where('users.anonymized', false);
    }

    /**
     * @return int[]
     */
    private function idsFromSetting(string $key): array
    {
        $raw = $this->settings->get($key);

        if ($raw === null || $raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);

        if (!is_array($decoded)) {
            return [];
        }

        return array_values(array_filter(array_map('intval', $decoded)));
    }

    private function suspendIsEnabled(): bool
    {
        return $this->suspendEnabled ??= $this->extensions->isEnabled('flarum-suspend');
    }

    private function gdprIsEnabled(): bool
    {
        return $this->gdprEnabled ??= $this->extensions->isEnabled('flarum-gdpr');
    }
}
