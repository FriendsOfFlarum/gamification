import Model from 'flarum/common/Model';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';

import Rank from '../common/models/Rank';

import RankingsPage from './components/RankingsPage';
import VoteNotification from './components/VoteNotification';

import addHotnessSort from './addHotnessSort';
import addVoteButtons from './addVoteButtons';
import addUpvotesToDiscussion from './addUpvotesToDiscussion';
import addUserInfo from './addUserInfo';
import addPusher from './addPusher';
import addAlternateLayout from './addAlternateLayout';

import setting from './helpers/setting';

app.initializers.add('fof-gamification', (app) => {
    Discussion.prototype.votes = Model.attribute('votes');
    Discussion.prototype.hasUpvoted = Model.attribute('hasUpvoted');
    Discussion.prototype.hasDownvoted = Model.attribute('hasDownvoted');
    Discussion.prototype.canVote = Model.attribute('canVote');

    User.prototype.points = Model.attribute('points');
    User.prototype.ranks = Model.hasMany('ranks');

    Post.prototype.upvotes = Model.hasMany('upvotes');

    Post.prototype.votes = Model.attribute('votes');
    Post.prototype.canVote = Model.attribute('canVote');
    Post.prototype.canSeeVotes = Model.attribute('canSeeVotes');
    Post.prototype.hasUpvoted = Model.attribute('hasUpvoted');
    Post.prototype.hasDownvoted = Model.attribute('hasDownvoted');

    app.store.models.ranks = Rank;

    app.notificationComponents.vote = VoteNotification;

    app.routes.rankings = { path: '/rankings', component: RankingsPage };

    addVoteButtons();
    addHotnessSort();
    addUserInfo();
    addUpvotesToDiscussion();
    addPusher();

    if (setting('useAlternateLayout', true)) {
        addAlternateLayout();
    }
});

export * from './components';
export * from './helpers';
