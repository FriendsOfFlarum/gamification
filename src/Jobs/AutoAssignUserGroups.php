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

use Flarum\Group\Group;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Event\GroupsChanged;
use Flarum\User\User;
use FoF\Gamification\Events\GroupsAutomaticallyChanged;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class AutoAssignUserGroups implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    protected $user;
    public $statsAdded = 0;
    public $statsRemoved = 0;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function handle(SettingsRepositoryInterface $settings, Dispatcher $dispatcher)
    {
        if ($this->user->isAdmin()) {
            return;
        }

        $autoAssignGroups = $settings->get('fof-gamification.autoAssignGroups');

        if (empty($autoAssignGroups)) {
            return;
        }

        $entries = json_decode($autoAssignGroups, true);

        // If there are no entries, or if the subject user is an admin, we can skip this job
        if (empty($entries)) {
            return;
        }

        $groupsToAdd = [];
        $groupsToRemove = [];

        /**
         * @var Collection $currentUserGroupIds
         */
        $currentUserGroupIds = $this->user->groups->pluck('id');

        foreach ($entries as $entry) {
            $id = (int) Arr::get($entry, 'groupId');
            $min = Arr::get($entry, 'minPoints');
            $max = Arr::get($entry, 'maxPoints');

            // The UI doesn't offer admin, but we'll skip it here in case it was manually added in the database
            // This way we never add or remove the admin group
            // Also ignore the 2 virtual groups
            if (in_array($id, [Group::ADMINISTRATOR_ID, Group::MEMBER_ID, Group::GUEST_ID])) {
                continue;
            }

            $has = $currentUserGroupIds->contains($id);
            // If an entry has min=null and max=null, it will never match, which is intentional as it allows "deprecating" a group that will be progressively removed
            // Or removed in one go with the console command before deleting the rule entry
            $shouldHave = !is_null($min) && $this->user->votes >= $min && (is_null($max) || $this->user->votes <= $max);

            if ($has !== $shouldHave) {
                if ($shouldHave) {
                    $groupsToAdd[] = $id;
                } else {
                    $groupsToRemove[] = $id;
                }
            }
        }

        $this->statsAdded = count($groupsToAdd);
        $this->statsRemoved = count($groupsToRemove);

        if ($this->statsAdded + $this->statsRemoved > 0) {
            $oldGroups = $this->user->groups->all();

            if ($this->statsAdded > 0) {
                $this->user->groups()->attach($groupsToAdd);
            }

            if ($this->statsRemoved > 0) {
                $this->user->groups()->detach($groupsToRemove);
            }

            // Same as in EditUserHandler. Avoids any issue with extensions using the old relation data that was previously loaded
            $this->user->unsetRelation('groups');

            // Must trigger both our custom event and Flarum original event
            // because event listeners don't automatically receive our custom event even if it extends the original
            $dispatcher->dispatch(new GroupsAutomaticallyChanged($this->user, $oldGroups));
            $dispatcher->dispatch(new GroupsChanged($this->user, $oldGroups));
        }
    }
}
