import Rank from '../common/models/Rank';

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
    upvotes(): unknown;
    downvotes(): unknown;
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
