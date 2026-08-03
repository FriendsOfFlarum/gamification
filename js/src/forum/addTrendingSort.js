import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import LinkButton from 'flarum/common/components/LinkButton';

export default function () {
  extend(IndexSidebar.prototype, 'navItems', function (items) {
    if (!app.forum.attribute('canViewRankingPage')) {
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
    // See addVotesSort for why this carries its own label rather than being
    // a bare sort string.
    map.trending = {
      sort: '-trending',
      label: app.translator.trans('fof-gamification.forum.index_sort.trending_button'),
    };
  });
}
