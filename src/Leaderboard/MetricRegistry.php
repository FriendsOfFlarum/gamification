<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Leaderboard;

use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Gamification\LeaderboardEligibility;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;

/**
 * The metrics available to the leaderboard, and the one place their queries
 * are turned into results.
 *
 * Running the query here rather than in each metric is deliberate: eligibility
 * is applied on the way through, so a metric — including one registered by
 * another extension — cannot rank somebody who should not be ranked.
 */
class MetricRegistry
{
    /**
     * Which ranking the leaderboard opens on.
     */
    public const DEFAULT_METRIC = 'fof-gamification.defaultMetric';

    /**
     * Reported instead of a number of places when somebody was not ranked in
     * the previous window at all.
     *
     * A sentinel rather than null or zero: null reads as "nothing to say",
     * which is how this used to behave and left the whole feature blank on any
     * forum with uneven history, and zero would be indistinguishable from
     * holding position. Arriving is its own event and is shown as one.
     */
    public const MOVEMENT_NEW = 'new';

    /**
     * A newcomer must not be leading the board.
     *
     * Somebody in first place is established by definition, whatever the
     * previous window says about them.
     */
    private const NEWCOMER_MAX_POSITION = 1;

    /**
     * How much of the board must have been there before, for "new" to mean
     * anything.
     *
     * If almost nobody was ranked in the previous window then everybody looks
     * new — which happens for real on a forum with a gap in its history, or
     * when the earliest period is being viewed. Naming one of them a new face
     * says nothing true, so the award is withheld instead.
     */
    private const NEWCOMER_MIN_RETURNING = 0.5;

    /**
     * @var array<string, MetricInterface>
     */
    private array $metrics = [];

    /**
     * Rankings already computed during this request, keyed by metric and
     * window.
     *
     * One page asks for the same ranking several times over — the entries
     * themselves, the movement column, the viewer's standing and the
     * highlights — and each was scanning every post in the period again. The
     * results cannot change mid-request, so they are computed once.
     *
     * Deliberately per instance, and the registry is bound per request: two
     * page loads a second apart must not share an answer.
     *
     * @var array<string, \Illuminate\Support\Collection<int, object>>
     */
    private array $rankings = [];

