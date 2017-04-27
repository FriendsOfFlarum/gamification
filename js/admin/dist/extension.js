"use strict";

System.register("Reflar/gamification/addSettingsPage", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "Reflar/gamification/components/SettingsPage"], function (_export, _context) {
    "use strict";

    var extend, AdminNav, AdminLinkButton, SettingsPage;

    _export("default", function () {
        app.routes['reflar-gamification'] = { path: '/reflar/gamification', component: SettingsPage.component() };

        app.extensionSettings['reflar-gamification'] = function () {
            return m.route(app.route('reflar-gamification'));
        };

        extend(AdminNav.prototype, 'items', function (items) {
            items.add('reflar-gamification', AdminLinkButton.component({
                href: app.route('reflar-gamification'),
                icon: 'thumbs-up',
                children: 'Gamification',
                description: app.translator.trans('reflar-gamification.admin.nav.desc')
            }));
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAdminNav) {
            AdminNav = _flarumComponentsAdminNav.default;
        }, function (_flarumComponentsAdminLinkButton) {
            AdminLinkButton = _flarumComponentsAdminLinkButton.default;
        }, function (_ReflarGamificationComponentsSettingsPage) {
            SettingsPage = _ReflarGamificationComponentsSettingsPage.default;
        }],
        execute: function () {}
    };
});;
"use strict";

