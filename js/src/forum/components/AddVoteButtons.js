import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import LogInModal from 'flarum/components/LogInModal';
import CommentPost from 'flarum/components/CommentPost';
import PostControls from 'flarum/utils/PostControls';
import VotesModal from './VotesModal';
import setting from '../helpers/setting';

export default function() {
    // TODO change to discussion page
    extend(CommentPost.prototype, 'config', function(x, isInitialized, context) {
        if (isInitialized) return;

        if (app.pusher) {
            app.pusher.then(channels => {
                channels.main.bind('newVote', data => {
                    var userId = parseInt(data.userId);

                    if (userId == app.session.user.id()) return;

                    m.startComputation();

                    if (this.props.post.id() == data.postId) {
                        var upData = this.upvotedata();
                        var downData = this.downvotedata();

                        switch (data.before) {
                            case 'up':
                                upData = this.removeVote(upData, userId);
                                break;
                            case 'down':
                                downData = this.removeVote(downData, userId);
                                break;
                        }

                        switch (data.after) {
                            case 'up':
                                upData.unshift({ type: 'users', id: userId });
                                break;
                            case 'down':
                                downData.unshift({ type: 'users', id: userId });
                                break;
                            case 'none':
                                downData = this.removeVote(downData, userId);
                                upData = this.removeVote(upData, userId);
                                break;
                        }

                        this.downvotedata(downData); // TODO
                        this.upvotedata(upData);

                        m.redraw.strategy('all');
                    }

                    m.endComputation();
                });

                extend(context, 'onunload', () => channels.main.unbind('newVote'));
            });
        }
    });

    extend(PostControls, 'moderationControls', function(items, post) {
        if (post.discussion().canSeeVotes()) {
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

    const update = (post, upvoted, downvoted, load) => {
        if (!app.session.user) {
            app.modal.show(new LogInModal());
            return;
        } else if (!post.discussion().canVote()) {
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

    extend(CommentPost.prototype, 'actionItems', function(items) {
        const post = this.props.post;
        const hasDownvoted = post.hasDownvoted();
        const hasUpvoted = post.hasUpvoted();

        const icon = setting('iconName') || 'thumbs';

        const canVote = post.discussion().canVote();

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
                onclick: () => update(post, !hasUpvoted, false, val => (this.voteLoading = val)),
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
                disabled: !post.discussion().canVote(),
                onclick: () => update(post, false, !hasDownvoted, val => (this.voteLoading = val)),
            }),
            1
        );
    });
}
