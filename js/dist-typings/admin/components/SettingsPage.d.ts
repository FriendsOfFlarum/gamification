export default class SettingsPage extends ExtensionPage<import("flarum/admin/components/ExtensionPage").ExtensionPageAttrs> {
    constructor();
    oninit(vnode: any): void;
    fields: string[] | undefined;
    switches: string[] | undefined;
    ranks: import("flarum/common/Model").default[] | undefined;
    values: {} | undefined;
    settingsPrefix: string | undefined;
    newRank: {
        points: any;
        name: any;
        color: any;
    } | undefined;
    /**
     * @returns {*}
     */
    content(): any;
    updateName(rank: any, value: any): void;
    updatePoints(rank: any, value: any): void;
    updateColor(rank: any, value: any): void;
    deleteRank(rankToDelete: any): void;
    addRank(): void;
    /**
     *
     * @returns boolean
     */
    changed(): boolean;
    prepareSubmissionData(): {};
    /**
     * @param e
     */
    onsubmit(e: any): void;
    /**
     * @returns string
     */
    addPrefix(key: any): string;
    settingsItems(): ItemList<any>;
    firstSectionGroupItems(): ItemList<any>;
    secondSectionGroupItems(): ItemList<any>;
    rankItems(): ItemList<any>;
    voteItems(): ItemList<any>;
    rankingsItems(): ItemList<any>;
}
import ExtensionPage from "flarum/admin/components/ExtensionPage";
import ItemList from "flarum/common/utils/ItemList";
