import app from 'flarum/forum/app';

import Component from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';
import Tooltip from 'flarum/common/components/Tooltip';
import Avatar from 'flarum/common/components/Avatar';
import Icon from 'flarum/common/components/Icon';
import SubtreeRetainer from 'flarum/common/utils/SubtreeRetainer';

import type Mithril from 'mithril';

export default class Voters extends Component {
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

  view() {
    // if (this.loading) {
    if (this.attrs.post.votes() === false || this.attrs.post.upvotes() === false) {
      return (
        <div className="VotingContainer">
          <div className="FoFGamification-voters">
            <div className="FoFGamification-voters-title">
              <span className="FoFGamification-voters-title-icon">
                <Icon name="fas fa-users" />
                <span className="FoFGamification-voters-title-label">{app.translator.trans('fof-gamification.forum.voters.label')}</span>
                <span className="FoFGamification-voters-title-label FoFGamification-voters-title-label--mobile">
                  {app.translator.trans('fof-gamification.forum.voters.label')}
                </span>
              </span>
            </div>

            <LoadingIndicator display="inline" />
          </div>
        </div>
      );
    }

    const max = 15;
    const voters = this.attrs.post.upvotes();

    return (
      <div className="VotingContainer">
        <div className="FoFGamification-voters">
          <div className="FoFGamification-voters-title">
            <span className="FoFGamification-voters-title-icon">
              <Icon name="fas fa-users" />
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
                <Tooltip text={user.displayName()}>
                  <Avatar user={user} />
                </Tooltip>
              </Link>
            ))}
            {voters.length > max ? (
              <span className="FoFGamification-voters-item FoFGamification-voters-item--plus">
                <span className="Avatar">{`+${voters.length - max}`}</span>
              </span>
            ) : null}
          </div>
        </div>
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
