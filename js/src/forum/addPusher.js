import { extend } from 'flarum/extend';
import DiscussionPage from 'flarum/components/DiscussionPage';

import debounce from 'lodash.debounce';

const fetch = postId => app.store.find('posts', postId).then(() => m.redraw());
const debounced = [];
const update = postId => {
    let func = debounced[postId];

    if (func) return func(postId);

    func = debounced[postId] = debounce(fetch, 1500);

    return func(postId);
};

export default () => {
    extend(DiscussionPage.prototype, 'config', function(x, isInitialized, context) {
        if (isInitialized) return;

        if (app.pusher) {
            app.pusher.then(channels => {
                channels.main.bind('newVote', data => {
                    const post = app.store.getById('posts', data.post_id);
                    const userId = data.user_id;

                    if (!post || post.votes() === data.votes || userId == app.session.user.id()) return;

                    update(post.id());
                });

                extend(context, 'onunload', () => channels.main.unbind('newVote'));
            });
        }
    });
};
