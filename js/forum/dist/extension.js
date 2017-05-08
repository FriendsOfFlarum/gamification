'use strict';

System.register('Reflar/gamification/components/AddAttributes', ['flarum/helpers/avatar', 'flarum/helpers/username', 'flarum/models/Discussion', 'flarum/extend', 'flarum/Model', 'flarum/models/Post', 'flarum/components/PostUser', 'flarum/models/User', 'flarum/components/UserCard', 'flarum/helpers/userOnline', 'flarum/helpers/listItems'], function (_export, _context) {
    "use strict";

    var avatar, username, Discussion, extend, Model, Post, PostUser, User, UserCard, userOnline, listItems;

    _export('default', function () {
        Discussion.prototype.canVote = Model.attribute('canVote');
        Discussion.prototype.canSeeVotes = Model.attribute('canSeeVotes');

        User.prototype.points = Model.attribute('points');
        User.prototype.ranks = Model.hasMany('ranks');

        Post.prototype.upvotes = Model.hasMany('upvotes');
        Post.prototype.downvotes = Model.hasMany('downvotes');

        extend(UserCard.prototype, 'infoItems', function (items, user) {
            var points = this.props.user.data.attributes.Points;

            if (points == 0) {
                points = '0';
            }

            items.add('points', app.translator.trans('reflar-gamification.forum.user.points', { points: points }));

            if (this.props.user.ranks() !== false) {

                this.props.user.ranks().map(function (rank) {
                    items.add(rank.name(), m(
                        'span',
                        { style: "color: " + rank.color() },
                        rank.name()
                    ));
                });
            }
        });

        PostUser.prototype.view = function () {
            var post = this.props.post;
            var user = post.user();

            if (!user) {
                return m(
                    'div',
                    { className: 'PostUser' },
                    m(
                        'h3',
                        null,
                        avatar(user, { className: 'PostUser-avatar' }),
                        ' ',
                        username(user),
                        ' ',
                        rank[0]
                    )
                );
            }

            var card = '';

            if (!post.isHidden() && this.cardVisible) {
                card = UserCard.component({
                    user: user,
                    className: 'UserCard--popover',
                    controlsButtonClassName: 'Button Button--icon Button--flat'
                });
            }

            return m(
                'div',
                { className: 'PostUser' },
                userOnline(user),
                m(
                    'h3',
                    null,
                    m(
                        'a',
                        { href: app.route.user(user), config: m.route },
                        avatar(user, { className: 'PostUser-avatar' }),
                        ' ',
                        username(user)
                    ),
                    user.ranks().map(function (rank) {
                        return m(
                            'span',
                            { className: 'Post-Rank', style: "color: " + rank.color() },
                            rank.name()
                        );
                    })
                ),
                m(
                    'ul',
                    { className: 'PostUser-badges badges' },
                    listItems(user.badges().toArray())
                ),
                card
            );
        };
    });

    return {
        setters: [function (_flarumHelpersAvatar) {
            avatar = _flarumHelpersAvatar.default;
        }, function (_flarumHelpersUsername) {
            username = _flarumHelpersUsername.default;
        }, function (_flarumModelsDiscussion) {
            Discussion = _flarumModelsDiscussion.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumModelsPost) {
            Post = _flarumModelsPost.default;
        }, function (_flarumComponentsPostUser) {
            PostUser = _flarumComponentsPostUser.default;
        }, function (_flarumModelsUser) {
            User = _flarumModelsUser.default;
        }, function (_flarumComponentsUserCard) {
            UserCard = _flarumComponentsUserCard.default;
        }, function (_flarumHelpersUserOnline) {
            userOnline = _flarumHelpersUserOnline.default;
        }, function (_flarumHelpersListItems) {
            listItems = _flarumHelpersListItems.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('Reflar/gamification/components/AddHotnessSort', ['flarum/extend', 'flarum/components/IndexPage', 'flarum/utils/ItemList', 'flarum/components/DiscussionList', 'flarum/components/Select'], function (_export, _context) {
    "use strict";

    var extend, IndexPage, ItemList, DiscussionList, Select;

    _export('default', function () {
        IndexPage.prototype.viewItems = function () {
            var items = new ItemList();
            var sortMap = app.cache.discussionList.sortMap();

            var sortOptions = {};
            for (var i in sortMap) {
                sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button');
            }

            var sort = this.params().sort;

            if (this.props.routeName == 'index.filter') {
                sort = 'hot';
            }

            items.add('sort', Select.component({
                options: sortOptions,
                value: sort || Object.keys(sortMap)[0],
                onchange: this.changeSort.bind(this)
            }));

            return items;
        };

        IndexPage.prototype.changeSort = function (sort) {
            var params = this.params();

            if (sort === 'hot') {
                m.route(app.route('index'));
                m.route(m.route() + 'hot');
            } else {
                if (sort === Object.keys(app.cache.discussionList.sortMap())[0]) {
                    delete params.sort;
                } else {
                    params.sort = sort;
                }
                if (params.filter == 'hot') {
                    delete params.filter;
                }
                m.route(app.route('index', params));
            }
        };

        extend(DiscussionList.prototype, 'sortMap', function (map) {
            map.hot = 'hot';
        });

        extend(DiscussionList.prototype, 'requestParams', function (params) {
            if (this.props.params.filter === 'hot') {
                params.filter.q = ' is:hot';
            }
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsIndexPage) {
            IndexPage = _flarumComponentsIndexPage.default;
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList.default;
        }, function (_flarumComponentsDiscussionList) {
            DiscussionList = _flarumComponentsDiscussionList.default;
        }, function (_flarumComponentsSelect) {
            Select = _flarumComponentsSelect.default;
        }],
        execute: function () {}
    };
});;
'use strict';

System.register('Reflar/gamification/components/AddVoteButtons', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/LogInModal', 'flarum/components/CommentPost', 'Reflar/gamification/components/VotesModal'], function (_export, _context) {
  "use strict";

  var extend, app, Button, LogInModal, CommentPost, VotesModal;

  _export('default', function () {
    extend(CommentPost.prototype, 'actionItems', function (items) {
      var post = this.props.post;

      var isUpvoted = app.session.user && post.upvotes().some(function (user) {
        return user === app.session.user;
      });
      var isDownvoted = app.session.user && post.downvotes().some(function (user) {
        return user === app.session.user;
      });

      var color = '';

      if (app.forum.attribute('autoUpvote') !== null && app.forum.attribute('autoUpvote') !== '') {
        color = app.forum.attribute('autoUpvote');
      } else {
        color = '#f44336';
      }

      if (!app.session.user) {
        isDownvoted = false;
        isUpvoted = false;
      }

      var icon = app.forum.attribute('IconName');

      if (icon === null || icon === '') {
        icon = 'thumbs';
      }

      items.add('upvote', Button.component({
        icon: icon + '-up',
        className: 'Post-vote Post-upvote',
        style: isUpvoted !== false ? 'color:' + color : 'color:',
        onclick: function onclick() {
          if (!app.session.user) {
            app.modal.show(new LogInModal());
            return;
          }
          if (post.isHidden() || !post.discussion().canVote()) return;
          var upData = post.data.relationships.upvotes.data;
          var downData = post.data.relationships.downvotes.data;

          isUpvoted = !isUpvoted;

          isDownvoted = false;

          post.save({ isUpvoted: isUpvoted, isDownvoted: isDownvoted });

          upData.some(function (upvote, i) {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1);
              return true;
            }
          });

          downData.some(function (downvote, i) {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1);
              return true;
            }
          });

          if (isUpvoted) {
            upData.unshift({ type: 'users', id: app.session.user.id() });
          }
        }
      }));

      items.add('points', m(
        'button',
        { className: 'Post-points', onclick: function onclick() {
            console.log('hi');
            if (!post.discussion().canSeeVotes()) return;
            console.log('wow');
            app.modal.show(new VotesModal({ post: post }));
          } },
        post.data.relationships.upvotes.data.length - post.data.relationships.downvotes.data.length
      ));

      items.add('downvote', Button.component({
        icon: icon + '-down',
        className: 'Post-vote Post-downvote',
        style: isDownvoted !== false ? 'color:' + color : '',
        onclick: function onclick() {
          if (!app.session.user) {
            app.modal.show(new LogInModal());
            return;
          }
          if (post.isHidden() || !post.discussion().canVote()) return;
          var upData = post.data.relationships.upvotes.data;
          var downData = post.data.relationships.downvotes.data;

          isDownvoted = !isDownvoted;

          isUpvoted = false;

          post.save({ isUpvoted: isUpvoted, isDownvoted: isDownvoted });

          upData.some(function (upvote, i) {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1);
              return true;
            }
          });

          downData.some(function (downvote, i) {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1);
              return true;
            }
          });

          if (isDownvoted) {
            downData.unshift({ type: 'users', id: app.session.user.id() });
          }
        }
      }));
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsLogInModal) {
      LogInModal = _flarumComponentsLogInModal.default;
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost.default;
    }, function (_ReflarGamificationComponentsVotesModal) {
      VotesModal = _ReflarGamificationComponentsVotesModal.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('Reflar/gamification/components/RankingsPage', ['flarum/helpers/avatar', 'flarum/Component', 'flarum/components/IndexPage', 'flarum/helpers/listItems', 'flarum/helpers/icon', 'flarum/helpers/username', 'flarum/components/UserCard'], function (_export, _context) {
  "use strict";

  var avatar, Component, IndexPage, listItems, icon, username, UserCard, RankingsPage;
  return {
    setters: [function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar.default;
    }, function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsIndexPage) {
      IndexPage = _flarumComponentsIndexPage.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default;
    }, function (_flarumComponentsUserCard) {
      UserCard = _flarumComponentsUserCard.default;
    }],
    execute: function () {
      RankingsPage = function (_Component) {
        babelHelpers.inherits(RankingsPage, _Component);

        function RankingsPage() {
          babelHelpers.classCallCheck(this, RankingsPage);
          return babelHelpers.possibleConstructorReturn(this, (RankingsPage.__proto__ || Object.getPrototypeOf(RankingsPage)).apply(this, arguments));
        }

        babelHelpers.createClass(RankingsPage, [{
          key: 'init',
          value: function init() {
            this.loading = true;
            this.moreResults = false;
            this.users = [];
            this.refresh();
          }
        }, {
          key: 'view',
          value: function view() {
            return m(
              'div',
              { className: 'RankingPage' },
              IndexPage.prototype.hero(),
              m(
                'div',
                { className: 'container' },
                m(
                  'nav',
                  { className: 'IndexPage-nav sideNav', config: IndexPage.prototype.affixSidebar },
                  m(
                    'ul',
                    null,
                    listItems(IndexPage.prototype.sidebarItems().toArray())
                  )
                ),
                m(
                  'div',
                  { className: 'sideNavOffset' },
                  m(
                    'table',
                    { 'class': 'rankings' },
                    m(
                      'tr',
                      null,
                      m(
                        'th',
                        null,
                        app.translator.trans('reflar-gamification.forum.ranking.rank')
                      ),
                      m(
                        'th',
                        null,
                        app.translator.trans('reflar-gamification.forum.ranking.name')
                      ),
                      m(
                        'th',
                        null,
                        app.translator.trans('reflar-gamification.forum.ranking.amount')
                      )
                    ),
                    this.users.map(function (user) {

                      user['user'].then(function (user) {

                        return [m(
                          'tr',
                          null,
                          m(
                            'td',
                            { 'class': "rankings-" + user['class'] },
                            icon("trophy")
                          ),
                          m(
                            'td',
                            null,
                            m(
                              'div',
                              { className: 'PostUser' },
                              m(
                                'h3',
                                { className: 'rankings-info' },
                                m(
                                  'a',
                                  { href: app.route.user(user), config: m.route },
                                  avatar(user, { className: 'info-avatar rankings-' + user + '-avatar' })
                                )
                              )
                            )
                          ),
                          m(
                            'td',
                            null,
                            user.data.attributes['antoinefr-money.money']
                          )
                        )];
                      });
                    })
                  )
                )
              )
            );
          }
        }, {
          key: 'refresh',
          value: function refresh() {
            var _this2 = this;

            var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            if (clear) {
              this.loading = true;
              this.users = [];
            }

            return this.loadResults().then(function (results) {
              _this2.users = [];
              _this2.parseResults(results);
            }, function () {
              _this2.loading = false;
              m.redraw();
            });
          }
        }, {
          key: 'loadResults',
          value: function loadResults(offset) {
            var params = {};
            params.page = {
              offset: offset,
              limit: '10'
            };
            params.sort = 'points';

            return app.store.find('users', params);
          }
        }, {
          key: 'loadMore',
          value: function loadMore() {
            this.loading = true;

            this.loadResults(this.users.length).then(this.parseResults.bind(this));
          }
        }, {
          key: 'parseResults',
          value: function parseResults(results) {
            [].push.apply(this.users, results);

            this.loading = false;
            this.moreResults = !!results.payload.links.next;

            m.lazyRedraw();

            return results;
          }
        }]);
        return RankingsPage;
      }(Component);

      _export('default', RankingsPage);
    }
  };
});;
'use strict';

System.register('Reflar/gamification/components/UserPromotedNotification', ['flarum/components/Notification', 'flarum/helpers/username', 'flarum/helpers/punctuateSeries'], function (_export, _context) {
  "use strict";

  var Notification, username, punctuateSeries, UserPromotedNotification;
  return {
    setters: [function (_flarumComponentsNotification) {
      Notification = _flarumComponentsNotification.default;
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default;
    }, function (_flarumHelpersPunctuateSeries) {
      punctuateSeries = _flarumHelpersPunctuateSeries.default;
    }],
    execute: function () {
      UserPromotedNotification = function (_Notification) {
        babelHelpers.inherits(UserPromotedNotification, _Notification);

        function UserPromotedNotification() {
          babelHelpers.classCallCheck(this, UserPromotedNotification);
          return babelHelpers.possibleConstructorReturn(this, (UserPromotedNotification.__proto__ || Object.getPrototypeOf(UserPromotedNotification)).apply(this, arguments));
        }

        babelHelpers.createClass(UserPromotedNotification, [{
          key: 'icon',
          value: function icon() {
            return 'thumbs-o-up';
          }
        }, {
          key: 'href',
          value: function href() {
            return app.route.post(this.props.notification.subject());
          }
        }, {
          key: 'content',
          value: function content() {
            var notification = this.props.notification;
            var user = notification.sender();
            var auc = notification.additionalUnreadCount();

            return app.translator.transChoice('flarum-likes.forum.notifications.post_liked_text', auc + 1, {
              user: user,
              username: auc ? punctuateSeries([username(user), app.translator.transChoice('flarum-likes.forum.notifications.others_text', auc, { count: auc })]) : undefined
            });
          }
        }, {
          key: 'excerpt',
          value: function excerpt() {
            return this.props.notification.subject().contentPlain();
          }
        }]);
        return UserPromotedNotification;
      }(Notification);

      _export('default', UserPromotedNotification);
    }
  };
});;
'use strict';

System.register('Reflar/gamification/components/VotesModal', ['flarum/components/Modal', 'flarum/helpers/avatar', 'flarum/helpers/username'], function (_export, _context) {
  "use strict";

  var Modal, avatar, username, VotesModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar.default;
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default;
    }],
    execute: function () {
      VotesModal = function (_Modal) {
        babelHelpers.inherits(VotesModal, _Modal);

        function VotesModal() {
          babelHelpers.classCallCheck(this, VotesModal);
          return babelHelpers.possibleConstructorReturn(this, (VotesModal.__proto__ || Object.getPrototypeOf(VotesModal)).apply(this, arguments));
        }

        babelHelpers.createClass(VotesModal, [{
          key: 'className',
          value: function className() {
            return 'VotesModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('reflar-gamification.forum.modal.title');
          }
        }, {
          key: 'content',
          value: function content() {
            return m(
              'div',
              { className: 'Modal-body' },
              m(
                'ul',
                { className: 'VotesModal-list' },
                m(
                  'legend',
                  null,
                  app.translator.trans('reflar-gamification.forum.modal.upvotes_label')
                ),
                this.props.post.upvotes().map(function (user) {
                  return m(
                    'li',
                    null,
                    m(
                      'a',
                      { href: app.route.user(user), config: m.route },
                      avatar(user),
                      ' ',
                      ' ',
                      username(user)
                    )
                  );
                }),
                m(
                  'legend',
                  null,
                  app.translator.trans('reflar-gamification.forum.modal.downvotes_label')
                ),
                this.props.post.downvotes().map(function (user) {
                  return m(
                    'li',
                    null,
                    m(
                      'a',
                      { href: app.route.user(user), config: m.route },
                      avatar(user),
                      ' ',
                      ' ',
                      username(user)
                    )
                  );
                })
              )
            );
          }
        }]);
        return VotesModal;
      }(Modal);

      _export('default', VotesModal);
    }
  };
});;
'use strict';

