import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import PageStructure from 'flarum/forum/components/PageStructure';
import IndexPage from 'flarum/forum/components/IndexPage';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import Avatar from 'flarum/common/components/Avatar';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Select from 'flarum/common/components/Select';
import Placeholder from 'flarum/common/components/Placeholder';
import username from 'flarum/common/helpers/username';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';

import Icon from 'flarum/common/components/Icon';
import Tooltip from 'flarum/common/components/Tooltip';
import RankingImage from './RankingImage';
import CountUp from './CountUp';
import type LeaderboardEntry from '../../common/models/LeaderboardEntry';

interface MetricOption {
  key: string;
  label: string;
  supportsPeriods: boolean;
}

/**
 * The leaderboard.
 *
 * Reads a dedicated endpoint rather than a sorted list of users: the ranking
 * is computed, so an entry's score and position belong to the metric and
 * period being asked for rather than to the person.
 */
export default class RankingsPage extends Page<IPageAttrs> {
  private entries: LeaderboardEntry[] = [];
  private loading = true;
  private loadingMore = false;
  private jumping = false;
  private hasMore = false;

  private metric!: string;
  private period!: string;

  /** Where the viewer stands, or null if they are not on the board. */
  private standing: { position: number; score: number; toNext: number | null } | null = null;

  /** People worth calling out beyond the top three. */
  private highlights: Record<string, { displayName: string; avatarUrl: string | null; slug: string; score?: number; places?: number }> = {};

