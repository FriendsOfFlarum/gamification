import Component from 'flarum/common/Component';
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
    private resolved;
    private loading;
    oninit(vnode: Mithril.Vnode<ExcludedUsersSettingAttrs, this>): void;
    /** The ids currently stored, tolerating an empty or malformed setting. */
    private ids;
    /**
     * Fetch any stored user we cannot already name.
     *
     * Ids can outlive the users they point at, so anything that does not come
     * back is dropped from the setting rather than left as an unnameable entry.
     */
    private load;
    private setIds;
    private selectedUsers;
    view(): JSX.Element;
}
