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

/**
 * Rename the hotness column to match what the sort is now called everywhere
 * else.
 *
 * "Hotness" named the implementation — a time-decayed vote score borrowed from
 * Reddit — rather than saying anything about what a reader would get. The sort
 * option, its label, the search gambit and the filter key are all "trending"
 * now, and leaving the column behind would mean the one name a developer meets
 * first is the one that was replaced.
 *
 * Reversible: the column keeps its type and its values, only the name changes.
 */
return Migration::renameColumn('discussions', 'hotness', 'trending');
