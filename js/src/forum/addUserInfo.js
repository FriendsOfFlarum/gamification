import { extend } from 'flarum/common/extend';
import PostUser from 'flarum/forum/components/PostUser';
import UserCard from 'flarum/forum/components/UserCard';
import rankLabel from '../common/helpers/rankLabel';
import setting from './helpers/setting';

export default function () {
    const matchClass = (className) => {
        return (node) => node && node.attrs && node.attrs.className && String(node.attrs.className).split(' ').includes(className);
    };

    const matchTag = (tagName) => {
        return (node) => node && node.tag && node.tag === tagName;
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
        const placeholder = setting('pointsPlaceholder');
        const pts = String(this.attrs.user.points());
        let points;

        if (placeholder) {
            points = <div>{placeholder.replace('{points}', pts)}</div>;
        } else {
            points = app.translator.trans('fof-gamification.forum.user.points', { points: pts });
        }

        items.add('points', points);
    });

    extend(UserCard.prototype, 'view', function (vnode) {
        const user = this.attrs.user;
        const profile_node = findMatchClass(vnode, 'UserCard-profile')[0];
        const amt = Number(setting('rankAmt'));

        if (!profile_node) return vnode;

        let badges_node = profile_node.children.find(matchClass('UserCard-badges'));

        let sticky_ranks = [];
        if (user.groups()) {
            sticky_ranks = user.groups().filter((group) => group.sticky_rank()).map(
                (group) => <li className="User-Rank">{rankLabel(group.sticky_rank())}</li>
            );
        }
        if (user.ranks()) {
            if (!badges_node) {
                profile_node.children.splice(
                    1,
                    0,
                    <ul className="UserCard-badges badges">
                        {sticky_ranks.length ? sticky_ranks : user
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
                const ranks = sticky_ranks.length ? sticky_ranks : user.ranks()
                    .reverse()
                    .map((rank, i) => {
                        if (!amt || i < amt) {
                            return <li className="User-Rank">{rankLabel(rank)}</li>;
                        }
                    });
                ranks.forEach((rank) => {
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

        const header_node = vnode.children.find(matchTag('h3'));
        const amt = Number(setting('rankAmt')) ?? user.ranks().length;

        let sticky_ranks = [];
        if (user.groups()) {
            sticky_ranks = user.groups().filter((group) => group.sticky_rank()).map(
                (group) => <span className="User-Rank">{rankLabel(group.sticky_rank())}</span>
            );
        }
        header_node.children = header_node.children.concat(
            sticky_ranks.length ? sticky_ranks :
            user
                .ranks()
                .reverse()
                .splice(0, amt)
                .map((rank) => {
                    return <span className="Post-Rank">{rankLabel(rank)}</span>;
                })
        ).filter(function (el) {
            return el.tag !== undefined;
        });
    });
}
