/// <reference types="flarum/@types/translator-icu-rich" />
export default class VotesModal extends Modal<import("flarum/common/components/Modal").IInternalModalAttrs, undefined> {
    constructor();
    title(): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    oninit(vnode: any): void;
    content(): JSX.Element;
    load(): Promise<void>;
}
import Modal from "flarum/common/components/Modal";
