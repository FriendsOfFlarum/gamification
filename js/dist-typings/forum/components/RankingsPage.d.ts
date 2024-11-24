/**
 * This page re-uses Flarum's IndexPage CSS classes
 */
export default class RankingsPage extends Page<import("flarum/common/components/Page").IPageAttrs, undefined> {
    constructor();
    oninit(vnode: any): void;
    loading: boolean | undefined;
    users: any[] | undefined;
    view(): JSX.Element;
    refresh(clear?: boolean): Promise<void>;
    addOrdinalSuffix(i: any): any;
    loadResults(offset: any): Promise<import("flarum/common/Store").ApiResponseSingle<import("flarum/common/Model").default>>;
    loadMore(): void;
    parseResults(results: any): any;
}
import Page from "flarum/common/components/Page";
