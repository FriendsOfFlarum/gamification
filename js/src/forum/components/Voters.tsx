import app from 'flarum/forum/app';

import Component from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';
import Tooltip from 'flarum/common/components/Tooltip';
import avatar from 'flarum/common/helpers/avatar';
import icon from 'flarum/common/helpers/icon';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';

import type Mithril from 'mithril';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';

interface IAttrs {
  post: Post;
}

export default class Voters extends Component<IAttrs> {
  subtreeRetainer!: SubtreeRetainer;
  lastRenderVotes: number = -1;
  loading: boolean = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.loading = !this.attrs.post.upvotes();

    if (this.loading) {
      this.load();
    }

    this.subtreeRetainer = new SubtreeRetainer(
      () => this.loading,
      () => this.attrs.post.votes(),
      () => this.attrs.post?.upvotes?.()?.length
    );
  }

  onbeforeupdate(vnode: Mithril.Vnode) {
    super.onbeforeupdate(vnode);

    return this.subtreeRetainer.needsRebuild();
  }

  onupdate(vnode: Mithril.Vnode) {
    if (this.lastRenderVotes !== this.attrs.post.votes()) {
      this.loading = true;
      setTimeout(() => m.redraw(), 0);
      this.lastRenderVotes = this.attrs.post.votes();
      this.load();
    }
  }

  viewnew() {
    const max = 15;
    const votes = this.attrs.post.votes?.();
    const upvotes = this.attrs.post.upvotes?.();
    const downvotes = this.attrs.post.downvotes?.();
    const downvotesEnabled = false;

    return (
      <div className="Voters-info">
        <div className="Votrs-info--title">
          {icon('fas fa-users')}
          <span className="FoFGamification-voters-title-label">{app.translator.trans('fof-gamification.forum.voters.label')}</span>
        </div>
        <div className="Voters-info--sections">
          {votes && upvotes ? (
            <div className="Upvotes">
              <span>Upvoters</span>
              {this.buildVoters(upvotes, max)}
            </div>
          ) : (
            <LoadingIndicator display="inline" />
          )}
          {votes && downvotes && downvotesEnabled ? (
            <div className="Downvotes">
              <span>Downvoters</span>
              {this.buildVoters(upvotes, max)}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  view() {
    if (this.attrs.post.votes() === false || this.attrs.post.upvotes() === false) {
      return (
        <div className="Upvoters">
          <div className="FoFGamification-voters-title">
            <span className="FoFGamification-voters-title-icon">
              {icon('fas fa-users')}
              <span className="FoFGamification-voters-title-label">{app.translator.trans('fof-gamification.forum.voters.label')}</span>
              <span className="FoFGamification-voters-title-label FoFGamification-voters-title-label--mobile">
                {app.translator.trans('fof-gamification.forum.voters.label')}
              </span>
            </span>
          </div>

          <LoadingIndicator display="inline" />
        </div>
      );
    }

    const max = 15;
    const voters = this.attrs.post.upvotes();

    return (
      <div className="Upvoters">
        <div className="FoFGamification-voters-title">
          <span className="FoFGamification-voters-title-icon">
            {icon('fas fa-users')}
            <span className="FoFGamification-voters-title-label">{app.translator.trans('fof-gamification.forum.voters.label')}</span>
            <span className="FoFGamification-voters-title-label FoFGamification-voters-title-label--mobile">
              {voters.length === 0
                ? app.translator.trans('fof-gamification.forum.voters.label_none')
                : app.translator.trans('fof-gamification.forum.voters.label')}
            </span>
          </span>
        </div>
        <div className="FoFGamification-voters-message">
          {voters.length === 0 ? app.translator.trans('fof-gamification.forum.voters.none') : null}
        </div>
        <div className="FoFGamification-voters-list">
          {voters.slice(0, max).map((user: any) => (
            <Link href={app.route('user', { username: user.slug() })} className="FoFGamification-voters-item">
              <Tooltip text={user.displayName()}>{avatar(user)}</Tooltip>
            </Link>
          ))}
          {voters.length > max ? (
            <span className="FoFGamification-voters-item FoFGamification-voters-item--plus">
              <span className="Avatar">{`+${voters.length - max}`}</span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  buildVoters(voters: User[], max: number) {
    if (voters.length === 0) {
      return <div className="FoFGamification-voters-message">{app.translator.trans('fof-gamification.forum.voters.none')}</div>;
    }
    return (
      <div className="FoFGamification-voters-list">
        {voters.slice(0, max).map((user: User) => (
          <Link href={app.route('user', { username: user.slug() })} className="FoFGamification-voters-item">
            <Tooltip text={user.displayName()}>{avatar(user)}</Tooltip>
          </Link>
        ))}
        {voters.length > max ? (
          <span className="FoFGamification-voters-item FoFGamification-voters-item--plus">
            <span className="Avatar">{`+${voters.length - max}`}</span>
          </span>
        ) : null}
      </div>
    );
  }

  async load() {
    await app.store.find('posts', this.attrs.post.id(), {
      include: 'upvotes',
    });

    this.loading = false;

    m.redraw();
  }
}