  oninit(vnode: Mithril.Vnode<IPageAttrs, this>) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('canViewRankingPage')) {
      m.route.set('/');
      return;
    }

    // The metric and period are in the URL so a particular board can be linked
    // to and survives a refresh.
    // Falls back to the admin's configured default rather than whichever
    // metric happens to be first in the list.
    this.metric =
      m.route.param('metric') || app.forum.attribute<string>('fof-gamification.defaultLeaderboardMetric') || this.metrics()[0]?.key || 'posts';
    this.period = m.route.param('period') || app.forum.attribute<string>('fof-gamification.defaultLeaderboardPeriod') || 'year';

    this.refresh();
  }

  private metrics(): MetricOption[] {
    return app.forum.attribute<MetricOption[]>('fof-gamification.leaderboardMetrics') || [];
  }

  private periods(): string[] {
    return app.forum.attribute<string[]>('fof-gamification.leaderboardPeriods') || [];
  }

  private currentMetric(): MetricOption | undefined {
    return this.metrics().find((metric) => metric.key === this.metric);
  }

  private refresh() {
    this.loading = true;
    this.entries = [];

    return this.load().then(() => {
      this.loading = false;
      m.redraw();
    });
  }

  private load(offset = 0) {
    return app.store
      .find<LeaderboardEntry[]>('leaderboard-entries', {
        filter: { metric: this.metric, period: this.period },
        page: { offset, limit: 20 },
      })
      .then((results) => {
        this.entries.push(...results);

        // Trust the API's order rather than re-sorting here: sorting each
        // page as it arrives interleaves it with the ones already loaded.
        const payload = (results as any).payload;

        this.hasMore = Boolean(payload?.links?.next);
        this.standing = payload?.meta?.standing ?? null;
        this.highlights = payload?.meta?.highlights ?? {};

        return results;
      })
      .catch(() => {
        this.hasMore = false;
      });
  }

  private loadMore() {
    this.loadingMore = true;

    this.load(this.entries.length).then(() => {
      this.loadingMore = false;
      m.redraw();
    });
  }

  private changeMetric(metric: string) {
    this.metric = metric;

    // A metric that cannot be limited to a period would silently answer with
    // the all-time figure, so move back to all-time rather than show a period
    // that is not being applied.
    if (!this.currentMetric()?.supportsPeriods) {
      this.period = 'all';
    }

    this.updateRoute();
  }

  private changePeriod(period: string) {
    this.period = period;
    this.updateRoute();
  }

  private updateRoute() {
    m.route.set(app.route('rankings', { metric: this.metric, period: this.period }), undefined, { replace: true });

    this.refresh();
  }

  /**
   * Page forward until the viewer's own row is loaded, then scroll to it.
   *
   * Someone in 87th place would otherwise have to press "load more" four
   * times to find themselves, which is enough friction that most people will
   * not bother.
   */
  private async jumpToMe() {
    if (!this.standing || this.jumping) return;

    this.jumping = true;

    // Keep loading while their position is beyond what has been fetched.
    //
    // Bounded by hasMore as well as by position: a standing computed a moment
    // before the board can disagree with it — a vote landing in between —
    // and without that guard the loop would keep asking for pages that are
    // not there.
    while (this.entries.length < this.standing.position && this.hasMore) {
      await this.load(this.entries.length);
    }

    this.jumping = false;
    m.redraw();

    // After the redraw, so the row exists to scroll to.
    requestAnimationFrame(() => {
      const row = document.getElementById('RankingsPage-me');

      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // The board moved under us and the row never arrived. Say so rather
      // than leaving a button that appears to do nothing.
      app.alerts.show({ type: 'error' }, app.translator.trans('fof-gamification.forum.leaderboard.find_me_failed'));
    });
  }

  private controls(): Mithril.Children {
    const metricOptions: Record<string, string> = {};

    this.metrics().forEach((metric) => {
      metricOptions[metric.key] = app.translator.trans(metric.label) as string;
    });

    const periodOptions: Record<string, string> = {};

    this.periods().forEach((period) => {
      periodOptions[period] = app.translator.trans(`fof-gamification.forum.leaderboard.period.${period}`) as string;
    });

    return (
      <div className="RankingsPage-controls">
        <Select
          className="RankingsPage-metric"
          options={metricOptions}
          value={this.metric}
          onchange={this.changeMetric.bind(this)}
          aria-label={app.translator.trans('fof-gamification.forum.leaderboard.metric_label')}
        />

        {this.currentMetric()?.supportsPeriods && (
          <Select
            className="RankingsPage-period"
            options={periodOptions}
            value={this.period}
            onchange={this.changePeriod.bind(this)}
            aria-label={app.translator.trans('fof-gamification.forum.leaderboard.period_label')}
          />
        )}

        {/* Only worth offering when the viewer is actually ranked, and only
            says where they are — the board is not reordered around them. */}
        {this.standing && (
          <Button className="Button RankingsPage-jump" icon="fas fa-crosshairs" onclick={this.jumpToMe.bind(this)} loading={this.jumping}>
            {app.translator.trans('fof-gamification.forum.leaderboard.find_me', {
              position: this.ordinal(this.standing.position),
            })}
          </Button>
        )}
      </div>
    );
  }

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
  private periodName(): string {
    return extractText(app.translator.trans(`fof-gamification.forum.leaderboard.period_phrase.${this.period}`));
  }

  /** The window an award is measured against — "last month", not "this month". */
  private previousPeriodName(): string {
    return extractText(app.translator.trans(`fof-gamification.forum.leaderboard.period_previous.${this.period}`));
  }

  /**
   * The sentence explaining what an award measures.
   */
  private highlightHelp(key: string): Mithril.Children {
    return app.translator.trans(`fof-gamification.forum.leaderboard.highlight.${key}_help`, {
      period: this.periodName(),
      previous: this.previousPeriodName(),
    });
  }

  private highlightStrip(): Mithril.Children {
    const cards = [
      { key: 'climber', icon: 'fas fa-arrow-trend-up', value: (h: any) => `+${h.places}` },
      {
        key: 'consistent',
        icon: 'fas fa-calendar-check',
        value: (h: any) => app.translator.trans('fof-gamification.forum.leaderboard.highlight.days', { count: h.days }),
      },
      { key: 'newcomer', icon: 'fas fa-seedling', value: (h: any) => h.score?.toLocaleString() },
    ].filter((card) => this.highlights[card.key]);

    if (!cards.length) return null;

    return (
      <ul className="RankingsPage-highlights">
        {cards.map((card) => {
          const highlight = this.highlights[card.key];

          return (
            <li className={`RankingsPage-highlight RankingsPage-highlight--${card.key}`} key={card.key}>
              <Icon name={card.icon} className="RankingsPage-highlightIcon" />

              <span className="RankingsPage-highlightBody">
                <span className="RankingsPage-highlightLabel">
                  {app.translator.trans(`fof-gamification.forum.leaderboard.highlight.${card.key}`)}
                </span>
                <Link href={app.route('user', { username: highlight.slug })} className="RankingsPage-highlightName">
                  {highlight.displayName}
                </Link>
                {/* A label and a number assume the reader knows the rule.
                    Each award measures something different, over the period
                    currently selected, so both are spelled out. */}
                <span className="RankingsPage-highlightHelp">{this.highlightHelp(card.key)}</span>
              </span>

              <span className="RankingsPage-highlightValue">{card.value(highlight)}</span>
            </li>
          );
        })}
      </ul>
    );
  }

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
  private barWidth(entry: LeaderboardEntry): number {
    const listed = this.entries.slice(3).map((e) => e.score());

    if (!listed.length) return 100;

    const highest = Math.max(...listed);
    const lowest = Math.min(...listed);

    // Everybody level: a full bar each says that more honestly than an
    // arbitrary fraction would.
    if (highest === lowest) return 100;

    return 8 + ((entry.score() - lowest) / (highest - lowest)) * 92;
  }

  /**
   * The top three, given room to be the point of the page.
   *
   * A leaderboard exists to make first place feel worth having, and a table
   * renders the leader and the person in tenth identically. These are cards,
   * ordered second-first-third so the winner sits highest and in the middle
   * on a wide screen; the ordering is CSS, so they stack 1-2-3 when the row
   * will not fit.
   */
  private podium(): Mithril.Children {
    const top = this.entries.slice(0, 3);

    if (!top.length) return null;

    return (
      <ol className={`RankingsPage-podium RankingsPage-podium--of${top.length}`}>
        {top.map((entry) => {
          const user = entry.user();
          const position = entry.position();

          if (!user) return null;

          return (
            <li className={`RankingsPage-podiumPlace RankingsPage-podiumPlace--${position}`} key={entry.id()}>
              <Link href={app.route.user(user)} className="RankingsPage-podiumLink">
                <span className="RankingsPage-podiumMedal">
                  <RankingImage place={position} />
                </span>
                <Avatar user={user} className="RankingsPage-podiumAvatar" />
                <span className="RankingsPage-podiumName">{username(user)}</span>
                <span className="RankingsPage-podiumScore">
                  <CountUp value={entry.score()} />
                </span>
                <span className="RankingsPage-podiumPosition">{this.ordinal(position)}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    );
  }

  /**
   * Which way somebody is going.
   *
   * The part of a leaderboard that stays winnable: climbing three places is
   * an achievement whoever is top, so it is worth more encouragement than the
   * position itself.
   */
  private movement(entry: LeaderboardEntry): Mithril.Children {
    const raw = entry.movement();

    if (!raw) return null;

    // Arriving on the board is its own event, not a climb from nowhere: it
    // gets a distinct badge rather than a number of places.
    if (raw === 'new') {
      return (
        <Tooltip text={extractText(app.translator.trans('fof-gamification.forum.leaderboard.moved_new_tooltip'))}>
          <span className="RankingsPage-movement RankingsPage-movement--new">
            {app.translator.trans('fof-gamification.forum.leaderboard.moved_new')}
          </span>
        </Tooltip>
      );
    }

    const moved = parseInt(raw, 10);

    if (!moved) return null;

    const climbed = moved > 0;

    return (
      <Tooltip
        text={extractText(
          app.translator.trans(climbed ? 'fof-gamification.forum.leaderboard.moved_up' : 'fof-gamification.forum.leaderboard.moved_down', {
            count: Math.abs(moved),
          })
        )}
      >
        <span className={`RankingsPage-movement RankingsPage-movement--${climbed ? 'up' : 'down'}`}>
          <Icon name={climbed ? 'fas fa-caret-up' : 'fas fa-caret-down'} />
          {Math.abs(moved)}
        </span>
      </Tooltip>
    );
  }

  /**
   * Everybody from fourth down.
   */
  private rows(): Mithril.Children {
    return this.entries.slice(3).map((entry) => {
      const user = entry.user();
      const position = entry.position();

      if (!user) return null;

      const viewer = app.session.user;
      const isViewer = Boolean(viewer) && user.id() === viewer!.id();

      return (
        <tr
          className={isViewer ? 'RankingsPage-row RankingsPage-row--you' : 'RankingsPage-row'}
          key={entry.id()}
          id={isViewer ? 'RankingsPage-me' : undefined}
        >
          <td className="rankings-place">
            <span className="rankings-placeInner">
              {this.ordinal(position)}
              {this.movement(entry)}
            </span>
          </td>
          <td className="rankings-user">
            {/* Avatar, name and chip share one flex line so they sit on a
                common centre — the chip used to be a sibling of the link,
                which left it with nothing to align against. */}
            <div className="RankingsPage-identity">
              <Link href={app.route.user(user)} className="RankingsPage-user">
                <Avatar user={user} className="RankingsPage-avatar" />
                <span className="RankingsPage-username">{username(user)}</span>
              </Link>
              {isViewer && <span className="RankingsPage-youChip">{app.translator.trans('fof-gamification.forum.leaderboard.you')}</span>}
            </div>

            {/* The gap belongs to this row: it is a fact about the person
                reading it, so it sits with their name rather than in a
                panel of its own. */}
            {isViewer && this.standing !== null && this.standing.toNext !== null && (
              <span className="RankingsPage-toNext">
                {app.translator.trans('fof-gamification.forum.leaderboard.to_next', { count: this.standing.toNext })}
              </span>
            )}
          </td>
          <td className="rankings-bar">
            {/* Relative to the leader, so the shape of the board is legible
                at a glance rather than having to compare numbers. */}
            <span className="RankingsPage-bar" style={{ width: `${this.barWidth(entry)}%` }} />
          </td>
          <td className="rankings-score">{entry.score().toLocaleString()}</td>
        </tr>
      );
    });
  }

  /**
   * The position as an ordinal.
   *
   * Delegated to Intl so that every locale gets its own rule rather than
   * English suffixes being appended to numbers in languages that do not use
   * them.
   */
  private ordinal(position: number): Mithril.Children {
    const locale = app.data.locale || 'en';

    try {
      const rules = new Intl.PluralRules(locale, { type: 'ordinal' });

      return app.translator.trans(`fof-gamification.forum.leaderboard.ordinal.${rules.select(position)}`, {
        count: position,
      });
    } catch {
      // A locale Intl does not know: the bare number is still correct, just
      // not decorated.
      return String(position);
    }
  }

  view() {
    return (
      <PageStructure className="RankingsPage" hero={() => IndexPage.prototype.hero()} sidebar={() => <IndexSidebar />}>
        {this.controls()}

        {this.loading ? (
          <LoadingIndicator />
        ) : this.entries.length === 0 ? (
          <Placeholder text={app.translator.trans('fof-gamification.forum.leaderboard.empty')} />
        ) : (
          <>
            {this.podium()}

            {this.highlightStrip()}

            {this.entries.length > 3 && (
              <table className="rankings">
                <thead>
                  <tr>
                    <th scope="col" className="rankings-place">
                      {app.translator.trans('fof-gamification.forum.ranking.rank')}
                    </th>
                    <th scope="col" className="rankings-user">
                      {app.translator.trans('fof-gamification.forum.ranking.name')}
                    </th>
                    <th scope="col" className="rankings-bar" aria-hidden="true"></th>
                    <th scope="col" className="rankings-score">
                      {this.currentMetric()
                        ? app.translator.trans(this.currentMetric()!.label)
                        : app.translator.trans('fof-gamification.forum.ranking.amount')}
                    </th>
                  </tr>
                </thead>
                <tbody>{this.rows()}</tbody>
              </table>
            )}

            {this.hasMore && (
              <div className="rankings-loadmore">
                {this.loadingMore ? (
                  <LoadingIndicator />
                ) : (
                  <Button className="Button" onclick={this.loadMore.bind(this)}>
                    {app.translator.trans('core.forum.discussion_list.load_more_button')}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </PageStructure>
    );
  }
}