System.register('Reflar/gamification/main', ['flarum/extend', 'flarum/app', 'Reflar/gamification/components/AddAttributes', 'Reflar/gamification/components/AddHotnessSort', 'Reflar/gamification/components/AddVoteButtons', 'Reflar/gamification/models/Rank'], function (_export, _context) {
    "use strict";

    var extend, app, AddAttributes, AddHotnessFilter, AddVoteButtons, Rank;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_ReflarGamificationComponentsAddAttributes) {
            AddAttributes = _ReflarGamificationComponentsAddAttributes.default;
        }, function (_ReflarGamificationComponentsAddHotnessSort) {
            AddHotnessFilter = _ReflarGamificationComponentsAddHotnessSort.default;
        }, function (_ReflarGamificationComponentsAddVoteButtons) {
            AddVoteButtons = _ReflarGamificationComponentsAddVoteButtons.default;
        }, function (_ReflarGamificationModelsRank) {
            Rank = _ReflarGamificationModelsRank.default;
        }],
        execute: function () {
            // import UserPromotedNotification from 'Reflar/gamification/components/UserPromotedNotification';
            // import RankingsPage from 'Reflar/gamification/components/RankingsPage';


            // import NotificationGrid from 'flarum/components/NotificationGrid';

            app.initializers.add('Reflar-gamification', function (app) {

                app.store.models.ranks = Rank;

                // app.notificationComponents.userPromoted = UserPromotedNotification;

                // app.routes.page = {path: '/rankings', component: RankingsPage.component()};

                AddVoteButtons();
                AddHotnessFilter();
                AddAttributes();

                /**
                  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
                      items.add('userPromoted', {
                          name: 'userPromoted',
                          icon: 'arrow-up',
                          label: ['hi']
                      });
                  });*/
            });
        }
    };
});;
'use strict';

System.register('Reflar/gamification/models/Rank', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
  "use strict";

  var Model, mixin, Rank;
  return {
    setters: [function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumUtilsMixin) {
      mixin = _flarumUtilsMixin.default;
    }],
    execute: function () {
      Rank = function (_mixin) {
        babelHelpers.inherits(Rank, _mixin);

        function Rank() {
          babelHelpers.classCallCheck(this, Rank);
          return babelHelpers.possibleConstructorReturn(this, (Rank.__proto__ || Object.getPrototypeOf(Rank)).apply(this, arguments));
        }

        return Rank;
      }(mixin(Model, {
        points: Model.attribute('points'),
        name: Model.attribute('name'),
        color: Model.attribute('color')
      }));

      _export('default', Rank);
    }
  };
});