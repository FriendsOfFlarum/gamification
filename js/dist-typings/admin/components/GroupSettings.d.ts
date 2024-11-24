/// <reference types="mithril" />
import Component from 'flarum/common/Component';
interface GroupSettingsAttrs {
    value: string;
    onchange: (value: string) => void;
}
export default class GroupSettings extends Component<GroupSettingsAttrs> {
    newGroupId: any;
    newMinPoints: any;
    newMaxPoints: any;
    view(): JSX.Element;
}
export {};
