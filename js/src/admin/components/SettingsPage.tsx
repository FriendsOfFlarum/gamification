import app from 'flarum/admin/app';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import saveSettings from 'flarum/admin/utils/saveSettings';
import Switch from 'flarum/common/components/Switch';
import Select from 'flarum/common/components/Select';
import withAttr from 'flarum/common/utils/withAttr';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import FormSection from 'flarum/admin/components/FormSection';
import FormSectionGroup from 'flarum/admin/components/FormSectionGroup';
import Icon from 'flarum/common/components/Icon';
import UploadImageButton from 'flarum/common/components/UploadImageButton';
import GroupSettings from './GroupSettings';
import ExcludedUsersSetting from './ExcludedUsersSetting';
import ExcludedGroupsSetting from './ExcludedGroupsSetting';
import Rank from '../../common/models/Rank';

import type Mithril from 'mithril';

interface LeaderboardMetric {
  key: string;
  label: string;
}

export default class SettingsPage extends ExtensionPage {
  fields!: string[];
  switches!: string[];
  ranks!: Rank[];
  values!: Record<string, Stream<any>>;
  settingsPrefix!: string;
  newRank!: {
    points: Stream<string>;
    name: Stream<string>;
    color: Stream<string>;
  };

  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);

    this.fields = [
      'convertedLikes',
      'amountPerPost',
      'amountPerDiscussion',
      'postStartAmount',
      'rankAmt',
      'iconName',
      'blockedUsers',
      'excludedUsers',
      'excludedGroups',
      'iconNameAlt',
      'autoAssignedGroups',
      'enabled-tags',
      'defaultMetric',
      'defaultPeriod',
    ];

    this.switches = [
      'excludeSuspended',
      'autoUpvotePosts',
      'customRankingImages',
      'rateLimit',
      'showVotesOnDiscussionPage',
      'useAlternateLayout',
      'altPostVotingUi',
      'upVotesOnly',
      'firstPostOnly',
      'allowSelfVotes',
    ];

    this.ranks = app.store.all<Rank>('ranks');

    this.values = {};

    this.settingsPrefix = 'fof-gamification';

    const settings = app.data.settings;

    this.fields.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)])));

    this.switches.forEach((key) => (this.values[key] = Stream(!!Number(settings[this.addPrefix(key)]))));

    this.newRank = {
      points: Stream(''),
      name: Stream(''),
      color: Stream(''),
    };
  }

  content(): JSX.Element {
    return (
      <div className="SettingsPage">
        <div className="container">
          <form onsubmit={this.onsubmit.bind(this)}>{this.settingsItems().toArray()}</form>
        </div>
      </div>
    );
  }

  updateName(rank: Rank, value: string) {
    rank.save({ name: value });
  }

  updatePoints(rank: Rank, value: string) {
    rank.save({ points: value });
  }

  updateColor(rank: Rank, value: string) {
    rank.save({ color: value });
  }

  deleteRank(rankToDelete: Rank) {
    rankToDelete.delete();

    const index = this.ranks.findIndex((rank) => rank.id() === rankToDelete.id());

    if (index !== -1) {
      this.ranks.splice(index, 1);
    }
  }

  addRank() {
    app.store
      .createRecord<Rank>('ranks')
      .save({
        points: this.newRank.points(),
        name: this.newRank.name(),
        color: this.newRank.color(),
      })
      .then((rank) => {
        this.newRank.color('');
        this.newRank.name('');
        this.newRank.points('');

        this.ranks.push(rank);

        m.redraw();
      });
  }

  changed(): boolean {
    const switchesCheck = this.switches.some((key) => this.values[key]() !== (app.data.settings[this.addPrefix(key)] == '1'));
    const fieldsCheck = this.fields.some((key) => this.values[key]() !== app.data.settings[this.addPrefix(key)]);

    return fieldsCheck || switchesCheck;
  }

  prepareSubmissionData(): Record<string, any> {
    const settings: Record<string, any> = {};

    this.switches.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));
    this.fields.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));

    return settings;
  }

  onsubmit(e: Event) {
    e.preventDefault();

    if (this.loading) return;

    this.loading = true;

    saveSettings(this.prepareSubmissionData())
      .then(this.onsaved.bind(this))
      .then(() => window.location.reload())
      .catch(console.error)
      .then(() => {
        this.loading = false;
      });
  }

  addPrefix(key: string): string {
    return this.settingsPrefix + '.' + key;
  }

  settingsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'convertLikesToUpvotes',
      <div className="Form-group">
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.convert.help')}</div>
        {this.values.convertedLikes() === undefined ? (
          <Button
            type="button"
            className="Button Button--warning Ranks-button"
            aria-label={app.translator.trans('fof-gamification.admin.page.convert.button')}
            onclick={() => {
              app.request({
                url: app.forum.attribute('apiUrl') + '/fof/gamification/convert',
                method: 'POST',
              });

              this.values.convertedLikes('converting');
            }}
          >
            {app.translator.trans('fof-gamification.admin.page.convert.button')}
          </Button>
        ) : this.values.convertedLikes() === 'converting' ? (
          <label>{app.translator.trans('fof-gamification.admin.page.convert.converting')}</label>
        ) : (
          <label> {app.translator.trans('fof-gamification.admin.page.convert.converted', { number: this.values.convertedLikes() })}</label>
        )}
      </div>,
      100
    );

    items.add('firstSectionGroup', <FormSectionGroup>{this.firstSectionGroupItems().toArray()}</FormSectionGroup>, 80);

    items.add('secondSectionGroup', <FormSectionGroup>{this.secondSectionGroupItems().toArray()}</FormSectionGroup>, 70);

    items.add(
      'submit',
      <Button type="submit" className="Button Button--primary Ranks-save" loading={this.loading} disabled={!this.changed()}>
        {app.translator.trans('fof-gamification.admin.page.save_settings')}
      </Button>,
      0
    );

    return items;
  }

  firstSectionGroupItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'ranks',
      <FormSection label={app.translator.trans('fof-gamification.admin.page.ranks.title')} className="SettingsPage-ranks">
        <Form>{this.rankItems().toArray()}</Form>
      </FormSection>,
      90
    );

    items.add(
      'voteSettings',
      <FormSection label={app.translator.trans('fof-gamification.admin.page.votes.title')}>
        <Form>{this.voteItems().toArray()}</Form>
      </FormSection>,
      80
    );

    return items;
  }

  secondSectionGroupItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'rankingsPage',
      <FormSection label={app.translator.trans('fof-gamification.admin.page.rankings.title')}>{this.rankingsItems().toArray()}</FormSection>,
      70
    );

    items.add(
      'groups',
      <FormSection label={app.translator.trans('fof-gamification.admin.page.groups.title')} className="SettingsPage-groups">
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.groups.help')}</div>
        <GroupSettings value={this.values.autoAssignedGroups()} onchange={this.values.autoAssignedGroups} />
      </FormSection>,
      60
    );

    return items;
  }

  rankItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'ranks',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.ranks.ranks')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.ranks.help.help')}</div>
        {this.ranks.length > 0 ? (
          <div className="Ranks--Container">
            {this.ranks.map((rank) => (
              <div className="Ranks--Container-row">
                <input
                  className="FormControl Ranks-number"
                  type="number"
                  value={rank.points()}
                  placeholder={app.translator.trans('fof-gamification.admin.page.ranks.help.points')}
                  oninput={withAttr('value', this.updatePoints.bind(this, rank))}
                />
                <input
                  className="FormControl Ranks-name"
                  value={rank.name()}
                  placeholder={app.translator.trans('fof-gamification.admin.page.ranks.help.name')}
                  oninput={withAttr('value', this.updateName.bind(this, rank))}
                />
                <input
                  className="FormControl Ranks-color"
                  value={rank.color()}
                  placeholder={app.translator.trans('fof-gamification.admin.page.ranks.help.color')}
                  oninput={withAttr('value', this.updateColor.bind(this, rank))}
                />
                <Button
                  type="button"
                  className="Button Button--warning Button--icon Ranks-button"
                  icon="fa fa-times"
                  onclick={this.deleteRank.bind(this, rank)}
                />
              </div>
            ))}
          </div>
        ) : null}
        <div className="Ranks--Container-row">
          <input
            className="FormControl Ranks-number"
            value={this.newRank.points()}
            placeholder={app.translator.trans('fof-gamification.admin.page.ranks.help.points')}
            type="number"
            oninput={withAttr('value', this.newRank.points)}
          />
          <input
            className="FormControl Ranks-name"
            value={this.newRank.name()}
            placeholder={app.translator.trans('fof-gamification.admin.page.ranks.help.name')}
            oninput={withAttr('value', this.newRank.name)}
          />
          <input
            className="FormControl Ranks-color"
            value={this.newRank.color()}
            placeholder={app.translator.trans('fof-gamification.admin.page.ranks.help.color')}
            oninput={withAttr('value', this.newRank.color)}
          />

          <Button
            type="button"
            className="Button Button--primary Button--icon Ranks-button"
            icon="fa fa-plus"
            aria-label="add"
            onclick={this.addRank.bind(this)}
          />
        </div>
      </div>,
      100
    );

    items.add(
      'rankNumbers',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.ranks.number_title')}</label>
        <input
          className="FormControl Ranks-default"
          value={this.values.rankAmt()}
          type="number"
          min="0"
          oninput={withAttr('value', this.values.rankAmt)}
        />
      </div>,
      80
    );

    return items;
  }

  voteItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'enabledTags',
      <FormGroup
        type="flarum-tags.select-tags"
        label={app.translator.trans('fof-gamification.admin.page.votes.enabled_tags')}
        help={app.translator.trans('fof-gamification.admin.page.votes.enabled_tags_help')}
        stream={this.values['enabled-tags']}
        options={{ requireParentTag: false }}
      />,
      100
    );

    items.add(
      'icon',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.votes.icon_name')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.votes.icon_help')}</div>
        <input className="FormControl Ranks-default" value={this.values.iconName() || ''} oninput={withAttr('value', this.values.iconName)} />
        {this.values.iconName() && (
          <div className="IconPreview">
            <span>
              <Icon name={`fas fa-fw fa-${this.values.iconName()}-up`} />
              <span>{app.translator.trans('fof-gamification.admin.page.votes.icon_preview_upvote')}</span>
            </span>
            <span>
              <Icon name={`fas fa-fw fa-${this.values.iconName()}-down`} />
              <span>{app.translator.trans('fof-gamification.admin.page.votes.icon_preview_downvote')}</span>
            </span>
          </div>
        )}
      </div>,
      100
    );

    items.add(
      'altIcon',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.alt_votes.icon_name')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.votes.icon_help')}</div>
        <input className="FormControl Ranks-default" value={this.values.iconNameAlt() || ''} oninput={withAttr('value', this.values.iconNameAlt)} />
        {this.values.iconNameAlt() && (
          <div className="IconPreview">
            <span>
              <Icon name={`fas fa-fw fa-${this.values.iconNameAlt()}-up`} />
              <span>{app.translator.trans('fof-gamification.admin.page.votes.icon_preview_upvote')}</span>
            </span>
            <span>
              <Icon name={`fas fa-fw fa-${this.values.iconNameAlt()}-down`} />
              <span>{app.translator.trans('fof-gamification.admin.page.votes.icon_preview_downvote')}</span>
            </span>
          </div>
        )}
      </div>,
      90
    );

    items.add(
      'autoUpvote',
      <div className="Form-group">
        <Switch state={this.values.autoUpvotePosts() || false} onchange={this.values.autoUpvotePosts} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.auto_upvote')}
        </Switch>
      </div>,
      80
    );

    items.add(
      'rateLimit',
      <div className="Form-group">
        <Switch state={this.values.rateLimit() || false} onchange={this.values.rateLimit} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.rate_limit')}
        </Switch>
      </div>,
      70
    );

    items.add(
      'opVotesOnDiscussionList',
      <div className="Form-group">
        <Switch state={this.values.showVotesOnDiscussionPage() || false} onchange={this.values.showVotesOnDiscussionPage} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.discussion_page')}
        </Switch>
      </div>,
      60
    );

    items.add(
      'altDiscussionListLayout',
      <div className="Form-group">
        <Switch state={this.values.useAlternateLayout() || false} onchange={this.values.useAlternateLayout} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.alternate_layout')}
        </Switch>
      </div>,
      50
    );

    items.add(
      'altPostLayout',
      <div className="Form-group">
        <Switch state={this.values.altPostVotingUi() || false} onchange={this.values.altPostVotingUi} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.alternate_post_layout')}
        </Switch>
      </div>,
      40
    );

    items.add(
      'upvotesOnly',
      <div className="Form-group">
        <Switch state={this.values.upVotesOnly() || false} onchange={this.values.upVotesOnly} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.upvotes_only')}
        </Switch>
      </div>,
      30
    );

    items.add(
      'firstPostOnly',
      <div className="Form-group">
        <Switch state={this.values.firstPostOnly() || false} onchange={this.values.firstPostOnly} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.first_post_only')}
        </Switch>
      </div>,
      20
    );

    items.add(
      'allowSelfVotes',
      <div className="Form-group">
        <Switch state={this.values.allowSelfVotes()} onchange={this.values.allowSelfVotes} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.votes.allow_self_votes')}
        </Switch>
      </div>,
      10
    );

    return items;
  }

  rankingsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'customImages',
      <div className="Form-group">
        <Switch state={this.values.customRankingImages() || false} onchange={this.values.customRankingImages} className="votes-switch">
          {app.translator.trans('fof-gamification.admin.page.rankings.enable')}
        </Switch>
      </div>,
      100
    );

    items.add(
      'defaultMetric',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.rankings.default_metric.title')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.rankings.default_metric.help')}</div>
        <Select
          options={(app.forum.attribute<LeaderboardMetric[]>('fof-gamification.leaderboardMetrics') || []).reduce(
            (options: Record<string, Mithril.Children>, metric) => {
              options[metric.key] = app.translator.trans(metric.label);
              return options;
            },
            {}
          )}
          value={this.values.defaultMetric() || 'posts'}
          onchange={this.values.defaultMetric}
        />
      </div>,
      95
    );

    items.add(
      'defaultPeriod',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.rankings.default_period.title')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.rankings.default_period.help')}</div>
        <Select
          options={(app.forum.attribute<string[]>('fof-gamification.leaderboardPeriods') || []).reduce(
            (options: Record<string, Mithril.Children>, period) => {
              options[period] = app.translator.trans(`fof-gamification.forum.leaderboard.period.${period}`);
              return options;
            },
            {}
          )}
          value={this.values.defaultPeriod() || 'year'}
          onchange={this.values.defaultPeriod}
        />
      </div>,
      94
    );

    items.add(
      'excludedUsers',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.rankings.excluded_users.title')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.rankings.excluded_users.help')}</div>
        <ExcludedUsersSetting value={this.values.excludedUsers() || '[]'} onchange={this.values.excludedUsers} />
      </div>,
      90
    );

    items.add(
      'excludedGroups',
      <div className="Form-group">
        <label>{app.translator.trans('fof-gamification.admin.page.rankings.excluded_groups.title')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.rankings.excluded_groups.help')}</div>
        <ExcludedGroupsSetting value={this.values.excludedGroups() || '[]'} onchange={this.values.excludedGroups} />
      </div>,
      85
    );

    items.add(
      'excludeSuspended',
      <div className="Form-group">
        <Switch state={this.values.excludeSuspended() ?? true} onchange={this.values.excludeSuspended}>
          {app.translator.trans('fof-gamification.admin.page.rankings.exclude_suspended')}
        </Switch>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.rankings.exclude_suspended_help')}</div>
      </div>,
      84
    );

    items.add(
      'customImageUploads',
      <>
        {[1, 2, 3].map((num) => (
          <div className="Form-group">
            <label className="Upload-label">{app.translator.trans(`fof-gamification.admin.page.rankings.custom_image_${num}`)}</label>
            <UploadImageButton
              className="Upload-button"
              name={`fof-gamification.topimage${num}`}
              routePath={`fof/gamification/topimage${num}`}
              aria-label={app.translator.trans(`fof-gamification.admin.page.rankings.custom_image_${num}`)}
            />
            <br />
          </div>
        ))}
      </>,
      80
    );

    return items;
  }
}
