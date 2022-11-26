import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Post from 'flarum/common/models/Post';
import Button from 'flarum/common/components/Button';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import setting from '../helpers/setting';
import saveVote from '../helpers/saveVote';
import Tooltip from 'flarum/common/components/Tooltip';

interface IAttrs {
  post: Post;
  voteLoading: boolean;
}

export default class VotingControl extends Component<IAttrs> {
  view() {
    const post = this.attrs.post;

    const hasDownvoted = post.hasDownvoted();
    const hasUpvoted = post.hasUpvoted();

    const icon = setting('iconName') || 'thumbs';
    const upvotesOnly = setting('upVotesOnly', true);

    const canSeeVotes = post.canSeeVotes();

    // We set canVote to true for guest users so that they can access the login by clicking the button
    const canVote = !app.session.user || post.canVote();

    const onclick = (upvoted: boolean, downvoted: boolean) =>
      saveVote(post, upvoted, downvoted, (val: boolean) => {
        this.attrs.voteLoading = val;
      });

    return (
      <div className="VotingControl" data-upvotes-only={upvotesOnly}>
        <Tooltip text={app.translator.trans('fof-gamification.forum.post.upvote_tooltip')}>
        <Button
          className="Post-voteButton Post-voteButton--up Button Button--icon Button--text"
          icon={`fas fa-fw fa-${icon}-up`}
          data-active={hasUpvoted}
          disabled={!canVote || this.attrs.voteLoading || !canSeeVotes}
          onclick={() => onclick(!hasUpvoted, false)}
          aria-label={app.translator.trans('fof-gamification.forum.post.upvote_button')}
        />
        </Tooltip>

        <span class="Post-voteCount">{abbreviateNumber(post.votes() || 0)}</span>

        {!upvotesOnly && (
          <Tooltip text={app.translator.trans('fof-gamification.forum.post.downvote_tooltip')} position="bottom">
            <Button
            className="Post-voteButton Post-voteButton--down Button Button--icon Button--text"
            icon={`fas fa-fw fa-${icon}-down`}
            data-active={hasDownvoted}
            disabled={!canVote || this.attrs.voteLoading}
            onclick={() => onclick(false, !hasDownvoted)}
            aria-label={app.translator.trans('fof-gamification.forum.post.downvote_button')}
          />
          </Tooltip>
        )}

        {this.attrs.voteLoading && <LoadingIndicator display="inline" size="small" />}
      </div>
    );
  }
}
