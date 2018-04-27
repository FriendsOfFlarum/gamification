import {extend} from 'flarum/extend'
import app from 'flarum/app'
import Button from 'flarum/components/Button'
import LogInModal from 'flarum/components/LogInModal'
import CommentPost from 'flarum/components/CommentPost'
import VotesModal from './VotesModal'

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

        $('.Post-vote').unbind().on('click touchend', function () {
            $(this).addClass('cbutton--click')
            setTimeout(function () {
                $('.Post-vote').removeClass('cbutton--click');
            }, 600);
        })
    })


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
                icon: icon + '-up',
                className: 'Post-vote Post-upvote',
                style: isUpvoted !== false ? 'color:' + app.forum.data.attributes.themePrimaryColor : 'color:',
                disabled: !post.discussion().canVote(),
                onclick: () => {
                    if (!app.session.user) {
                        app.modal.show(new LogInModal())
                        return
                    }
                    if (!post.discussion().canVote()) return
                    var upData = post.data.relationships.upvotes.data

                    isUpvoted = !isUpvoted

                    isDownvoted = false

                    post.save([isUpvoted, isDownvoted, 'vote'])

                    upData = this.removeVote(upData, app.session.user.id())

                    if (isUpvoted) {
                        upData.unshift({type: 'users', id: app.session.user.id()})
                    }
                }
            })
        )

        items.add('points',
            <button disabled={!post.discussion().canSeeVotes()} className='Post-points' onclick={() => {
                if (!post.discussion().canSeeVotes()) return
                app.modal.show(new VotesModal({post}))
            }}>
                {this.upvotedata().length - this.downvotedata().length}
            </button>
        )

        items.add('downvote',
            Button.component({
                icon: icon + '-down',
                className: 'Post-vote Post-downvote',
                style: isDownvoted !== false ? 'color:' + app.forum.data.attributes.themePrimaryColor : '',
                disabled: !post.discussion().canVote(),
                onclick: () => {
                    if (!app.session.user) {
                        app.modal.show(new LogInModal())
                        return
                    }
                    if (!post.discussion().canVote()) return
                    var downData = post.data.relationships.downvotes.data

                    isDownvoted = !isDownvoted

                    isUpvoted = false

                    post.save([isUpvoted, isDownvoted, 'vote'])

                    downData = this.removeVote(downData, app.session.user.id())

                    if (isDownvoted) {
                        downData.unshift({type: 'users', id: app.session.user.id()})
                    }
                }
            })
        )
    })
}
