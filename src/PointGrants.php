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

use Flarum\User\User;
use FoF\Gamification\Events\UserPointsUpdated;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\UniqueConstraintViolationException;
use InvalidArgumentException;

/**
 * Lets another extension give a member points.
 *
 * A member's points (`users.votes`) are recounted from their posts' votes, so
 * a value written there directly is lost on the next recount. A grant is kept
 * in its own table and added back by every recount instead.
 *
 * Each grant is identified by its source (the granting extension, such as
 * `onramp`) and a reason saying what it was for (such as `step:12`). Granting
 * the same source and reason twice gives the points once, so a caller can
 * grant without first checking whether it already has.
 *
 *     resolve(PointGrants::class)->grant($user, 'onramp', 'step:12', 10);
 */
class PointGrants
{
    /**
     * The longest source and reason, in characters; the lengths of their
     * columns in `gamification_point_grants`.
     */
    public const SOURCE_LENGTH = 100;
    public const REASON_LENGTH = 150;

    public function __construct(
        protected Dispatcher $events
    ) {
    }

    /**
     * Grant a member points, once per source and reason. The points may be
     * negative, but not zero.
     *
     * @throws InvalidArgumentException for a guest or unsaved user, zero
     *                                  points, or an over-long source or reason
     *
     * @return bool whether the grant was made; false if this source and reason
     *              had already been granted to the member
     */
    public function grant(User $user, string $source, string $reason, int $points): bool
    {
        $this->assertGrantable($user, $source, $reason);

        if ($points === 0) {
            throw new InvalidArgumentException('A point grant must give or take at least one point.');
        }

        if ($this->find($user, $source, $reason)->exists()) {
            return false;
        }

        $grant = new PointGrant();
        $grant->user_id = $user->id;
        $grant->source = $source;
        $grant->reason = $reason;
        $grant->points = $points;

        try {
            // A nested transaction, so that inside a caller's transaction a
            // refused insert rolls back to a savepoint instead of leaving
            // PostgreSQL's whole transaction aborted.
            $grant->getConnection()->transaction(fn () => $grant->save());
        } catch (UniqueConstraintViolationException) {
            // A concurrent request made the same grant between the check
            // above and this insert; the unique index kept it to one.
            return false;
        }

        $this->recount($user);

        return true;
    }

    /**
     * Take back a grant made by {@see grant()}.
     *
     * @throws InvalidArgumentException for a guest or unsaved user, or an
     *                                  over-long source or reason
     *
     * @return bool whether a grant was removed
     */
    public function revoke(User $user, string $source, string $reason): bool
    {
        $this->assertGrantable($user, $source, $reason);

        if ($this->find($user, $source, $reason)->delete() === 0) {
            return false;
        }

        $this->recount($user);

        return true;
    }

    /**
     * The points a member has been granted, across every source.
     */
    public function total(User $user): int
    {
        // MySQL and PostgreSQL return sum() as a numeric string.
        return (int) PointGrant::query()->where('user_id', $user->id)->sum('points');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder<PointGrant>
     */
    protected function find(User $user, string $source, string $reason): \Illuminate\Database\Eloquent\Builder
    {
        return PointGrant::query()
            ->where('user_id', $user->id)
            ->where('source', $source)
            ->where('reason', $reason);
    }

    /**
     * Recount the member's points the same way a vote does, then move their
     * ranks and announce the new total — but only if the total changed. It
     * can stay the same when the stored total was out of step beforehand.
     */
    protected function recount(User $user): void
    {
        // Checked before saving: wasChanged() after a save that wrote nothing
        // would still report the changes of this instance's previous save.
        if (!Vote::updateUserVotes($user)->isDirty('votes')) {
            return;
        }

        $user->save();

        Rank::syncFor($user);

        $this->events->dispatch(new UserPointsUpdated($user));
    }

    /**
     * SQLite does not enforce a string column's length and MySQL may truncate
     * to it, which would make two different reasons the same grant. Refuse
     * instead, the same on every database.
     */
    protected function assertGrantable(User $user, string $source, string $reason): void
    {
        if (!$user->exists) {
            throw new InvalidArgumentException('Points can only be granted to a saved user.');
        }

        if (mb_strlen($source) > self::SOURCE_LENGTH || mb_strlen($reason) > self::REASON_LENGTH) {
            throw new InvalidArgumentException(sprintf(
                'A point grant source is limited to %d characters and its reason to %d.',
                self::SOURCE_LENGTH,
                self::REASON_LENGTH
            ));
        }
    }
}
