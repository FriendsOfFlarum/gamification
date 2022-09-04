<?php

namespace FoF\Gamification\Jobs;

use Flarum\Group\Group;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class AutoAssignUserGroups
{
    protected $user;
    public $statsAdded = 0;
    public $statsRemoved = 0;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function handle(SettingsRepositoryInterface $settings)
    {
        $entries = json_decode($settings->get('fof-gamification.autoAssignedGroups'), true);

        if (!is_array($entries)) {
            return;
        }

        $groupsToAdd = [];
        $groupsToRemove = [];

        /**
         * @var Collection $currentUserGroupIds
         */
        $currentUserGroupIds = $this->user->groups->pluck('id');

        foreach ($entries as $entry) {
            $id = (int)Arr::get($entry, 'groupId');
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

        if ($this->statsAdded = count($groupsToAdd)) {
            $this->user->groups()->attach($groupsToAdd);
        }

        if ($this->statsRemoved = count($groupsToRemove)) {
            $this->user->groups()->detach($groupsToRemove);
        }
    }
}
