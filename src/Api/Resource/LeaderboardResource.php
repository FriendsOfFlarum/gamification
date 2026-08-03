<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api\Resource;

use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractResource;
use Flarum\Api\Resource\Contracts\Countable;
use Flarum\Api\Resource\Contracts\Listable;
use Flarum\Api\Resource\Contracts\Paginatable;
use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Exception\PermissionDeniedException;
use Flarum\User\User;
use FoF\Gamification\Leaderboard\MetricRegistry;
use FoF\Gamification\Leaderboard\Period;
use Tobyz\JsonApiServer\Context as OriginalContext;
use Tobyz\JsonApiServer\Pagination\OffsetPagination;
use Tobyz\JsonApiServer\Schema\CustomFilter;

/**
 * A ranked leaderboard.
 *
 * Entries are computed rather than stored, so this is not a database resource:
 * there is no leaderboard table, and the same people come back in a different
 * order — with different scores — depending on the metric and period asked
 * for. The user is a relationship so the client gets avatars and display names
 * through the ordinary include, and the entry carries only what is true of
 * that person *in this ranking*: their position and their score.
 */
class LeaderboardResource extends AbstractResource implements Listable, Countable, Paginatable
{
    public function __construct(
        protected MetricRegistry $metrics,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function type(): string
    {
        return 'leaderboard-entries';
    }

    public function getId(object $model, OriginalContext $context): string
    {
        // There is no stored row to take an id from, so it is composed — and
        // it has to name the ranking, not just the place in it. A bare
        // position means entry "11" of the yearly board and entry "11" of the
        // monthly one are the same record to a client store that caches by
        // type and id, so switching metric or period hands back whichever was
        // fetched first and the new figures never appear.
        return implode(':', [$model->metric, $model->period, $model->position]);
    }

    public function endpoints(): array
    {
        return [
            // The route is `/api/{type}`; core prefixes the resource type
            // itself, so there is no path to declare here.
            Endpoint\Index::make()
                ->defaultInclude(['user'])
                ->paginate(10, 50)
                // Where the viewer stands. No page of entries can express it:
                // somebody in 87th place never appears in the top twenty, and
                // their own position is what they opened the page to find.
                // Always present, so the client can tell "not ranked" from
                // "not asked".
                ->meta([
                    Schema\Arr::make('standing')
                        ->get(fn (OriginalContext $context) => $this->standingFor($context)),

                    // Who is worth calling out beyond the top three. Document
                    // meta rather than entries: these describe the board, not
                    // any one row, and the people named are usually not on the
                    // page being shown.
                    Schema\Arr::make('highlights')
                        ->get(fn (OriginalContext $context) => $this->highlightsFor($context)),
                ]),
        ];
    }

    /**
     * @return array{position: int, score: int}|null
     */
    private function standingFor(OriginalContext $context): ?array
    {
        $filter = $context->request->getQueryParams()['filter'] ?? [];

        $metric = $this->metrics->get((string) ($filter['metric'] ?? '')) ?? $this->metrics->default();

        if ($metric === null) {
            return null;
        }

        return $this->metrics->standingFor(
            $metric,
            Period::fromRequest($filter['period'] ?? null, Period::configured($this->settings))->since(),
            $context->getActor()->id
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function highlightsFor(OriginalContext $context): array
    {
        $filter = $context->request->getQueryParams()['filter'] ?? [];

        $metric = $this->metrics->get((string) ($filter['metric'] ?? '')) ?? $this->metrics->default();

        if ($metric === null) {
            return [];
        }

        $period = Period::fromRequest($filter['period'] ?? null, Period::configured($this->settings));

        $highlights = $this->metrics->highlightsFor($metric, $period);

        if ($highlights === []) {
            return [];
        }

        // Resolve the named people in one query so the client has names and
        // avatars without a second round trip.
        $users = User::query()
            // Serializing a user reads its groups, which would otherwise be
            // fetched one user at a time.
            ->with('groups')
            ->whereIn('id', array_column($highlights, 'userId'))
            ->get()
            ->keyBy('id');

        $resolved = [];

        foreach ($highlights as $key => $highlight) {
            $user = $users->get($highlight['userId']);

            if ($user === null) {
                continue;
            }

            $resolved[$key] = $highlight + [
                'username'    => $user->username,
                'displayName' => $user->display_name,
                'avatarUrl'   => $user->avatar_url,
                'slug'        => $user->slug ?? $user->username,
            ];
        }

        return $resolved;
    }

    public function fields(): array
    {
        return [
            Schema\Number::make('position'),
            Schema\Number::make('score'),

            // Places gained since the previous window, or the string "new"
            // for somebody who was not on the board at all last time. Null
            // only for all-time, which has no previous window.
            Schema\Str::make('movement')
                ->nullable()
                ->get(fn (object $entry) => $entry->movement === null ? null : (string) $entry->movement),

            Schema\Relationship\ToOne::make('user')
                ->type('users')
                ->includable()
                ->get(fn (object $entry) => $entry->user),
        ];
    }

    public function filters(): array
    {
        // Not filters in the narrowing sense — they choose which ranking is
        // computed, so the same person comes back with a different score and
        // position. They live here because JSON:API reserves the top-level
        // query namespace, and `filter` is the only place a resource may put
        // parameters of its own.
        //
        // Both rebuild the query rather than constrain it, and either may
        // arrive first, so each re-reads the other from the request.
        return [
            CustomFilter::make('metric', function (object $query, string|array $value, OriginalContext $context) {
                $this->rebuild($query, $context);
            }),
            CustomFilter::make('period', function (object $query, string|array $value, OriginalContext $context) {
                $this->rebuild($query, $context);
            }),
        ];
    }

    /**
     * Resolve the metric and period currently named on the request, and put
     * the matching ranking query on the descriptor.
     */
    private function rebuild(object $query, OriginalContext $context): void
    {
        $filter = $context->request->getQueryParams()['filter'] ?? [];

        // An unrecognised metric falls back rather than erroring: the value
        // comes off a query string, so it may be a stale link, or a metric
        // whose extension has since been disabled.
        $metric = $this->metrics->get((string) ($filter['metric'] ?? '')) ?? $this->metrics->default();

        if ($metric === null) {
            $query->query = null;

            return;
        }

        $period = Period::fromRequest($filter['period'] ?? null, Period::configured($this->settings));

        $query->query = $this->metrics->rankingQuery($metric, $period->since());
        $query->metric = $metric;
        $query->period = $period;
        $query->since = $period->since();
    }

    public function sorts(): array
    {
        // The order is the whole point of a ranking, so it is not the client's
        // to change.
        return [];
    }

    public function resolveSorts(): array
    {
        return [];
    }

    /**
     * Describes the ranking being asked for.
     */
    public function query(OriginalContext $context): object
    {
        $actor = $context->getActor();

        if ($actor->cannot('fof.gamification.viewRankingPage')) {
            throw new PermissionDeniedException();
        }

        // Starts as the default ranking; the metric and period filters swap in
        // another if the request named one.
        $descriptor = (object) ['query' => null, 'metric' => null, 'period' => Period::configured($this->settings)];

        $this->rebuild($descriptor, $context);

        return $descriptor;
    }

    /**
     * The framework hands us the page it wants; record it so results() can
     * both fetch that slice and number the entries from it.
     */
    public function paginate(object $query, OffsetPagination $pagination): void
    {
        $query->limit = $pagination->limit;
        $query->offset = $pagination->offset;
    }

    public function results(object $query, OriginalContext $context): iterable
    {
        if ($query->query === null) {
            return [];
        }

        $offset = $query->offset ?? 0;
        $limit = $query->limit;

        $rows = (clone $query->query)
            ->when($limit !== null, fn ($q) => $q->limit($limit))
            ->offset($offset)
            ->get();

        // Two queries for the page, not two per row: the movement map covers
        // everybody, and is only computed when the period has a previous
        // window to compare against.
        $movement = $this->metrics->movementFor($query->metric, $query->period);

        // One query for the whole page rather than one per row.
        $users = User::query()
            ->with('groups')
            ->whereIn('id', $rows->pluck('user_id')->all())
            ->get()
            ->keyBy('id');

        $entries = [];

        foreach ($rows as $index => $row) {
            $user = $users->get($row->user_id);

            if ($user === null) {
                continue;
            }

            $entries[] = (object) [
                // Carried so the entry can identify which ranking it belongs
                // to; see getId().
                'metric'   => $query->metric->key(),
                'period'   => $query->period->value,
                // Counted from the offset, so the second page carries on from
                // where the first stopped rather than restarting at one.
                'position' => $offset + $index + 1,
                'score'    => (int) $row->score,
                'movement' => $movement[(int) $row->user_id] ?? null,
                'user'     => $user,
            ];
        }

        return $entries;
    }

    public function count(object $query, OriginalContext $context): ?int
    {
        if ($query->query === null) {
            return 0;
        }

        // Counted from the ranking this request already computed. Asking the
        // database again means a second aggregate over every post in the
        // period purely to size the pager.
        return $this->metrics->ranking($query->metric, $query->since)->count();
    }
}
