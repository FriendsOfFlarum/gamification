import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import PostUser from 'flarum/forum/components/PostUser';
import UserCard from 'flarum/forum/components/UserCard';
import rankLabel from '../common/helpers/rankLabel';
import setting from './helpers/setting';
import Icon from 'flarum/common/components/Icon';

export default function () {
  const matchClass = (className) => {
    return (node) => node && node.attrs && node.attrs.className && String(node.attrs.className).split(' ').includes(className);
  };

  const findMatchClass = function (node, className) {
    const arr = [];

    if (node && node.children && Array.isArray(node.children)) {
      const nodeInChildren = node.children.find(matchClass(className));

      if (nodeInChildren) {
        arr.push(nodeInChildren);
      }

      node.children.forEach(function (currentValue) {
        arr.push(...findMatchClass(currentValue, className));
      });
    }

    return arr;
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

  extend(UserCard.prototype, 'view', function (vnode) {
    const user = this.attrs.user;
    const profile_node = findMatchClass(vnode, 'UserCard-profile')[0];
    const amt = Number(setting('rankAmt'));

    if (!profile_node) return;

    let badges_node = profile_node.children.find(matchClass('UserCard-badges'));
    if (user.ranks()) {
      if (!badges_node) {
        profile_node.children.splice(
          1,
          0,
          <ul className="UserCard-badges badges">
            {user
              .ranks()
              .reverse()
              .map((rank, i) => {
                if (!amt || i < amt) {
                  return <li className="User-Rank">{rankLabel(rank)}</li>;
                }
              })}
          </ul>
        );
      } else {
        user
          .ranks()
          .reverse()
          .map((rank, i) => {
            if (!amt || i < amt) {
              return <li className="User-Rank">{rankLabel(rank)}</li>;
            }
          })
          .forEach((rank) => {
            if (!rank) {
              return;
            }
            badges_node.children.push(rank);
          });
      }
    }

    return vnode;
  });

  extend(PostUser.prototype, 'view', function (vnode) {
    const post = this.attrs.post;
    const user = post.user();

    if (!user) {
      return vnode;
    }

    const header_node = vnode.children.find(matchClass('PostUser-name'));
    const amt = Number(setting('rankAmt')) ?? user.ranks().length;

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
