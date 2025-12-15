import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';

import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

import saveVote from './helpers/saveVote';
import setting from './helpers/setting';

const get = (discussion, key) => {
  const post = discussion.firstPost();

  if (post && post[key]() !== undefined) {
    return post[key]();
  }

  return discussion[key]();
};

export default function addAlternateLayout() {
  extend(DiscussionListItem.prototype, 'oninit', function () {
    const discussion = this.attrs.discussion;

    if (!discussion.seeVotes()) {
      return;
    }

    this.subtree.check(() => this.voteLoading);
  });

  extend(DiscussionListItem.prototype, 'contentItems', function (items) {
    const discussion = this.attrs.discussion;

    if (!discussion.seeVotes()) {
      return;
    }

    const post = discussion.firstPost();

    const hasUpvoted = get(discussion, 'hasUpvoted');
    const hasDownvoted = get(discussion, 'hasDownvoted');
    // We set canVote to true for guest users so that they can access the login by clicking the button
    const canVote = !app.session.user || get(discussion, 'canVote');

    const upvotesOnly = setting('upVotesOnly', true);
    const altIcon = setting('iconNameAlt') || 'arrow';

    const onclick = (upvoted, downvoted) => saveVote(post, upvoted, downvoted, (val) => (this.voteLoading = val));

    items.add(
      'votes-alt',
      <div className="DiscussionListItem-votes alternateLayout" data-upvotes-only={upvotesOnly}>
        <Button
          className="DiscussionListItem-voteButton DiscussionListItem-voteButton--up Button Button--icon Button--text"
          icon={`fas fa-fw fa-${altIcon}-up`}
          data-active={hasUpvoted}
          disabled={!canVote || this.voteLoading}
          onclick={() => onclick(!hasUpvoted, false)}
          aria-label={app.translator.trans('fof-gamification.forum.post.upvote_button')}
        />

        <span class="DiscussionListItem-voteCount">{abbreviateNumber(get(discussion, 'votes') || 0)}</span>

        {!upvotesOnly && (
          <Button
            className="DiscussionListItem-voteButton DiscussionListItem-voteButton--down Button Button--icon Button--text"
            icon={`fas fa-fw fa-${altIcon}-down`}
            data-active={hasDownvoted}
            disabled={!canVote || this.voteLoading}
            onclick={() => onclick(false, !hasDownvoted)}
            aria-label={app.translator.trans('fof-gamification.forum.post.downvote_button')}
          />
        )}

        {this.voteLoading && <LoadingIndicator display="inline" size="small" />}
      </div>,
      110
    );
  });
}
