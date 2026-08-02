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

class EnabledTags
{
    public const SETTING = 'fof-gamification.enabled-tags';

    /**
     * The vote abilities whose presence means gamification is in use.
     */
    private const VOTE_ABILITIES = ['votePosts', 'canSeeVotes', 'canSeeVoters'];

    /**
     * Work out which tags gamification should be enabled on, from the
     * permissions a forum already has, so that upgrading changes nothing about
     * where voting works.
     *
     * A forum-wide `discussion.votePosts` (or the see-votes equivalent) means
     * voting is available everywhere, and every tag is enabled. Per-tag rows
     * are deliberately ignored in that case: a restricted tag re-grants the
     * abilities its members need — reply, likePosts, viewForum and often the
     * vote ones too — so they describe access control for that tag rather than
     * where gamification belongs. Treating them as intent would disable voting
     * on every other tag.
     *
     * Without a global grant, the per-tag rows are the only signal there is,
     * and they do carry the intent: voting exists exactly where a tag grants
     * it.
     *
     * @param string[] $permissions all permission names granted on the forum
     * @param int[]    $tagIds      the ids of the tags that currently exist
     *
     * @return string[] tag ids, as the strings the setting stores
     */
    public static function seedFromPermissions(array $permissions, array $tagIds): array
    {
        foreach (self::VOTE_ABILITIES as $ability) {
            if (in_array("discussion.$ability", $permissions, true)) {
                return array_map('strval', array_values($tagIds));
            }
        }

        $granted = [];

        foreach ($permissions as $permission) {
            if (preg_match('/^tag(\d+)\.discussion\.([A-Za-z]+)$/', $permission, $matches)
                && in_array($matches[2], self::VOTE_ABILITIES, true)) {
                $granted[(int) $matches[1]] = true;
            }
        }

        // Permission rows outlive the tags they name, so only keep ids that
        // still resolve to a tag.
        return array_map('strval', array_values(array_filter(
            $tagIds,
            fn (int $id) => isset($granted[$id])
        )));
    }
}
