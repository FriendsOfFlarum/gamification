import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import Rank from '../../common/models/Rank';
import type Mithril from 'mithril';
export default class SettingsPage extends ExtensionPage {
    fields: string[];
    switches: string[];
    ranks: Rank[];
    values: Record<string, Stream<any>>;
    settingsPrefix: string;
    newRank: {
        points: Stream<string>;
        name: Stream<string>;
        color: Stream<string>;
    };
    oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>): void;
    content(): JSX.Element;
    updateName(rank: Rank, value: string): void;
    updatePoints(rank: Rank, value: string): void;
    updateColor(rank: Rank, value: string): void;
    deleteRank(rankToDelete: Rank): void;
    addRank(): void;
    changed(): boolean;
    prepareSubmissionData(): Record<string, any>;
    onsubmit(e: Event): void;
    addPrefix(key: string): string;
    settingsItems(): ItemList<Mithril.Children>;
    firstSectionGroupItems(): ItemList<Mithril.Children>;
    secondSectionGroupItems(): ItemList<Mithril.Children>;
    rankItems(): ItemList<Mithril.Children>;
    voteItems(): ItemList<Mithril.Children>;
    rankingsItems(): ItemList<Mithril.Children>;
}
