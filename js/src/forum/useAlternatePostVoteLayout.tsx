import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';

import CommentPost from 'flarum/forum/components/CommentPost';
import Button from 'flarum/common/components/Button';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import setting from './helpers/setting';
import saveVote from './helpers/saveVote';

import type ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export default function useAlternatePostVoteLayout() {
  extend(CommentPost.prototype, 'actionItems', function (this: CommentPost, items: ItemList<Mithril.Children>) {
    if (this.attrs.post.isHidden()) return;

    items.remove('votes');
  });

  extend(CommentPost.prototype, 'classes', function (this: CommentPost, classes: string[]) {
    if (this.attrs.post.isHidden()) return;

    const upvotesOnly = setting('upVotesOnly', true);

    classes.push('votesAlternativeLayout');

    if (upvotesOnly) {
      classes.push('votesUpvotesOnly');
    }
  });

  extend(CommentPost.prototype, 'oninit', function () {
    (this as any).voteLoading = false;
  });

  extend(CommentPost.prototype, 'headerItems', function (this: CommentPost, items: ItemList<Mithril.Children>) {
    const post = this.attrs.post;

    if (post.isHidden()) return;
    if (!post.canSeeVotes()) return;

    const hasDownvoted = post.hasDownvoted();
    const hasUpvoted = post.hasUpvoted();

    const icon = setting('iconName') || 'thumbs';
    const upvotesOnly = setting('upVotesOnly', true);

    const canSeeVotes = post.canSeeVotes();

    // We set canVote to true for guest users so that they can access the login by clicking the button
    const canVote = !app.session.user || post.canVote();

    const onclick = (upvoted: boolean, downvoted: boolean) =>
      saveVote(post, upvoted, downvoted, (val: boolean) => {
        (this as any).voteLoading = val;
      });

    items.add(
      'votes',
      <div className="Post-votes alternateLayout" data-upvotes-only={upvotesOnly}>
        <Button
          className="Post-voteButton Post-voteButton--up Button Button--icon Button--text"
          icon={`fas fa-fw fa-${icon}-up`}
          data-active={hasUpvoted}
          disabled={!canVote || (this as any).voteLoading || !canSeeVotes}
          onclick={() => onclick(!hasUpvoted, false)}
          aria-label={app.translator.trans('fof-gamification.forum.post.upvote_button')}
        />

        <span class="Post-voteCount">{abbreviateNumber(post.votes() || 0)}</span>

        {!upvotesOnly && (
          <Button
            className="Post-voteButton Post-voteButton--down Button Button--icon Button--text"
            icon={`fas fa-fw fa-${icon}-down`}
            data-active={hasDownvoted}
            disabled={!canVote || (this as any).voteLoading}
            onclick={() => onclick(false, !hasDownvoted)}
            aria-label={app.translator.trans('fof-gamification.forum.post.downvote_button')}
          />
        )}

        {(this as any).voteLoading && <LoadingIndicator display="inline" size="small" />}
      </div>,
      10000
    );
  });
}
