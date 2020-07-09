import Discussion from 'flarum/models/Discussion';
import { extend } from 'flarum/extend';
import Model from 'flarum/Model';
import Post from 'flarum/models/Post';
import PostUser from 'flarum/components/PostUser';
import User from 'flarum/models/User';
import UserCard from 'flarum/components/UserCard';
import rankLabel from '../../common/helpers/rankLabel';
import setting from '../helpers/setting';

export default function() {
    Discussion.prototype.canVote = Model.attribute('canVote');
    Discussion.prototype.canSeeVotes = Model.attribute('canSeeVotes');
    Discussion.prototype.votes = Model.attribute('votes');

    User.prototype.points = Model.attribute('points');
    User.prototype.ranks = Model.hasMany('ranks');

    Post.prototype.upvotes = Model.hasMany('upvotes');
    Post.prototype.downvotes = Model.hasMany('downvotes');

    const matchClass = className => {
        return node => node && node.attrs && node.attrs.className && node.attrs.className === className;
    };

    const matchTag = tagName => {
        return node => node && node.tag && node.tag === tagName;
    };

    const findMatchClass = function(node, className) {
        const arr = [];

        if (node && node.children) {
            const nodeInChildren = node.children.find(matchClass(className));

            if (nodeInChildren !== undefined) {
                arr.push(...nodeInChildren);
            }

            node.children.forEach(function(currentValue) {
                arr.push(...findMatchClass(currentValue, className));
            });
        }
        return arr;
    };

    extend(UserCard.prototype, 'infoItems', function(items) {
        const placeholder = setting('pointsPlaceholder');
        let points;

        if (placeholder) {
            points = placeholder.replace('{points}', this.props.user.points());
        } else {
            points = app.translator.trans('fof-gamification.forum.user.points', { points: this.props.user.points() });
        }

        items.add('points', points);
    });

    extend(UserCard.prototype, 'view', function(vnode) {
        const user = this.props.user;
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
                badges_node.children.push(
                    user
                        .ranks()
                        .reverse()
                        .map((rank, i) => {
                            if (!amt || i < amt) {
                                return <li className="User-Rank">{rankLabel(rank)}</li>;
                            }
                        })
                );
            }
        }

        return vnode;
    });

    extend(PostUser.prototype, 'view', function(vnode) {
        const post = this.props.post;
        const user = post.user();

        if (!user) {
            return vnode;
        }

        const header_node = vnode.children.find(matchTag('h3'));
        const amt = Number(setting('rankAmt'));

        header_node.children.push(
            user
                .ranks()
                .reverse()
                .map((rank, i) => {
                    if (!amt || i < amt) {
                        return <span className="Post-Rank">{rankLabel(rank)}</span>;
                    }
                })
        );
    });
}
