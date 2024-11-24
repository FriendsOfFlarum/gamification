import Component, { ComponentAttrs } from 'flarum/common/Component';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';
import type Mithril from 'mithril';
import type Post from 'flarum/common/models/Post';
export interface VotersAttrs extends ComponentAttrs {
    post: Post;
}
export default class Voters extends Component<VotersAttrs> {
    subtreeRetainer: SubtreeRetainer;
    lastRenderVotes: number;
    loading: boolean;
    oninit(vnode: Mithril.Vnode): void;
    onbeforeupdate(vnode: Mithril.Vnode): boolean;
    onupdate(): void;
    view(): JSX.Element;
    load(): Promise<void>;
}
