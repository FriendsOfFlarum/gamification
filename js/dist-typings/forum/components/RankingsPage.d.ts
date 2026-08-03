import Page, { IPageAttrs } from 'flarum/common/components/Page';
import type Mithril from 'mithril';
/**
 * The leaderboard.
 *
 * Reads a dedicated endpoint rather than a sorted list of users: the ranking
 * is computed, so an entry's score and position belong to the metric and
 * period being asked for rather than to the person.
 */
export default class RankingsPage extends Page<IPageAttrs> {
    private entries;
    private loading;
    private loadingMore;
    private jumping;
    private hasMore;
    private metric;
    private period;
    /** Where the viewer stands, or null if they are not on the board. */
    private standing;
    /** People worth calling out beyond the top three. */
    private highlights;
    oninit(vnode: Mithril.Vnode<IPageAttrs, this>): void;
    private metrics;
    private periods;
    private currentMetric;
    private refresh;
    private load;
    private loadMore;
    private changeMetric;
    private changePeriod;
    private updateRoute;
    /**
     * Page forward until the viewer's own row is loaded, then scroll to it.
     *
     * Someone in 87th place would otherwise have to press "load more" four
     * times to find themselves, which is enough friction that most people will
     * not bother.
     */
    private jumpToMe;
    private controls;
    /**
     * The awards that stay winnable.
     *
     * The podium belongs to whoever has been here longest. These belong to
     * whoever showed up this week, which is the only part most members can
     * change — so they are given their own row rather than buried.
     */
    /**
     * The selected period, phrased to sit inside a sentence.
     *
     * "this month" rather than "This month", because it is read as part of an
     * explanation rather than as the label on a control.
     */
    private periodName;
    /** The window an award is measured against — "last month", not "this month". */
    private previousPeriodName;
    /**
     * The sentence explaining what an award measures.
     */
    private highlightHelp;
    private highlightStrip;
    /**
     * How wide an entry's bar should be, as a percentage.
     *
     * Scaled across the range actually on screen rather than against the
     * leader. The top three are on the podium, so measuring the list against a
     * score that is not in it squeezes every bar into the first third of the
     * track: on a board of 162 down to 66 against a leader of 339, everything
     * lands between 28% and 48% and the differences stop being visible.
     *
     * The floor keeps the last place a bar rather than a sliver, so it still
     * reads as a row with a value.
     */
    private barWidth;
    /**
     * The top three, given room to be the point of the page.
     *
     * A leaderboard exists to make first place feel worth having, and a table
     * renders the leader and the person in tenth identically. These are cards,
     * ordered second-first-third so the winner sits highest and in the middle
     * on a wide screen; the ordering is CSS, so they stack 1-2-3 when the row
     * will not fit.
     */
    private podium;
    /**
     * Which way somebody is going.
     *
     * The part of a leaderboard that stays winnable: climbing three places is
     * an achievement whoever is top, so it is worth more encouragement than the
     * position itself.
     */
    private movement;
    /**
     * Everybody from fourth down.
     */
    private rows;
    /**
     * The position as an ordinal.
     *
     * Delegated to Intl so that every locale gets its own rule rather than
     * English suffixes being appended to numbers in languages that do not use
     * them.
     */
    private ordinal;
    view(): JSX.Element;
}
