import 'flarum/common/models/Discussion';
import 'flarum/common/models/Post';
import 'flarum/common/models/User';

import Rank from '../common/models/Rank';
import type User from 'flarum/common/models/User';

declare module 'flarum/common/models/Discussion' {
  export default interface Discussion {
    votes(): number;
    hasUpvoted(): boolean;
    hasDownvoted(): boolean;
    canVote(): boolean;
    seeVotes(): boolean;
  }
}

declare module 'flarum/common/models/Post' {
  export default interface Post {
    upvotes(): User[];
    downvotes(): User[];
    votes(): number;
    canVote(): boolean;
    canSeeVotes(): boolean;
    hasUpvoted(): boolean;
    hasDownvoted(): boolean;
    seeVoters(): boolean;
  }
}

declare module 'flarum/common/models/User' {
  export default interface User {
    points(): number;
    ranks(): Rank[];
    canHaveVotingNotifications(): boolean;
  }
}
