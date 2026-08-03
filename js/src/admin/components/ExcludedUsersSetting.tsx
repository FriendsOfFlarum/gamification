import app from 'flarum/admin/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Tooltip from 'flarum/common/components/Tooltip';
import extractText from 'flarum/common/utils/extractText';
import UserSelectionModal from 'flarum/common/components/UserSelectionModal';
import User from 'flarum/common/models/User';
import type Mithril from 'mithril';

export interface ExcludedUsersSettingAttrs {
  /** The setting value: a JSON array of user ids. */
  value: string;
  onchange: (value: string) => void;
}

/**
 * Picks the users who should be kept off the leaderboard.
 *
 * The setting stores ids rather than names so that renaming a user does not
 * quietly stop excluding them. Ids are not something an admin can be expected
 * to type, so selection goes through the same search modal core uses.
 */
export default class ExcludedUsersSetting extends Component<ExcludedUsersSettingAttrs> {
  /**
   * Users we have resolved from the stored ids, so their names can be shown.
   * Keyed by id, since the store may not have them loaded on first paint.
   */
  private resolved: Record<string, User> = {};
  private loading = false;

  oninit(vnode: Mithril.Vnode<ExcludedUsersSettingAttrs, this>) {
    super.oninit(vnode);

    this.load();
  }

  /** The ids currently stored, tolerating an empty or malformed setting. */
  private ids(): string[] {
    try {
      const parsed = JSON.parse(this.attrs.value || '[]');

      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  /**
   * Fetch any stored user we cannot already name.
   *
   * Ids can outlive the users they point at, so anything that does not come
   * back is dropped from the setting rather than left as an unnameable entry.
   */
  private load(): void {
    const missing = this.ids().filter((id) => !this.resolved[id] && !app.store.getById<User>('users', id));

    this.ids().forEach((id) => {
      const user = app.store.getById<User>('users', id);
      if (user) this.resolved[id] = user;
    });

    if (!missing.length) return;

    this.loading = true;

    Promise.all(
      missing.map((id) =>
        app.store
          .find<User>('users', id)
          .then((user) => {
            if (user) this.resolved[id] = user;
          })
          .catch(() => {
            // The user no longer exists; drop the id so the setting stops
            // referring to somebody who cannot be shown or removed.
            this.setIds(this.ids().filter((stored) => stored !== id));
          })
      )
    ).then(() => {
      this.loading = false;
      m.redraw();
    });
  }

  private setIds(ids: string[]): void {
    this.attrs.onchange(JSON.stringify(ids.map((id) => parseInt(id, 10))));
  }

  private selectedUsers(): User[] {
    return this.ids()
      .map((id) => this.resolved[id] ?? app.store.getById<User>('users', id))
      .filter((user): user is User => !!user);
  }

  view() {
    const selected = this.selectedUsers();

    return (
      <div className="ExcludedUsersSetting">
        {selected.length > 0 && (
          <div className="ExcludedUsersSetting-list Pill-list">
            {selected.map((user) => (
              <Tooltip text={extractText(app.translator.trans('fof-gamification.admin.page.rankings.excluded_users.remove'))}>
                <button
                  type="button"
                  className="Button Button--pill"
                  onclick={() => this.setIds(this.ids().filter((id) => id !== String(user.id())))}
                >
                  {user.displayName()}
                  <span aria-hidden="true"> &times;</span>
                </button>
              </Tooltip>
            ))}
          </div>
        )}

        <Button
          className="Button"
          disabled={this.loading}
          onclick={() =>
            app.modal.show(UserSelectionModal, {
              selected: this.selectedUsers(),
              onsubmit: (users: User[]) => {
                this.setIds(users.map((user) => String(user.id())));
                users.forEach((user) => {
                  this.resolved[String(user.id())] = user;
                });
                m.redraw();
              },
            })
          }
        >
          {app.translator.trans('fof-gamification.admin.page.rankings.excluded_users.select')}
        </Button>
      </div>
    );
  }
}
