import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';

export default function () {
  extend(DiscussionListState.prototype, 'sortMap', function (map) {
    // Carries its own label rather than being a bare sort string: a string
    // makes core look the name up as `core.forum.index_sort.<key>_button`,
    // which would mean this extension defining keys inside core's namespace
    // to name a sort option that is not core's.
    map.votes = {
      sort: '-votes',
      label: app.translator.trans('fof-gamification.forum.index_sort.votes_button'),
    };
  });
}
