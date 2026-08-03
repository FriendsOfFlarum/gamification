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
  private displayed = 0;
  private frame?: number;

  oncreate(vnode: Mithril.VnodeDOM<CountUpAttrs, this>) {
    super.oncreate(vnode);

    this.start();
  }

  onupdate(vnode: Mithril.VnodeDOM<CountUpAttrs, this>) {
    super.onupdate(vnode);

    // Switching metric or period replaces the value; count to the new one
    // rather than leaving the old total on screen.
    if (this.displayed !== this.attrs.value && !this.frame) {
      this.start();
    }
  }

  onremove(vnode: Mithril.VnodeDOM<CountUpAttrs, this>) {
    super.onremove(vnode);

    if (this.frame) cancelAnimationFrame(this.frame);
  }

  private start() {
    const target = this.attrs.value || 0;

    if (typeof window === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.displayed = target;
      return;
    }

    const duration = this.attrs.duration ?? 700;
    const from = this.displayed;
    const started = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);

      // Ease out, so it decelerates into the final figure instead of
      // stopping dead.
      const eased = 1 - Math.pow(1 - progress, 3);

      this.displayed = Math.round(from + (target - from) * eased);

      m.redraw();

      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      } else {
        this.frame = undefined;
      }
    };

    this.frame = requestAnimationFrame(step);
  }

  view() {
    return <span className="CountUp">{this.displayed.toLocaleString()}</span>;
  }
}
