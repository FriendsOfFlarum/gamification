import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import LogInModal from 'flarum/components/LogInModal';
import CommentPost from 'flarum/components/CommentPost';
import PostControls from 'flarum/utils/PostControls';

import VotesModal from './components/VotesModal';
import setting from './helpers/setting';

const vote = (post, upvoted, downvoted, load) => {
    if (!app.session.user) {
        app.modal.show(new LogInModal());
        return;
    } else if (!post.canVote()) {
        return;
    }

    if (upvoted && downvoted) {
        upvoted = false;
        downvoted = false;
    }

    load(true);

    return post
        .save([upvoted, downvoted, 'vote'])
        .then(
            () => null,
            () => null
        )
        .then(() => {
            load(false);

            post.discussion().pushAttributes({
                votes: post.votes(),
            });

            m.redraw();
        });
};

export default function() {
    extend(PostControls, 'moderationControls', function(items, post) {
        if (post.canSeeVotes()) {
            items.add('viewVotes', [
                m(
                    Button,
                    {
                        icon: 'fas fa-thumbs-up',
                        onclick: () => {
                            app.modal.show(new VotesModal({ post }));
                        },
                    },
                    app.translator.trans('fof-gamification.forum.mod_item')
                ),
            ]);
        }
    });

    extend(CommentPost.prototype, 'actionItems', function(items) {
        const post = this.props.post;
        const hasDownvoted = post.hasDownvoted();
        const hasUpvoted = post.hasUpvoted();

        const icon = setting('iconName') || 'thumbs';

        const canVote = post.canVote();

        items.add(
            'upvote',
            Button.component({
                icon: this.voteLoading || `fas fa-${icon}-up`,
                className: 'Post-vote Post-upvote',
                style: hasUpvoted && {
                    color: app.forum.attribute('themePrimaryColor'),
                },
                loading: this.voteLoading,
                disabled: this.voteLoading || !canVote,
                onclick: () => vote(post, !hasUpvoted, false, val => (this.voteLoading = val)),
            }),
            3
        );

        items.add('points', <label className="Post-points">{post.votes()}</label>, 2);

        items.add(
            'downvote',
            Button.component({
                icon: this.voteLoading || `fas fa-${icon}-down`,
                className: 'Post-vote Post-downvote',
                style: hasDownvoted && {
                    color: app.forum.attribute('themePrimaryColor'),
                },
                loading: this.voteLoading,
                disabled: !canVote,
                onclick: () => vote(post, false, !hasDownvoted, val => (this.voteLoading = val)),
            }),
            1
        );
    });
}
