import Extend from 'flarum/common/extenders';
import { default as commonExtend } from '../common/extend';

import RankingsPage from './components/RankingsPage';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';

export default [
  ...commonExtend,

  new Extend.Routes() //
    .add('rankings', '/rankings', RankingsPage),

  new Extend.Model(Discussion) //
    .attribute<number>('votes')
    .attribute<boolean>('hasUpvoted')
    .attribute<boolean>('hasDownvoted')
    .attribute<boolean>('canVote')
    .attribute<boolean>('seeVotes'),

  new Extend.Model(Post) //
    .hasMany('upvotes')
    .hasMany('downvotes')
    .attribute('votes')
    .attribute<boolean>('canVote')
    .attribute<boolean>('canSeeVotes')
    .attribute<boolean>('hasUpvoted')
    .attribute<boolean>('hasDownvoted')
    .attribute<boolean>('seeVoters'),

  new Extend.Model(User) //
    .attribute<number>('points')
    .hasMany('ranks')
    .attribute<boolean>('canHaveVotingNotifications'),
];
