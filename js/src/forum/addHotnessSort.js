import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import LinkButton from 'flarum/common/components/LinkButton';

export default function () {
  extend(IndexPage.prototype, 'navItems', function (items) {
    if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
      return;
    }
    items.add(
      'rankings',
      LinkButton.component(
        {
          href: app.route('rankings'),
          icon: 'fas fa-trophy',
        },
        app.translator.trans('fof-gamification.forum.nav.name')
      ),
      80
    );
  });

  extend(DiscussionListState.prototype, 'sortMap', function (map) {
    map.hot = '-hotness';
  });
}
