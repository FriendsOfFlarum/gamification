import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';

import CommentPost from 'flarum/forum/components/CommentPost';
import Button from 'flarum/common/components/Button';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import type ItemList from 'flarum/common/utils/ItemList';

import setting from './helpers/setting';
import saveVote from './helpers/saveVote';

const get = (discussion, key) => {
  const post = discussion.firstPost();

  if (post && post[key]() !== undefined) {
    return post[key]();
  }

  return discussion[key]();
};

function makeArrowStyles(active) {
  if (!active) return {};

  return {
    color: 'var(--primary-color) !important',
  };
}

export default function useAlternatePostVoteLayout() {
  extend(CommentPost.prototype, 'actionItems', function (this: CommentPost, items: ItemList) {
    items.remove('votes');
  });

  extend(CommentPost.prototype, 'classes', function (this: CommentPost, classes: string[]) {
    const upvotesOnly = setting('upVotesOnly', true);

    classes.push('votesAlternativeLayout');

    if (upvotesOnly) {
      classes.push('votesUpvotesOnly');
    }
  });

  extend(CommentPost.prototype, 'headerItems', function (this: CommentPost, items: ItemList) {
    const post = this.attrs.post;

    if (!post.canVote()) return;

    const discussion = post.discussion();

    const hasDownvoted = post.hasDownvoted();
    const hasUpvoted = post.hasUpvoted();

    const icon = setting('iconName') || 'thumbs';
    const upvotesOnly = setting('upVotesOnly', true);

    // We set canVote to true for guest users so that they can access the login by clicking the button
    const canVote = !app.session.user || post.canVote();

    items.add(
      'votes',
      <div className="Post-votes alternateLayout" data-upvotes-only={upvotesOnly}>
        <Button
          className="Post-voteButton Post-voteButton--up Button Button--icon Button--text"
          icon={`fas fa-fw fa-${icon}-up`}
          style={makeArrowStyles(hasUpvoted)}
          data-active={hasUpvoted}
          disabled={!canVote || this.voteLoading}
          onclick={() => {
            saveVote(post, !hasUpvoted, false, (val) => {
              this.voteLoading = val;
            });
          }}
        />

        <span class="Post-voteCount">{abbreviateNumber(get(discussion, 'votes') || 0)}</span>

        {!upvotesOnly && (
          <Button
            className="Post-voteButton Post-voteButton--down Button Button--icon Button--text"
            icon={`fas fa-fw fa-${icon}-down`}
            style={makeArrowStyles(hasDownvoted)}
            data-active={hasDownvoted}
            disabled={!canVote || this.voteLoading}
            onclick={() => {
              saveVote(post, false, !hasDownvoted, (val) => {
                this.voteLoading = val;
              });
            }}
          />
        )}

        {this.voteLoading && <LoadingIndicator display="inline" size="small" />}
      </div>,
      10000
    );
  });
}
