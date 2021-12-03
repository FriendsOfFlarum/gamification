<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Jobs;

use Flarum\Discussion\Discussion;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Gamification\Gamification;
use FoF\Gamification\Likes;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class ConvertLikesToUpvotes implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    const CHUNK_SIZE = 50;

    public function handle(): void
    {
        /** @var SettingsRepositoryInterface $settings */
        $settings = resolve('flarum.settings');

        /** @var Gamification $gamification */
        $gamification = resolve(Gamification::class);

        $counter = 0;

        $settings->set('fof-gamification.convertedLikes', 'converting');

        Likes::orderBy('post_id')->chunk(self::CHUNK_SIZE, function (Collection $likes) use ($gamification, &$counter) {
            foreach ($likes as $like) {
                $gamification->convertLike($like->post_id, $like->user_id);
                $counter++;
            }
        });

        Discussion::chunkById(self::CHUNK_SIZE, function (Collection $discussions) use ($gamification) {
            foreach ($discussions as $discussion) {
                /** @var Discussion $discussion */
                $gamification->calculateHotness($discussion);
            }
        });

        $settings->set('fof-gamification.convertedLikes', $counter);
    }
}
