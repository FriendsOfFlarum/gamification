import app from 'flarum/forum/app';
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

  let action;

  switch (true) {
    case (upvoted && downvoted) || (!upvoted && !downvoted):
      action = null;
      break;
    case upvoted:
      action = 'up';
      break;
    case downvoted:
      action = 'down';
      break;
  }

  if (load) load(true);

  m.redraw();

  return post
    .save({ vote: action })
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
