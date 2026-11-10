import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import PostUser from 'flarum/forum/components/PostUser';
import UserCard from 'flarum/forum/components/UserCard';
import rankLabel from '../common/helpers/rankLabel';
import Icon from 'flarum/common/components/Icon';

export default function () {
  const matchClass = (className) => {
    return (node) => node && node.attrs && node.attrs.className && String(node.attrs.className).split(' ').includes(className);
  };

  extend(UserCard.prototype, 'infoItems', function (items) {
    const user = this.attrs.user;

    items.add(
      'points',
      <div>
        <Icon name="fas fa-medal" />
        {app.translator.trans('fof-gamification.forum.user.card.points', {
          count: user.points(),
        })}
      </div>,
      50
    );
  });

  // Ranks join the user's badges. Core builds those in UserCard's contentItems
  // (inside UserCard-content), so a list added to the vnode beside them sat
  // between the avatar and the content and broke the card's layout.
  extend(UserCard.prototype, 'contentItems', function (items) {
    const user = this.attrs.user;
    const amt = app.forum.attribute('fof-gamification.rankAmt') ?? user.ranks().length;

    if (!user.ranks()) return;

    const ranks = user
      .ranks()
      .reverse()
      .filter((rank, i) => !amt || i < amt)
      .map((rank) => (
        <li className="User-Rank" key={`rank-${rank.id()}`}>
          {rankLabel(rank)}
        </li>
      ));

    if (!ranks.length) return;

    if (items.has('badges')) {
      items.get('badges').children.push(...ranks);
    } else {
      items.add('badges', <ul className="UserCard-badges badges">{ranks}</ul>, 90);
    }
  });

  extend(PostUser.prototype, 'view', function (vnode) {
    const post = this.attrs.post;
    const user = post.user();

    if (!user) {
      return vnode;
    }

    const header_node = vnode.children.find(matchClass('PostUser-name'));
    const amt = app.forum.attribute('fof-gamification.rankAmt') ?? user.ranks().length;

    if (!user.ranks()) return;

    header_node.children = header_node.children
      .concat(
        user
          .ranks()
          .reverse()
          .splice(0, amt)
          .map((rank) => {
            return <span className="Post-Rank">{rankLabel(rank)}</span>;
          })
      )
      .filter(function (el) {
        return el.tag !== undefined;
      });
  });
}
