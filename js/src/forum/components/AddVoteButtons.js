import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import LogInModal from 'flarum/components/LogInModal';
import CommentPost from 'flarum/components/CommentPost';
import PostControls from 'flarum/utils/PostControls';
import VotesModal from './VotesModal';

export default function () {

    extend(CommentPost.prototype, 'config', function (x, isInitialized, context) {
        if (isInitialized) return

        if (app.pusher) {
            app.pusher.then(channels => {
                channels.main.bind('newVote', data => {

                    var userId = parseInt(data.userId)

                    if (userId == app.session.user.id()) return

                    m.startComputation()

                    if (this.postId() == data.postId) {

                        var upData = this.upvotedata()
                        var downData = this.downvotedata()

                        switch (data.before) {
                            case 'up':
                                upData = this.removeVote(upData, userId)
                                break;
                            case 'down':
                                downData = this.removeVote(downData, userId)
                                break;

                        }

                        switch (data.after) {
                            case 'up':
                                upData.unshift({type: 'users', id: userId})
                                break;
                            case 'down':
                                downData.unshift({type: 'users', id: userId})
                                break;
                            case 'none':
                                downData = this.removeVote(downData, userId)
                                upData = this.removeVote(upData, userId)
                                break;
                        }

                        this.downvotedata(downData)
                        this.upvotedata(upData)

                        m.redraw.strategy('all');

                    }

                    m.endComputation()

                })


                extend(context, 'onunload', () => channels.main.unbind('newVote'));
            });
        }
    })

    extend(PostControls, 'moderationControls', function (items, post) {
        if (post.discussion().canSeeVotes()) {
            items.add('viewVotes', [
                m(Button, {
                    icon: 'fas fa-thumbs-up',
                    onclick: () => {
                        app.modal.show(new VotesModal({post}))
                    }
                }, app.translator.trans('reflar-gamification.forum.mod_item'))
            ]);
        }
    });


    extend(CommentPost.prototype, 'actionItems', function (items) {
        const post = this.props.post

        this.postId = m.prop(post.data.id)

        this.downvotedata = m.prop(post.data.relationships.downvotes.data)
        this.upvotedata = m.prop(post.data.relationships.upvotes.data)

        let isUpvoted = app.session.user && post.upvotes().some(user => user === app.session.user)
        let isDownvoted = app.session.user && post.downvotes().some(user => user === app.session.user)

        if (!app.session.user) {
            isDownvoted = false
            isUpvoted = false
        }

        let icon = app.forum.attribute('IconName')

        if (icon === null || icon === '') {
            icon = 'thumbs'
        }

        this.removeVote = function (data, userId) {
            data.some((vote, i) => {
                if (vote.id == userId) {
                    data.splice(i, 1)
                }
            })
            return data
        }

        items.add('upvote',
            Button.component({
                icon: 'fas fa-' + icon + '-up',
                className: 'Post-vote Post-upvote',
                style: isUpvoted !== false ? 'color:' + app.forum.data.attributes.themePrimaryColor : 'color:',
                disabled: !post.discussion().canVote(),
                onclick: () => {
                    if (!app.session.user) {
                        app.modal.show(new LogInModal())
                        return
                    }
                    if (!post.discussion().canVote()) return

                    var upData = post.data.relationships.upvotes.data;
                    var downData = post.data.relationships.downvotes.data;

                    isUpvoted = !isUpvoted;

                    isDownvoted = false;

                    post.save([isUpvoted, isDownvoted, 'vote']);

                    upData.some((upvote, i) => {
                        if (upvote.id === app.session.user.id()) {
                            upData.splice(i, 1);
                            return true;
                        }
                    });
                    downData.some((downvote, i) => {
                        if (downvote.id === app.session.user.id()) {
                            downData.splice(i, 1);
                            return true;
                        }
                    });
                    if (isUpvoted) {
                        upData.unshift({type: 'users', id: app.session.user.id()});
                    }
                }
            }), 3
        )

        items.add('points',
            <label className='Post-points'>
                {this.upvotedata().length - this.downvotedata().length}
            </label>
        , 2)

        items.add('downvote',
            Button.component({
                icon: 'fas fa-' + icon + '-down',
                className: 'Post-vote Post-downvote',
                style: isDownvoted !== false ? 'color:' + app.forum.data.attributes.themePrimaryColor : '',
                disabled: !post.discussion().canVote(),
                onclick: () => {
                    if (!app.session.user) {
                        app.modal.show(new LogInModal())
                        return
                    }
                    if (!post.discussion().canVote()) return

                    var upData = post.data.relationships.upvotes.data;
                    var downData = post.data.relationships.downvotes.data

                    isDownvoted = !isDownvoted;

                    isUpvoted = false;

                    post.save([isUpvoted, isDownvoted, 'vote']);

                    upData.some((upvote, i) => {
                        if (upvote.id === app.session.user.id()) {
                            upData.splice(i, 1);
                            return true;
                        }
                    });
                    downData.some((downvote, i) => {
                        if (downvote.id === app.session.user.id()) {
                            downData.splice(i, 1);
                            return true;
                        }
                    });

                    if (isDownvoted) {
                        downData.unshift({type: 'users', id: app.session.user.id()});
                    }
                }
            }), 1
        )
    })
}
