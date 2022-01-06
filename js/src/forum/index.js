import app from 'flarum/forum/app';
import Model from 'flarum/common/Model';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';

import Rank from '../common/models/Rank';

import RankingsPage from './components/RankingsPage';

import addHotnessSort from './addHotnessSort';
import addVoteButtons from './addVoteButtons';
import addUpvotesToDiscussion from './addUpvotesToDiscussion';
import addUserInfo from './addUserInfo';
import addPusher from './addPusher';
import addAlternateLayout from './addAlternateLayout';

import setting from './helpers/setting';
import addVotesSort from './addVotesSort';
import useAlternatePostVoteLayout from './useAlternatePostVoteLayout';
import addNotifications from './addNotifications';
import addVotersToDiscussionPageSideBar from './addVotersToDiscussionPageSideBar';

app.initializers.add('fof-gamification', (app) => {
  Discussion.prototype.votes = Model.attribute('votes');
  Discussion.prototype.hasUpvoted = Model.attribute('hasUpvoted');
  Discussion.prototype.hasDownvoted = Model.attribute('hasDownvoted');
  Discussion.prototype.canVote = Model.attribute('canVote');
  Discussion.prototype.seeVotes = Model.attribute('seeVotes');

  User.prototype.points = Model.attribute('points');
  User.prototype.ranks = Model.hasMany('ranks');

  Post.prototype.upvotes = Model.hasMany('upvotes');
  Post.prototype.downvotes = Model.hasMany('downvotes');

  Post.prototype.votes = Model.attribute('votes');
  Post.prototype.canVote = Model.attribute('canVote');
  Post.prototype.canSeeVotes = Model.attribute('canSeeVotes');
  Post.prototype.hasUpvoted = Model.attribute('hasUpvoted');
  Post.prototype.hasDownvoted = Model.attribute('hasDownvoted');
  Post.prototype.seeVoters = Model.attribute('seeVoters');

  app.store.models.ranks = Rank;

  app.routes.rankings = { path: '/rankings', component: RankingsPage };

  addVoteButtons();
  addHotnessSort();
  addVotesSort();
  addUserInfo();
  addUpvotesToDiscussion();
  addPusher();
  addNotifications();
  addVotersToDiscussionPageSideBar();

  if (setting('useAlternateLayout', true)) {
    addAlternateLayout();
  }

  if (setting('altPostVotingUi', true)) {
    useAlternatePostVoteLayout();
  }
});

export * from './components';
export * from './helpers';
