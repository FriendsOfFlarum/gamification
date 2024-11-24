export const helpers: {
    rankLabel: typeof import("../../common/helpers/rankLabel").default;
    saveVote: (post: any, upvoted: any, downvoted: any, load: any, discussion?: any) => any;
    setting: (key: any, isBool?: boolean) => unknown;
};
