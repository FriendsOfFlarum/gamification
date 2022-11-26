import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';
import VotesUserPage from './components/VotesUserPage';
import setting from './helpers/setting';

export default function addUpvoteTabToUserProfile() {
  app.routes['user.votes'] = { path: '/u/:username/votes', component: VotesUserPage };
  extend(UserPage.prototype, 'navItems', function (items) {
    const user = this.user;

    if (!user) return;

    const icon = setting('iconName') || 'thumbs';
    items.add(
      'votes',
      <LinkButton href={app.route('user.votes', { username: user.slug() })} name="votes" icon={`fas fa-fw fa-${icon}-up`}>
        {app.translator.trans('fof-gamification.forum.user.votes_link')}
      </LinkButton>,
      85
    );
  });
}
