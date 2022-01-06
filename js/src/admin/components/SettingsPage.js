import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import saveSettings from 'flarum/admin/utils/saveSettings';
import Switch from 'flarum/common/components/Switch';
import withAttr from 'flarum/common/utils/withAttr';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import UploadImageButton from './UploadImageButton';

export default class SettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);

    this.fields = [
      'convertedLikes',
      'amountPerPost',
      'amountPerDiscussion',
      'postStartAmount',
      'rankAmt',
      'iconName',
      'blockedUsers',
      'pointsPlaceholder',
      'iconNameAlt',
    ];

    this.switches = [
      'autoUpvotePosts',
      'customRankingImages',
      'rateLimit',
      'showVotesOnDiscussionPage',
      'useAlternateLayout',
      'altPostVotingUi',
      'upVotesOnly',
      'firstPostOnly',
    ];

    this.ranks = app.store.all('ranks');

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

  /**
   * @returns {*}
   */
  content() {
    return (
      <div className="SettingsPage">
        <div className="container">
          <form onsubmit={this.onsubmit.bind(this)}>{this.settingsItems().toArray()}</form>
        </div>
      </div>
    );
  }

  updateName(rank, value) {
    rank.save({ name: value });
  }

  updatePoints(rank, value) {
    rank.save({ points: value });
  }

  updateColor(rank, value) {
    rank.save({ color: value });
  }

  deleteRank(rankToDelete) {
    rankToDelete.delete();
    this.ranks.some((rank, i) => {
      if (rank.data.id === rankToDelete.data.id) {
        this.ranks.splice(i, 1);
        return true;
      }
    });
  }

  addRank() {
    app.store
      .createRecord('ranks')
      .save({
        points: this.newRank.points(),
        name: this.newRank.name(),
        color: this.newRank.color(),
      })
      .then(() => {
        this.newRank.color('');
        this.newRank.name('');
        this.newRank.points('');

        m.redraw();
      });
  }

  /**
   *
   * @returns boolean
   */
  changed() {
    var switchesCheck = this.switches.some((key) => this.values[key]() !== (app.data.settings[this.addPrefix(key)] == '1'));
    var fieldsCheck = this.fields.some((key) => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
    return fieldsCheck || switchesCheck;
  }

  prepareSubmissionData() {
    const settings = {};

    this.switches.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));
    this.fields.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));

    return settings;
  }

  /**
   * @param e
   */
  onsubmit(e) {
    e.preventDefault();

    if (this.loading) return;

    this.loading = true;

    app.alerts.dismiss(this.successAlert);

    saveSettings(this.prepareSubmissionData())
      .then(this.onsaved.bind(this))
      .then(() => window.location.reload())
      .catch(console.error)
      .then(() => {
        this.loading = false;
      });
  }

  /**
   * @returns string
   */
  addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  }

  settingsItems() {
    const items = new ItemList();

    items.add(
      'convertLikesToUpvotes',
      <div>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.convert.help')}</div>
        {this.values.convertedLikes() === undefined ? (
          <Button
            type="button"
            className="Button Button--warning Ranks-button"
            aria-label={app.translator.trans('fof-gamification.admin.page.convert.button')}
            onclick={() => {
              app
                .request({
                  url: app.forum.attribute('apiUrl') + '/fof/gamification/convert',
                  method: 'POST',
                })
                .then(this.values.convertedLikes('converting'));
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

    items.add(
      'ranks',
      <fieldset className="SettingsPage-ranks">
        <legend>{app.translator.trans('fof-gamification.admin.page.ranks.title')}</legend>
        <label>{app.translator.trans('fof-gamification.admin.page.ranks.ranks')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.ranks.help.help')}</div>
        <div className="Ranks--Container">
          {this.ranks.map((rank) => (
            <div>
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
              <Button type="button" className="Button Button--warning Ranks-button" icon="fa fa-times" onclick={this.deleteRank.bind(this, rank)} />
            </div>
          ))}
        </div>
        <div>
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
            className="Button Button--warning Ranks-button"
            icon="fa fa-plus"
            aria-label="add"
            onclick={this.addRank.bind(this)}
          />
        </div>
        <label>{app.translator.trans('fof-gamification.admin.page.ranks.number_title')}</label>
        <input
          className="FormControl Ranks-default"
          value={this.values.rankAmt() || ''}
          placeholder="2"
          oninput={withAttr('value', this.values.rankAmt)}
        />
      </fieldset>,
      90
    );

    items.add(
      'voteSettings',
      <>
        <legend>{app.translator.trans('fof-gamification.admin.page.votes.title')}</legend>
        {this.voteItems().toArray()}
      </>,
      80
    );

    items.add(
      'rankingsPage',
      <>
        <legend>{app.translator.trans('fof-gamification.admin.page.rankings.title')}</legend>
        {this.rankingsItems().toArray()}
      </>,
      70
    );

    items.add(
      'submit',
      <Button type="submit" className="Button Button--primary Ranks-save" loading={this.loading} disabled={!this.changed()}>
        {app.translator.trans('fof-gamification.admin.page.save_settings')}
      </Button>,
      0
    );

    return items;
  }

  voteItems() {
    const items = new ItemList();

    items.add(
      'icon',
      <>
        <label>{app.translator.trans('fof-gamification.admin.page.votes.icon_name')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.votes.icon_help')}</div>
        <input
          className="FormControl Ranks-default"
          value={this.values.iconName() || ''}
          placeholder="thumbs"
          oninput={withAttr('value', this.values.iconName)}
        />
      </>,
      100
    );

    items.add(
      'altIcon',
      <>
        <label>{app.translator.trans('fof-gamification.admin.page.alt_votes.icon_name')}</label>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.votes.icon_help')}</div>
        <input
          className="FormControl Ranks-default"
          value={this.values.iconNameAlt() || ''}
          placeholder="arrow"
          oninput={withAttr('value', this.values.iconNameAlt)}
        />
      </>,
      90
    );

    items.add(
      'autoUpvote',
      <Switch state={this.values.autoUpvotePosts() || false} onchange={this.values.autoUpvotePosts} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.votes.auto_upvote')}
      </Switch>,
      80
    );

    items.add(
      'rateLimit',
      <Switch state={this.values.rateLimit() || false} onchange={this.values.rateLimit} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.votes.rate_limit')}
      </Switch>,
      70
    );

    items.add(
      'opVotesOnDiscussionList',
      <Switch state={this.values.showVotesOnDiscussionPage() || false} onchange={this.values.showVotesOnDiscussionPage} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.votes.discussion_page')}
      </Switch>,
      60
    );

    items.add(
      'altDiscussionListLayout',
      <Switch state={this.values.useAlternateLayout() || false} onchange={this.values.useAlternateLayout} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.votes.alternate_layout')}
      </Switch>,
      50
    );

    items.add(
      'altPostLayout',
      <Switch state={this.values.altPostVotingUi() || false} onchange={this.values.altPostVotingUi} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.votes.alternate_post_layout')}
      </Switch>,
      40
    );

    items.add(
      'upvotesOnly',
      <Switch state={this.values.upVotesOnly() || false} onchange={this.values.upVotesOnly} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.votes.upvotes_only')}
      </Switch>,
      30
    );

    items.add(
      'firstPostOnly',
      <Switch state={this.values.firstPostOnly() || false} onchange={this.values.firstPostOnly} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.votes.first_post_only')}
      </Switch>,
      20
    );

    items.add(
      'pointsPlaceholder',
      <>
        <label>{app.translator.trans('fof-gamification.admin.page.votes.points_title')}</label>
        <input
          className="FormControl Ranks-default"
          value={this.values.pointsPlaceholder() || ''}
          placeholder={app.translator.trans('fof-gamification.admin.page.votes.points_placeholder') + '{points}'}
          oninput={withAttr('value', this.values.pointsPlaceholder)}
        />
      </>,
      10
    );

    return items;
  }

  rankingsItems() {
    const items = new ItemList();

    items.add(
      'customImages',
      <Switch state={this.values.customRankingImages() || false} onchange={this.values.customRankingImages} className="votes-switch">
        {app.translator.trans('fof-gamification.admin.page.rankings.enable')}
      </Switch>,
      100
    );

    items.add(
      'ignoredUsers',
      <>
        <label>{app.translator.trans('fof-gamification.admin.page.rankings.blocked.title')}</label>
        <input
          className="FormControl Ranks-blocked"
          placeholder={app.translator.trans('fof-gamification.admin.page.rankings.blocked.placeholder')}
          value={this.values.blockedUsers() || ''}
          oninput={withAttr('value', this.values.blockedUsers)}
        />
      </>,
      90
    );

    items.add(
      'customImages',
      <>
        <div className="helpText">{app.translator.trans('fof-gamification.admin.page.rankings.blocked.help')}</div>
        {[1, 2, 3].map((num) => (
          <>
            <label className="Upload-label">{app.translator.trans(`fof-gamification.admin.page.rankings.custom_image_${num}`)}</label>
            <UploadImageButton
              className="Upload-button"
              name={`fof-gamification.topimage${num}`}
              path={`fof/gamification/topimage${num}`}
              aria-label={app.translator.trans(`fof-gamification.admin.page.rankings.custom_image_${num}`)}
            />
            <br />
          </>
        ))}
      </>,
      80
    );

    return items;
  }
}
