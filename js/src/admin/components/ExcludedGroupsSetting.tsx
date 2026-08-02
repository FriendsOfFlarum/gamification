import app from 'flarum/admin/app';
import Component from 'flarum/common/Component';
import Group from 'flarum/common/models/Group';
import type Mithril from 'mithril';

export interface ExcludedGroupsSettingAttrs {
  /** The setting value: a JSON array of group ids. */
  value: string;
  onchange: (value: string) => void;
}

/**
 * Picks the groups whose members should be kept off the leaderboard.
 *
 * Groups are a small, known set, so these are plain checkboxes rather than a
 * search — every option fits on screen and the current state is readable at a
 * glance.
 */
export default class ExcludedGroupsSetting extends Component<ExcludedGroupsSettingAttrs> {
  private ids(): string[] {
    try {
      const parsed = JSON.parse(this.attrs.value || '[]');

      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  private toggle(id: string): void {
    const current = this.ids();
    const next = current.includes(id) ? current.filter((stored) => stored !== id) : [...current, id];

    this.attrs.onchange(JSON.stringify(next.map((value) => parseInt(value, 10))));
  }

  view(): Mithril.Children {
    const selected = this.ids();

    const groups = app.store.all<Group>('groups').filter((group) => {
      // Guest and Member are virtual: everyone is in one or the other, so
      // excluding them would empty the leaderboard rather than filter it.
      return group.id() !== Group.GUEST_ID && group.id() !== Group.MEMBER_ID;
    });

    return (
      <div className="ExcludedGroupsSetting">
        {groups.map((group) => (
          <label className="checkbox">
            <input type="checkbox" checked={selected.includes(String(group.id()))} onchange={() => this.toggle(String(group.id()))} />
            {group.namePlural()}
          </label>
        ))}
      </div>
    );
  }
}
