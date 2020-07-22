import Model from 'flarum/Model';
import Discussion from 'flarum/models/Discussion';
import Post from 'flarum/models/Post';
import User from 'flarum/models/User';

import Rank from '../common/models/Rank';

import RankingsPage from './components/RankingsPage';
import VoteNotification from './components/VoteNotification';

import addHotnessFilter from './addHotnessSort';
import addVoteButtons from './addVoteButtons';
import addUpvotesToDiscussion from './addUpvotesToDiscussion';
import addUserInfo from './addUserInfo';
import addPusher from './addPusher';

app.initializers.add('fof-gamification', app => {
    Discussion.prototype.votes = Model.attribute('votes');

    User.prototype.points = Model.attribute('points');
    User.prototype.ranks = Model.hasMany('ranks');

    Post.prototype.upvotes = Model.hasMany('upvotes');
    Post.prototype.downvotes = Model.hasMany('downvotes');

    Post.prototype.votes = Model.attribute('votes');
    Post.prototype.canVote = Model.attribute('canVote');
    Post.prototype.canSeeVotes = Model.attribute('canSeeVotes');
    Post.prototype.hasUpvoted = Model.attribute('hasUpvoted');
    Post.prototype.hasDownvoted = Model.attribute('hasDownvoted');

    app.store.models.ranks = Rank;

    app.notificationComponents.vote = VoteNotification;

    app.routes.rankings = { path: '/rankings', component: RankingsPage.component() };

    addVoteButtons();
    addHotnessFilter();
    addUserInfo();
    addUpvotesToDiscussion();
    addPusher();
});
