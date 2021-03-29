import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';

import debounce from 'lodash.debounce';

const fetch = (postId) => app.store.find('posts', postId).then(() => m.redraw());
const debounced = [];
const update = (postId) => {
    let func = debounced[postId];

    if (func) return func(postId);

    func = debounced[postId] = debounce(fetch, 1500);

    return func(postId);
};

export default () => {
    extend(DiscussionPage.prototype, 'oncreate', function () {
        if (app.pusher) {
            app.pusher.then((channels) => {
                channels.main.bind('newVote', (data) => {
                    const post = app.store.getById('posts', data.post_id);
                    const userId = data.user_id;

                    if (!post || post.votes() === data.votes || userId == app.session.user.id()) return;

                    update(post.id());
                });
            });
        }
    });

    extend(DiscussionPage.prototype, 'onremove', function () {
        if (app.pusher) {
            app.pusher.then((channels) => {
                channels.main.unbind('newVote');
            });
        }
    });
};
