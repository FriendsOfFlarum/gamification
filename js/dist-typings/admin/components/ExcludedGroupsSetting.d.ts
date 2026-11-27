import Component from 'flarum/common/Component';
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
    private ids;
    private toggle;
    view(): Mithril.Children;
}
