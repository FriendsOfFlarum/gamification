import LogInModal from 'flarum/components/LogInModal';

export default (post, upvoted, downvoted, load, discussion = post.discussion()) => {
    if (!app.session.user) {
        app.modal.show(new LogInModal());
        return;
    } else if (discussion && !discussion.canVote() && !post.canVote()) {
        return;
    }

    if (upvoted && downvoted) {
        upvoted = false;
        downvoted = false;
    }

    console.log(load);

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