System.register("Reflar/gamification/components/SettingsPage", ["flarum/Component", "flarum/components/Button", "flarum/utils/saveSettings", "flarum/components/Alert"], function (_export, _context) {
    "use strict";

    var Component, Button, saveSettings, Alert, SettingsPage;
    return {
        setters: [function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumUtilsSaveSettings) {
            saveSettings = _flarumUtilsSaveSettings.default;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
        }],
        execute: function () {
            SettingsPage = function (_Component) {
                babelHelpers.inherits(SettingsPage, _Component);

                function SettingsPage() {
                    babelHelpers.classCallCheck(this, SettingsPage);
                    return babelHelpers.possibleConstructorReturn(this, (SettingsPage.__proto__ || Object.getPrototypeOf(SettingsPage)).apply(this, arguments));
                }

                babelHelpers.createClass(SettingsPage, [{
                    key: "init",
                    value: function init() {
                        var _this2 = this;

                        this.loading = false;

                        this.fields = ['convertedLikes', 'defaultRank', 'amountPerPost', 'amountPerDiscussion', 'postStartAmount', 'rankHolder', 'iconName'];

                        // fields that are objects
                        this.objects = ['ranks'];

                        this.values = {};

                        this.settingsPrefix = 'reflar.gamification';

                        var settings = app.data.settings;

                        this.fields.forEach(function (key) {
                            return _this2.values[key] = m.prop(settings[_this2.addPrefix(key)]);
                        });

                        this.objects.forEach(function (key) {
                            return _this2.values[key] = settings[_this2.addPrefix(key)] ? m.prop(JSON.parse(settings[_this2.addPrefix(key)])) : m.prop('');
                        });

                        this.values.ranks() || (this.values.ranks = m.prop({
                            '50': 'Helper: #000'
                        }));

                        this.newRank = {
                            'points': m.prop(''),
                            'name': m.prop('')
                        };
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this3 = this;

                        return [m('div', { className: 'SettingsPage' }, [m('div', { className: 'container' }, [m('form', { onsubmit: this.onsubmit.bind(this) }, [m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.convert.help')), this.values.convertedLikes() === undefined ? Button.component({
                            type: 'button',
                            className: 'Button Button--warning Ranks-button',
                            children: app.translator.trans('reflar-gamification.admin.page.convert.button'),
                            onclick: function onclick() {
                                app.request({
                                    url: app.forum.attribute('apiUrl') + '/reflar/gamification/convert',
                                    method: 'POST'
                                }).then(_this3.values.convertedLikes('converting'));
                            }
                        }) : this.values.convertedLikes() === 'converting' ? m('label', {}, app.translator.trans('reflar-gamification.admin.page.convert.converting')) : m('label', {}, app.translator.trans('reflar-gamification.admin.page.convert.converted', { number: this.values.convertedLikes() })), m('fieldset', { className: 'SettingsPage-ranks' }, [m('legend', {}, app.translator.trans('reflar-gamification.admin.page.ranks.title')), m('label', {}, app.translator.trans('reflar-gamification.admin.page.ranks.ranks')), m('div', { className: 'Ranks--Container' }, Object.keys(this.values.ranks()).map(function (rank) {
                            return m('div', {}, [m('input', {
                                className: 'FormControl Ranks-number',
                                type: 'number',
                                value: rank,
                                oninput: m.withAttr('value', _this3.updateRankPoints.bind(_this3, rank))
                            }), m('input', {
                                className: 'FormControl Ranks-name',
                                value: _this3.values.ranks()[rank],
                                oninput: m.withAttr('value', _this3.updateRankName.bind(_this3, rank))
                            }), Button.component({
                                type: 'button',
                                className: 'Button Button--warning Ranks-button',
                                icon: 'times',
                                onclick: _this3.deleteRank.bind(_this3, rank)
                            })]);
                        }), m('br'), m('div', {}, [m('input', {
                            className: 'FormControl Ranks-number',
                            value: this.newRank.points(),
                            type: 'number',
                            oninput: m.withAttr('value', this.newRank.points)
                        }), m('input', {
                            className: 'FormControl Ranks-name',
                            value: this.newRank.name(),
                            oninput: m.withAttr('value', this.newRank.name)
                        }), Button.component({
                            type: 'button',
                            className: 'Button Button--warning Ranks-button',
                            icon: 'plus',
                            onclick: this.addRank.bind(this)
                        })])), m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.ranks.help')), m('label', {}, app.translator.trans('reflar-gamification.admin.page.ranks.default')), m('input', {
                            className: 'FormControl Ranks-default',
                            value: this.values.defaultRank() || '',
                            placeholder: 'Newbie',
                            oninput: m.withAttr('value', this.values.defaultRank)
                        }), m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.ranks.default_help')), m('label', {}, app.translator.trans('reflar-gamification.admin.page.ranks.name')), m('input', {
                            className: 'FormControl Ranks-default',
                            value: this.values.rankHolder() || '',
                            placeholder: 'Rank: {rank}',
                            oninput: m.withAttr('value', this.values.rankHolder)
                        }), m('label', {}, app.translator.trans('reflar-gamification.admin.page.icon_name')), m('input', {
                            className: 'FormControl Ranks-default',
                            value: this.values.iconName() || '',
                            placeholder: 'thumbs',
                            oninput: m.withAttr('value', this.values.iconName)
                        }), m('div', { className: 'helpText' }, app.translator.trans('reflar-gamification.admin.page.icon_help')), Button.component({
                            type: 'submit',
                            className: 'Button Button--primary Ranks-save',
                            children: app.translator.trans('reflar-gamification.admin.page.save_settings'),
                            loading: this.loading,
                            disabled: !this.changed()
                        })])])])])];
                    }
                }, {
                    key: "updateRankPoints",
                    value: function updateRankPoints(rank, value) {
                        this.values.ranks()[value] = this.values.ranks()[rank];

                        this.deleteRank(rank);
                    }
                }, {
                    key: "updateRankName",
                    value: function updateRankName(rank, value) {
                        this.values.ranks()[rank] = value;
                    }
                }, {
                    key: "deleteRank",
                    value: function deleteRank(rank) {
                        delete this.values.ranks()[rank];
                    }
                }, {
                    key: "addRank",
                    value: function addRank() {
                        this.values.ranks()[this.newRank.points()] = this.newRank.name();

                        this.newRank.points('');
                        this.newRank.name('');
                    }
                }, {
                    key: "changed",
                    value: function changed() {
                        var _this4 = this;

                        var fieldsCheck = this.fields.some(function (key) {
                            return _this4.values[key]() !== app.data.settings[_this4.addPrefix(key)];
                        });
                        var objectsCheck = this.objects.some(function (key) {
                            return JSON.stringify(_this4.values[key]()) !== app.data.settings[_this4.addPrefix(key)];
                        });
                        return fieldsCheck || objectsCheck;
                    }
                }, {
                    key: "onsubmit",
                    value: function onsubmit(e) {
                        var _this5 = this;

                        e.preventDefault();

                        if (this.loading) return;

                        this.loading = true;

                        app.alerts.dismiss(this.successAlert);

                        var settings = {};

                        this.fields.forEach(function (key) {
                            return settings[_this5.addPrefix(key)] = _this5.values[key]();
                        });
                        this.objects.forEach(function (key) {
                            return settings[_this5.addPrefix(key)] = JSON.stringify(_this5.values[key]());
                        });

                        saveSettings(settings).then(function () {
                            app.alerts.show(_this5.successAlert = new Alert({
                                type: 'success',
                                children: app.translator.trans('core.admin.basics.saved_message')
                            }));
                        }).catch(function () {}).then(function () {
                            _this5.loading = false;
                            window.location.reload();
                        });
                    }
                }, {
                    key: "addPrefix",
                    value: function addPrefix(key) {
                        return this.settingsPrefix + '.' + key;
                    }
                }]);
                return SettingsPage;
            }(Component);

            _export("default", SettingsPage);
        }
    };
});;
'use strict';

System.register('Reflar/gamification/main', ['flarum/app', 'flarum/extend', 'flarum/components/PermissionGrid', 'Reflar/gamification/addSettingsPage'], function (_export, _context) {
  "use strict";

  var app, extend, PermissionGrid, addSettingsPage;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }, function (_ReflarGamificationAddSettingsPage) {
      addSettingsPage = _ReflarGamificationAddSettingsPage.default;
    }],
    execute: function () {

      app.initializers.add('reflar-gamification', function () {

        extend(PermissionGrid.prototype, 'replyItems', function (items) {
          items.add('Vote', {
            icon: 'thumbs-up',
            label: app.translator.trans('reflar-gamification.admin.permissions.vote_label'),
            permission: 'discussion.vote'
          });
        });

        extend(PermissionGrid.prototype, 'viewItems', function (items) {
          items.add('canSeeVotes', {
            icon: 'info-circle',
            label: app.translator.trans('reflar-gamification.admin.permissions.see_votes_label'),
            permission: 'discussion.canSeeVotes'
          });
        });

        addSettingsPage();
      });
    }
  };
});