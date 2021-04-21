import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import saveSettings from 'flarum/admin/utils/saveSettings';
import Switch from 'flarum/common/components/Switch';
import withAttr from 'flarum/common/utils/withAttr';
import Stream from 'flarum/common/utils/Stream';
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
        ];

        this.switches = ['autoUpvotePosts', 'customRankingImages', 'rateLimit', 'showVotesOnDiscussionPage', 'useAlternateLayout'];

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
        return [
            m('div', { className: 'SettingsPage' }, [
                m('div', { className: 'container' }, [
                    m('form', { onsubmit: this.onsubmit.bind(this) }, [
                        m('div', { className: 'helpText' }, app.translator.trans('fof-gamification.admin.page.convert.help')),
                        this.values.convertedLikes() === undefined
                            ? Button.component(
                                  {
                                      type: 'button',
                                      className: 'Button Button--warning Ranks-button',
                                      onclick: () => {
                                          app.request({
                                              url: app.forum.attribute('apiUrl') + '/fof/gamification/convert',
                                              method: 'POST',
                                          }).then(this.values.convertedLikes('converting'));
                                      },
                                  },
                                  app.translator.trans('fof-gamification.admin.page.convert.button')
                              )
                            : this.values.convertedLikes() === 'converting'
                            ? m('label', {}, app.translator.trans('fof-gamification.admin.page.convert.converting'))
                            : m(
                                  'label',
                                  {},
                                  app.translator.trans('fof-gamification.admin.page.convert.converted', { number: this.values.convertedLikes() })
                              ),
                        m('fieldset', { className: 'SettingsPage-ranks' }, [
                            m('legend', {}, app.translator.trans('fof-gamification.admin.page.ranks.title')),
                            m('label', {}, app.translator.trans('fof-gamification.admin.page.ranks.ranks')),
                            m('div', { className: 'helpText' }, app.translator.trans('fof-gamification.admin.page.ranks.help.help')),
                            m(
                                'div',
                                { className: 'Ranks--Container' },
                                this.ranks.map((rank) => {
                                    return m('div', { style: 'float: left;' }, [
                                        m('input', {
                                            className: 'FormControl Ranks-number',
                                            type: 'number',
                                            value: rank.points(),
                                            placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.points'),
                                            oninput: withAttr('value', this.updatePoints.bind(this, rank)),
                                        }),
                                        m('input', {
                                            className: 'FormControl Ranks-name',
                                            value: rank.name(),
                                            placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.name'),
                                            oninput: withAttr('value', this.updateName.bind(this, rank)),
                                        }),
                                        m('input', {
                                            className: 'FormControl Ranks-color',
                                            value: rank.color(),
                                            placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.color'),
                                            oninput: withAttr('value', this.updateColor.bind(this, rank)),
                                        }),
                                        Button.component({
                                            type: 'button',
                                            className: 'Button Button--warning Ranks-button',
                                            icon: 'fa fa-times',
                                            onclick: this.deleteRank.bind(this, rank),
                                        }),
                                    ]);
                                }),
                                m('div', { style: 'float: left; margin-bottom: 15px' }, [
                                    m('input', {
                                        className: 'FormControl Ranks-number',
                                        value: this.newRank.points(),
                                        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.points'),
                                        type: 'number',
                                        oninput: withAttr('value', this.newRank.points),
                                    }),
                                    m('input', {
                                        className: 'FormControl Ranks-name',
                                        value: this.newRank.name(),
                                        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.name'),
                                        oninput: withAttr('value', this.newRank.name),
                                    }),
                                    m('input', {
                                        className: 'FormControl Ranks-color',
                                        value: this.newRank.color(),
                                        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.color'),
                                        oninput: withAttr('value', this.newRank.color),
                                    }),
                                    Button.component({
                                        type: 'button',
                                        className: 'Button Button--warning Ranks-button',
                                        icon: 'fa fa-plus',
                                        onclick: this.addRank.bind(this),
                                    }),
                                ])
                            ),
                            m('label', {}, app.translator.trans('fof-gamification.admin.page.ranks.number_title')),
                            m('input', {
                                className: 'FormControl Ranks-default',
                                value: this.values.rankAmt() || '',
                                placeholder: 2,
                                oninput: withAttr('value', this.values.rankAmt),
                            }),

                            m('legend', {}, app.translator.trans('fof-gamification.admin.page.votes.title')),
                            m('label', {}, app.translator.trans('fof-gamification.admin.page.votes.icon_name')),
                            m('div', { className: 'helpText' }, app.translator.trans('fof-gamification.admin.page.votes.icon_help')),
                            m('input', {
                                className: 'FormControl Ranks-default',
                                value: this.values.iconName() || '',
                                placeholder: 'thumbs',
                                oninput: withAttr('value', this.values.iconName),
                            }),
                            Switch.component(
                                {
                                    state: this.values.autoUpvotePosts() || false,
                                    onchange: this.values.autoUpvotePosts,
                                    className: 'votes-switch',
                                },
                                app.translator.trans('fof-gamification.admin.page.votes.auto_upvote')
                            ),
                            Switch.component(
                                {
                                    state: this.values.rateLimit() || false,
                                    onchange: this.values.rateLimit,
                                    className: 'votes-switch',
                                },
                                app.translator.trans('fof-gamification.admin.page.votes.rate_limit')
                            ),
                            Switch.component(
                                {
                                    state: this.values.showVotesOnDiscussionPage() || false,
                                    onchange: this.values.showVotesOnDiscussionPage,
                                    className: 'votes-switch',
                                },
                                app.translator.trans('fof-gamification.admin.page.votes.discussion_page')
                            ),
                            Switch.component(
                                {
                                    state: this.values.useAlternateLayout() || false,
                                    onchange: this.values.useAlternateLayout,
                                    className: 'votes-switch',
                                },
                                app.translator.trans('fof-gamification.admin.page.votes.alternate_layout')
                            ),
                            m('label', {}, app.translator.trans('fof-gamification.admin.page.votes.points_title')),
                            m('input', {
                                className: 'FormControl Ranks-default',
                                value: this.values.pointsPlaceholder() || '',
                                placeholder: app.translator.trans('fof-gamification.admin.page.votes.points_placeholder') + '{points}',
                                oninput: withAttr('value', this.values.pointsPlaceholder),
                            }),

                            m('legend', {}, app.translator.trans('fof-gamification.admin.page.rankings.title')),
                            Switch.component(
                                {
                                    state: this.values.customRankingImages() || false,
                                    onchange: this.values.customRankingImages,
                                    className: 'votes-switch',
                                },
                                app.translator.trans('fof-gamification.admin.page.rankings.enable')
                            ),
                            m('label', {}, app.translator.trans('fof-gamification.admin.page.rankings.blocked.title')),
                            m('input', {
                                className: 'FormControl Ranks-blocked',
                                placeholder: app.translator.trans('fof-gamification.admin.page.rankings.blocked.placeholder'),
                                value: this.values.blockedUsers() || '',
                                oninput: withAttr('value', this.values.blockedUsers),
                            }),
                            m('div', { className: 'helpText' }, app.translator.trans('fof-gamification.admin.page.rankings.blocked.help')),
                            ...[1, 2, 3].map((num) => [
                                <label className="Upload-label">
                                    {app.translator.trans(`fof-gamification.admin.page.rankings.custom_image_${num}`)}
                                </label>,
                                <UploadImageButton
                                    className="Upload-button"
                                    name={`fof-gamification.topimage${num}`}
                                    path={`fof/gamification/topimage${num}`}
                                />,
                                <br />,
                            ]),
                            Button.component(
                                {
                                    type: 'submit',
                                    className: 'Button Button--primary Ranks-save',
                                    loading: this.loading,
                                    disabled: !this.changed(),
                                },
                                app.translator.trans('fof-gamification.admin.page.save_settings')
                            ),
                        ]),
                    ]),
                ]),
            ]),
        ];
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

    addRank(rank) {
        app.store
            .createRecord('ranks')
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

    /**
     *
     * @returns boolean
     */
    changed() {
        var switchesCheck = this.switches.some((key) => this.values[key]() !== (app.data.settings[this.addPrefix(key)] == '1'));
        var fieldsCheck = this.fields.some((key) => this.values[key]() !== app.data.settings[this.addPrefix(key)]);
        return fieldsCheck || switchesCheck;
    }

    /**
     * @param e
     */
    onsubmit(e) {
        e.preventDefault();

        if (this.loading) return;

        this.loading = true;

        app.alerts.dismiss(this.successAlert);

        const settings = {};

        this.switches.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));
        this.fields.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]()));

        saveSettings(settings)
            .then(() => {
                app.alerts.show({ type: 'success' }, app.translator.trans('core.admin.basics.saved_message'));
            })
            .catch(() => {})
            .then(() => {
                this.loading = false;
                window.location.reload();
            });
    }

    /**
     * @returns string
     */
    addPrefix(key) {
        return this.settingsPrefix + '.' + key;
    }
}
