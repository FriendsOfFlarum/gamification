import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import Icon from 'flarum/common/components/Icon';
import setting from './helpers/setting';

export default function () {
  if (!setting('showVotesOnDiscussionPage', true) || setting('useAlternateLayout', true)) {
    return;
  }

  extend(DiscussionListItem.prototype, 'elementAttrs', function (attrs) {
    if (!this.attrs.discussion.seeVotes()) {
      return;
    }

    attrs.className += ' DiscussionListItem--withVotes';
  });

  extend(DiscussionListItem.prototype, 'infoItems', function (items) {
    const discussion = this.attrs.discussion;

    if (!discussion.seeVotes()) {
      return;
    }

    items.add(
      'discussion-votes',
      <span className="DiscussionListItem-votes" title={app.translator.trans('fof-gamification.forum.votes')}>
        <Icon name="far fa-thumbs-up" />
        {abbreviateNumber(this.attrs.discussion.votes())}
      </span>,
      20
    );
  });
}
