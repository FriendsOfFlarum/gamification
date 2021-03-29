import DiscussionControls from 'flarum/forum/utils/DiscussionControls';

export default (post, upvoted, downvoted, load, discussion = post.discussion()) => {
    if (!app.session.user) {
        // We use this instead of showing LogInModal so that extensions can override it
        DiscussionControls.replyAction.call(discussion, true);
        return;
    } else if (discussion && !discussion.canVote() && !post.canVote()) {
        return;
    }

    if (upvoted && downvoted) {
        upvoted = false;
        downvoted = false;
    }

    if (load) load(true);

    m.redraw();

    return post
        .save([upvoted, downvoted, 'vote'])
        .then(
            () => null,
            () => null
        )
        .then(() => {
            if (load) load(false);

            if (discussion) {
                discussion.pushAttributes({
                    votes: post.votes(),
                });
            }

            m.redraw();
        });
};
