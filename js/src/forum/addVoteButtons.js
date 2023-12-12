import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';
import classList from 'flarum/common/utils/classList';
import PostControls from 'flarum/forum/utils/PostControls';

import VotesModal from './components/VotesModal';
import setting from './helpers/setting';
import saveVote from './helpers/saveVote';

export default function () {
  extend(PostControls, 'moderationControls', function (items, post) {
    if (post.seeVoters()) {
      items.add('viewVotes', [
        m(
          Button,
          {
            icon: 'fas fa-thumbs-up',
            onclick: () => {
              app.modal.show(VotesModal, { post });
            },
          },
          app.translator.trans('fof-gamification.forum.mod_item')
        ),
      ]);
    }
  });

  extend(CommentPost.prototype, 'actionItems', function (items) {
    const post = this.attrs.post;

    //if (!post.canVote()) return;

    const hasDownvoted = post.hasDownvoted();
    const hasUpvoted = post.hasUpvoted();

    const icon = setting('iconName') || 'thumbs';
    const upVotesOnly = setting('upVotesOnly', true);

    const canSeeVotes = post.canSeeVotes();

    // We set canVote to true for guest users so that they can access the login by clicking the button
    const canVote = !app.session.user || post.canVote();

    if (setting('hideIfNoPermissions', true) && !post.canVote() && !post.canSeeVotes()) {
      return;
    }

    const onclick = (upvoted, downvoted) => saveVote(post, upvoted, downvoted, (val) => (this.voteLoading = val));

    items.add(
      'votes',
      <div className={classList('CommentPost-votes', setting('useAlternateLayout', true) && 'alternateLayout')}>
        {Button.component({
          icon: this.voteLoading ? undefined : `fas fa-fw fa-${icon}-up`,
          className: classList('Post-vote Post-upvote', hasUpvoted && 'Post-vote--active'),
          loading: this.voteLoading,
          disabled: this.voteLoading || !canVote || !canSeeVotes,
          onclick: () => onclick(!hasUpvoted, false),
          'aria-label': app.translator.trans('fof-gamification.forum.post.upvote_button'),
        })}

        <label className="Post-points">{post.votes()}</label>

        {!upVotesOnly &&
          Button.component({
            icon: this.voteLoading ? undefined : `fas fa-fw fa-${icon}-down`,
            className: classList('Post-vote Post-downvote', hasDownvoted && 'Post-vote--active'),
            loading: this.voteLoading,
            disabled: !canVote || !canSeeVotes,
            onclick: () => onclick(false, !hasDownvoted),
            'aria-label': app.translator.trans('fof-gamification.forum.post.downvote_button'),
          })}
      </div>,
      10
    );
  });
}