    public function __construct(
        protected LeaderboardEligibility $eligibility,
        protected ConnectionInterface $connection,
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function add(MetricInterface $metric): void
    {
        $this->metrics[$metric->key()] = $metric;
    }

    /**
     * @return array<string, MetricInterface>
     */
    public function all(): array
    {
        return $this->metrics;
    }

    public function has(string $key): bool
    {
        return isset($this->metrics[$key]);
    }

    public function get(string $key): ?MetricInterface
    {
        return $this->metrics[$key] ?? null;
    }

    /**
     * The ranking shown to someone who has not chosen one.
     *
     * The admin's choice, since forums differ in what they want to celebrate.
     * Where they have not chosen, posts written: net score is a poor first
     * impression, because it can be negative, it bunches everyone who has been
     * voted both ways near zero, and it needs explaining before the number
     * means anything. Participation is what most members can actually move.
     *
     * A configured metric that no longer exists — its extension disabled, or
     * the key mistyped — falls through rather than leaving the page with
     * nothing to show.
     */
    public function default(): ?MetricInterface
    {
        $configured = (string) $this->settings->get(self::DEFAULT_METRIC);

        return $this->metrics[$configured]
            ?? $this->metrics[Metric\PostsWritten::KEY]
            ?? (reset($this->metrics) ?: null);
    }

    /**
     * Build the eligible, ordered ranking query for a metric.
     *
     * The metric supplies `user_id` and `score`; this wraps it so that only
     * users who may be ranked come back, and so that the ordering is applied
     * consistently rather than being each metric's problem.
     */
    /**
     * The ranking as rows, computed once per metric and window.
     *
     * Prefer this to running rankingQuery() directly wherever the whole
     * ranking is wanted; the query builder is still exposed for the paginated
     * slice, which is bounded work and differs per page.
     *
     * @return \Illuminate\Support\Collection<int, object>
     */
    public function ranking(MetricInterface $metric, ?\DateTimeInterface $since, ?\DateTimeInterface $until = null): Collection
    {
        $key = implode('|', [
            $metric->key(),
            $since?->format('c') ?? '',
            $until?->format('c') ?? '',
        ]);

        return $this->rankings[$key] ??= $this->rankingQuery($metric, $since, $until)->get();
    }

    public function rankingQuery(MetricInterface $metric, ?\DateTimeInterface $since, ?\DateTimeInterface $until = null): Builder
    {
        $inner = $metric->supportsPeriods()
            ? $metric->query($since, $until)
            : $metric->query(null);

        $query = $this->connection
            ->query()
            ->fromSub($inner, 'scores')
            ->select('scores.user_id', 'scores.score')
            ->join('users', 'users.id', '=', 'scores.user_id');

        // Applied here, around every metric, rather than inside them.
        $this->eligibility->constrain($query);

        return $query
            ->orderByDesc('scores.score')
            // Ties would otherwise come back in whatever order the database
            // felt like, which makes paging through them lose and repeat rows.
            ->orderBy('scores.user_id');
    }

    /**
     * How many places each person has moved since the previous window.
     *
     * Positive is a climb, negative a drop, and MOVEMENT_NEW means they were
     * not on the board at all last time — a distinct event rather than a
     * climb from nowhere.
     *
     * @return array<int, int|string> user id => places moved, or MOVEMENT_NEW
     */
    public function movementFor(MetricInterface $metric, Period $period): array
    {
        $window = $metric->supportsPeriods() ? $period->previousWindow() : null;

        if ($window === null) {
            return [];
        }

        $before = $this->positions($this->ranking($metric, $window[0], $window[1]));
        $now = $this->positions($this->ranking($metric, $period->since()));

        $movement = [];

        foreach ($now as $userId => $position) {
            // Not ranked last time: an arrival, which is a different event
            // from moving and is reported as one.
            $movement[$userId] = isset($before[$userId])
                // Places, plainly. Somebody who was 1st and is now 11th is ten
                // places lower, and it does not matter to them whether the
                // people above arrived or overtook — the position they hold is
                // the thing they see, and it has changed.
                ? $before[$userId] - $position
                : self::MOVEMENT_NEW;
        }

        return $movement;
    }

    /**
     * The people worth calling out beyond the top three.
     *
     * A board ranked on a lifetime total is settled years in advance, and
     * says to everybody else that turning up changes nothing. These stay
     * winnable whoever is top: the biggest climb, who turned up most
     * regularly, and whoever has just arrived.
     *
     * Empty for all-time, which has no window before it to compare against.
     *
     * @return array<string, array{userId: int, score?: int, places?: int}>
     */
    public function highlightsFor(MetricInterface $metric, Period $period): array
    {
        $window = $metric->supportsPeriods() ? $period->previousWindow() : null;

        if ($window === null) {
            return [];
        }

        $current = $this->ranking($metric, $period->since());

        if ($current->isEmpty()) {
            return [];
        }

        $before = $this->positions($this->ranking($metric, $window[0], $window[1]));

        $highlights = [];

        // Deliberately no "busiest" card. The top of this window is already
        // the podium winner, so naming them again says nothing — and naming
        // the best of the rest instead says something false. A highlight has
        // to ask a different question from the table, not re-slice its
        // answer.
        //
        // Awards are claimed in order and each skips whoever is already
        // named: two badges on one person tells the reader a single fact
        // twice, when the point of these is to widen who gets noticed.
        $taken = [];

        // Climber: the biggest gain in places.
        $bestClimb = 0;
        $place = 0;
        $positions = [];

        foreach ($current as $row) {
            $userId = (int) $row->user_id;
            $positions[$userId] = ++$place;

            if (!isset($before[$userId])) {
                continue;
            }

            $climb = $before[$userId] - $positions[$userId];

            if ($climb > $bestClimb) {
                $bestClimb = $climb;
                $highlights['climber'] = ['userId' => $userId, 'places' => $climb];
            }
        }

        if (isset($highlights['climber'])) {
            $taken[$highlights['climber']['userId']] = true;
        }

        // Most consistent: active on the most separate days.
        //
        // The one thing a total cannot express. Somebody posting a little
        // most days is doing something the board never notices, and it is a
        // far more reachable thing to be than the busiest person here.
        $activity = $metric->activityQuery($period->since());

        if ($activity !== null) {
            $days = $this->connection
                ->query()
                ->fromSub($activity, 'activity')
                ->select('activity.user_id')
                ->selectRaw('COUNT(DISTINCT DATE('.$this->connection->getTablePrefix().'activity.happened_at)) as days')
                ->groupBy('activity.user_id')
                ->orderByDesc('days')
                ->orderBy('activity.user_id')
                ->get();

            foreach ($days as $row) {
                $userId = (int) $row->user_id;

                // Only where they are actually ranked — eligibility applies
                // to this award as much as to the board itself — and only if
                // the day count says something a single burst would not.
                if (isset($taken[$userId]) || !isset($positions[$userId]) || (int) $row->days < 2) {
                    continue;
                }

                $highlights['consistent'] = ['userId' => $userId, 'days' => (int) $row->days];
                $taken[$userId] = true;

                break;
            }
        }

        // Newcomer: ranked now, absent before — but only where there was an
        // established board to be new to. See NEWCOMER_MIN_RETURNING.
        $returning = 0;

        foreach ($current as $row) {
            if (isset($before[(int) $row->user_id])) {
                $returning++;
            }
        }

        if ($returning < $current->count() * self::NEWCOMER_MIN_RETURNING) {
            return $highlights;
        }

        foreach ($current as $row) {
            $userId = (int) $row->user_id;

            if (isset($taken[$userId]) || isset($before[$userId]) || $positions[$userId] <= self::NEWCOMER_MAX_POSITION) {
                continue;
            }

            $highlights['newcomer'] = ['userId' => $userId, 'score' => (int) $row->score];

            break;
        }

        return $highlights;
    }

    /**
     * @param \Illuminate\Support\Collection<int, object> $ranking
     *
     * @return array<int, int> user id => 1-based position
     */
    private function positions(Collection $ranking): array
    {
        $positions = [];
        $place = 0;

        foreach ($ranking as $row) {
            $positions[(int) $row->user_id] = ++$place;
        }

        return $positions;
    }

    /**
     * Where one person stands in a ranking.
     *
     * A page of the top twenty cannot tell somebody they are 87th, and their
     * own position is the fact they came to look for. Counting how many people
     * are ahead of them answers it without paging through the whole board.
     *
     * @return array{position: int, score: int, toNext: int|null}|null null if
     *                                                                 they are not ranked at all
     *                                                                 — no score, or not eligible
     */
    public function standingFor(MetricInterface $metric, ?\DateTimeInterface $since, ?int $userId): ?array
    {
        if (!$userId) {
            return null;
        }

        // Read from the ranking rather than querying around it. It is already
        // ordered and already computed for this request, so the position, the
        // score and the gap to the place above are all a walk of rows that
        // have been fetched — where this used to be three more aggregates
        // over every post in the period.
        $ranking = $this->ranking($metric, $since);

        $place = 0;
        $previousScore = null;

        foreach ($ranking as $row) {
            $place++;

            if ((int) $row->user_id !== $userId) {
                $previousScore = (int) $row->score;

                continue;
            }

            $score = (int) $row->score;

            return [
                'position' => $place,
                'score'    => $score,
                // Null for the leader, who has nobody to catch.
                'toNext'   => $previousScore === null ? null : max(0, $previousScore - $score),
            ];
        }

        return null;
    }
}
