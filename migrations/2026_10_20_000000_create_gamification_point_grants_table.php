<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

/**
 * Points granted to a member by another extension, as opposed to earned from
 * votes.
 *
 * A member's points are recounted from their posts' votes, so anything written
 * straight to `users.votes` was lost on the next recount. Grants live here
 * instead and every recount adds them back in. A grant is identified by who
 * gave it (`source`, the granting extension) and what for (`reason`), which is
 * what makes granting idempotent.
 *
 * Creating the table changes no member's points: with no grants, a recount
 * adds nothing.
 */
return Migration::createTable('gamification_point_grants', function (Blueprint $table, Builder $schema) {
    $table->increments('id');
    $table->unsignedInteger('user_id');
    $table->string('source', 100); // PointGrants::SOURCE_LENGTH
    $table->string('reason', 150); // PointGrants::REASON_LENGTH
    $table->integer('points');
    $table->timestamp('created_at')->nullable();

    // Named explicitly: the generated name would be 54 characters, leaving
    // the longest table prefix Flarum accepts one byte under MySQL's limit.
    // An explicit name is not prefixed for us, and index names share one
    // namespace per schema on PostgreSQL and SQLite, so prefix it here.
    $table->unique(['user_id', 'source', 'reason'], $schema->getConnection()->getTablePrefix().'point_grants_user_source_reason');
    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
});
