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
    Discussion.prototype.canSeeVotes = Model.attribute('canSeeVotes');

    User.prototype.points = Model.attribute('points');
    User.prototype.ranks = Model.hasMany('ranks');

    Post.prototype.upvotes = Model.hasMany('upvotes');
    Post.prototype.downvotes = Model.hasMany('downvotes');

    extend(UserCard.prototype, 'infoItems', function (items, user) {
        this.ranks = this.props.user.ranks();
        let points = this.props.user.data.attributes.Points;

        if (points == 0) {
            points = '0';
        }

        let rankHolder = '';

        if (app.forum.attribute('RankHolder') === null || app.forum.attribute('RankHolder') === '') {
          rankHolder = '{rank}';
        } else {
          rankHolder = app.forum.attribute('RankHolder');
        }

        items.add('points',
          app.translator.trans('reflar-gamification.forum.user.points', {points})
        );
      
        console.log(this.ranks);
      
        this.ranks.map((rank) => {
          console.log(rank);
          items.add(rank.name(), function() {
            {rankHolder.replace('{rank}', rank.name())}
          })
        });
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