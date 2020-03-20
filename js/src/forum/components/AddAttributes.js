import Discussion from 'flarum/models/Discussion';
import { extend } from 'flarum/extend';
import Model from 'flarum/Model';
import Post from 'flarum/models/Post';
import PostUser from 'flarum/components/PostUser';
import User from 'flarum/models/User';
import UserCard from 'flarum/components/UserCard';
import rankLabel from '../../common/helpers/rankLabel';

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

    extend(UserCard.prototype, 'infoItems', function(items, user) {
        let points = '';

        if (points == 0) {
            points = '0';
        }

        if (app.forum.attribute('PointsPlaceholder')) {
            points = app.forum.attribute('PointsPlaceholder').replace('{points}', this.props.user.data.attributes.Points);
        } else {
            points = app.translator.trans('fof-gamification.forum.user.points', { points: this.props.user.data.attributes.Points });
        }

        items.add('points', points);
    });

    extend(UserCard.prototype, 'view', function(vnode) {
        const user = this.props.user;
        const profile_node = findMatchClass(vnode, 'UserCard-profile')[0];

        if (!profile_node) return;

        let badges_node = profile_node.children.find(matchClass('UserCard-badges'));
        if (user.ranks()) {
            if (badges_node === undefined || badges_node === '') {
                profile_node.children.splice(
                    1,
                    0,
                    <ul className="UserCard-badges badges">
                        {user
                            .ranks()
                            .reverse()
                            .map((rank, i) => {
                                if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {
                                } else {
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
                            if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {
                            } else {
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
        header_node.children.push(
            user
                .ranks()
                .reverse()
                .map((rank, i) => {
                    if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {
                    } else {
                        return <span className="Post-Rank">{rankLabel(rank)}</span>;
                    }
                })
        );

        return vnode;
    });
}
