export default class VotesModal extends Modal<import("flarum/common/components/Modal").IInternalModalAttrs, undefined> {
    constructor();
    title(): string | any[];
    oninit(vnode: any): void;
    content(): JSX.Element;
    load(): Promise<void>;
}
import Modal from "flarum/common/components/Modal";
