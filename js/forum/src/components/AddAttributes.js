import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import Discussion from 'flarum/models/Discussion';
import { extend } from 'flarum/extend';
import Model from 'flarum/Model';
import Post from 'flarum/models/Post';
import PostUser from 'flarum/components/PostUser';
import User from 'flarum/models/User';
import UserCard from 'flarum/components/UserCard';
import userOnline from 'flarum/helpers/userOnline';
import listItems from 'flarum/helpers/listItems';

export default function () {
    Discussion.prototype.canVote = Model.attribute('canVote');
  
    User.prototype.points = Model.attribute('points');
    User.prototype.Rank = Model.attribute('Rank');

    Post.prototype.upvotes = Model.hasMany('upvotes');
    Post.prototype.downvotes = Model.hasMany('downvotes');

    extend(UserCard.prototype, 'infoItems', function (items, user) {
        let rank = this.props.user.data.attributes.Rank.split(': ');
        if (rank[0] == '') {
            rank[0] = app.forum.attribute('DefaultRank');
        }
        items.add('points',
            app.translator.trans('reflar-gamification.forum.user.points', {points: this.props.user.data.attributes.Points})
        );

        items.add('rank',
            app.translator.trans('reflar-gamification.forum.user.rank', {rank: rank[0]})
        );
    });

    PostUser.prototype.view = function () {
        const post = this.props.post;
        const user = post.user();

        const rank = user.Rank().split(': ');

        if (rank[0] == '') {
            rank[0] = app.forum.attribute('DefaultRank');
        }

        if (!user) {
            return (
                <div className="PostUser">
                    <h3>{avatar(user, {className: 'PostUser-avatar'})} {username(user)} {rank[0]}</h3>
                </div>
            );
        }

        let card = '';

        if (!post.isHidden() && this.cardVisible) {
            card = UserCard.component({
                user,
                className: 'UserCard--popover',
                controlsButtonClassName: 'Button Button--icon Button--flat'
            });
        }

        return (
            <div className="PostUser">
                {userOnline(user)}
                <h3>
                    <a href={app.route.user(user)} config={m.route}>
                        {avatar(user, {className: 'PostUser-avatar'})}{' '}{username(user)}
                    </a>
                        <span className="Post-Rank" style={"color: " + rank[1]}>
                            {rank[0]}
                        </span>
                </h3>
                <ul className="PostUser-badges badges">
                    {listItems(user.badges().toArray())}
                </ul>
                {card}
            </div>
        );
    }
}