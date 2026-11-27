import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export interface CountUpAttrs extends ComponentAttrs {
    value: number;
    /** Milliseconds the count should take. */
    duration?: number;
}
/**
 * A number that counts up to its value when it first appears.
 *
 * The podium scores are the payoff of the whole page, and a number that is
 * simply present reads as data. Counting up gives it a moment of arrival —
 * small, but it is the difference between a table and a result.
 *
 * Respects `prefers-reduced-motion`: anyone who has asked for less movement
 * gets the final number immediately.
 */
export default class CountUp extends Component<CountUpAttrs> {
    private displayed;
    private frame?;
    oncreate(vnode: Mithril.VnodeDOM<CountUpAttrs, this>): void;
    onupdate(vnode: Mithril.VnodeDOM<CountUpAttrs, this>): void;
    onremove(vnode: Mithril.VnodeDOM<CountUpAttrs, this>): void;
    private start;
    view(): JSX.Element;
}
