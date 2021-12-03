import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import withAttr from 'flarum/common/utils/withAttr';
import UploadImageButton from './UploadImageButton';

export default class GamificationSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);

    this.ranks = app.store.all('ranks');

    this.newRank = {
        points: Stream(''),
        name: Stream(''),
        color: Stream(''),
      };

    this.values = {};
  }

  content() {
    return (
      <div className="container">
        <div className="SettingsPage">
        {this.settingsItems().toArray()}
            {this.submitButton()}
        </div>
      </div>
    );
  }

  settingsItems() {
    const items = new ItemList();

    items.add(
        'ranks',
        <fieldset className="SettingsPage-ranks">
          <h2>{app.translator.trans('fof-gamification.admin.page.ranks.title')}</h2>
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
          {this.buildSettingComponent({
              class: 'FormControl Ranks-default',
              label: app.translator.trans('fof-gamification.admin.page.ranks.number_title'),
              setting: 'fof-gamification.rankAmt',
              type: 'number',
              placeholder: '2',
              min: 0
          })}
        </fieldset>,
        90
      );

    items.add(
      'voteSettings',
      <>
        <h2>{app.translator.trans('fof-gamification.admin.page.votes.title')}</h2>
        {this.voteItems().toArray()}
      </>,
      80
    );

    items.add(
      'rankingsPage',
      <>
        <h2>{app.translator.trans('fof-gamification.admin.page.rankings.title')}</h2>
        {this.rankingsItems().toArray()}
      </>,
      70
    );

    return items;
  }

  voteItems() {
    const items = new ItemList();

    items.add(
      'icon',
      this.buildSettingComponent({
        class: 'FormControl Ranks-default',
        label: app.translator.trans('fof-gamification.admin.page.votes.icon_name'),
        help: app.translator.trans('fof-gamification.admin.page.votes.icon_help'),
        type: 'string',
        setting: 'fof-gamification.iconName',
        placeholder: 'thumbs',
      }),
      100
    );

    items.add(
      'altIcon',
      this.buildSettingComponent({
          class: 'FormControl Ranks-default',
        label: app.translator.trans('fof-gamification.admin.page.alt_votes.icon_name'),
        help: app.translator.trans('fof-gamification.admin.page.votes.icon_help'),
        type: 'string',
        setting: 'fof-gamification.iconNameAlt',
        placeholder: 'arrow',
      }),
      90
    );

    items.add(
      'autoUpvote',
      this.buildSettingComponent({
        label: app.translator.trans('fof-gamification.admin.page.votes.auto_upvote'),
        type: 'boolean',
        setting: 'fof-gamification.autoUpvotePosts',
      }),
      80
    );

    items.add(
      'rateLimit',
      this.buildSettingComponent({
        label: app.translator.trans('fof-gamification.admin.page.votes.rate_limit'),
        type: 'boolean',
        setting: 'fof-gamification.rateLimit',
      }),
      70
    );

    items.add(
      'altDiscussionListLayout',
      this.buildSettingComponent({
        label: app.translator.trans('fof-gamification.admin.page.votes.alternate_layout'),
        type: 'boolean',
        setting: 'fof-gamification.useAlternateLayout',
      }),
      50
    );

    items.add(
      'altPostLayout',
      this.buildSettingComponent({
        label: app.translator.trans('fof-gamification.admin.page.votes.alternate_post_layout'),
        type: 'boolean',
        setting: 'fof-gamification.altPostVotingUi',
      }),
      40
    );

    items.add(
      'upvotesOnly',
      this.buildSettingComponent({
        label: app.translator.trans('fof-gamification.admin.page.votes.upvotes_only'),
        type: 'boolean',
        setting: 'fof-gamification.upVotesOnly',
      }),
      30
    );

    items.add(
      'firstPostOnly',
      this.buildSettingComponent({
        label: app.translator.trans('fof-gamification.admin.page.votes.first_post_only'),
        type: 'boolean',
        setting: 'fof-gamification.firstPostOnly',
      }),
      20
    );

    items.add(
      'pointsPlaceholder',
      this.buildSettingComponent({
          class: 'FormControl Ranks-default',
        label: app.translator.trans('fof-gamification.admin.page.votes.points_title'),
        type: 'string',
        setting: 'fof-gamification.pointsPlaceholder',
        placeholder: app.translator.trans('fof-gamification.admin.page.votes.points_placeholder') + '{points}',
      }),
      10
    );

    return items;
  }

  rankingsItems() {
    const items = new ItemList();

    items.add(
      'useCustomImages',
      this.buildSettingComponent({
        label: app.translator.trans('fof-gamification.admin.page.rankings.enable'),
        type: 'boolean',
        setting: 'fof-gamification.customRankingImages',
      }),
      90
    );

    items.add(
      'ignoredUsers',
      this.buildSettingComponent({
          class: 'FormControl Ranks-default',
        label: app.translator.trans('fof-gamification.admin.page.rankings.blocked.title'),
        help: app.translator.trans('fof-gamification.admin.page.rankings.blocked.help'),
        type: 'string',
        setting: 'fof-gamification.blockedUsers',
        placeholder: app.translator.trans('fof-gamification.admin.page.rankings.blocked.placeholder'),
      }),
      100
    );

    items.add(
      'customImages',
      <>
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
}
