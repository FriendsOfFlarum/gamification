import app from 'flarum/forum/app';

import addTrendingSort from './addTrendingSort';
import addVoteButtons from './addVoteButtons';
import addUpvotesToDiscussion from './addUpvotesToDiscussion';
import addUserInfo from './addUserInfo';
import addPusher from './addPusher';
import addAlternateLayout from './addAlternateLayout';
import addVotesSort from './addVotesSort';
import useAlternatePostVoteLayout from './useAlternatePostVoteLayout';
import addNotifications from './addNotifications';
import addVotersToDiscussionPageSideBar from './addVotersToDiscussionPageSideBar';
import addUpvoteTabToUserProfile from './addUpvoteTabToUserProfile';

export { default as extend } from './extend';

app.initializers.add('fof-gamification', () => {
  addVoteButtons();
  addTrendingSort();
  addVotesSort();
  addUserInfo();
  addUpvotesToDiscussion();
  addPusher();
  addNotifications();
  addVotersToDiscussionPageSideBar();
  addUpvoteTabToUserProfile();

  addAlternateLayout();

  useAlternatePostVoteLayout();
});
