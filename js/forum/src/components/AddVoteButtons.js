import {extend} from 'flarum/extend'
import app from 'flarum/app'
import Button from 'flarum/components/Button'
import LogInModal from 'flarum/components/LogInModal'
import CommentPost from 'flarum/components/CommentPost'

import VotesModal from 'Reflar/Gamification/components/VotesModal'

export default function () {

    extend(CommentPost.prototype, 'config', function (x, isInitialized, context) {
        if (isInitialized) return

        app.pusher.then(channels => {
            channels.main.bind('newVote', data => {


                if (this.postId() == data.postId) {

                    var userId = parseInt(data.userId)

                    var upData = this.upvotedata()
                    var downData = this.downvotedata()

                    console.log(this.upvotedata())
                    console.log(this.downvotedata())

                    switch (data.type) {
                        case 'none2up':
                            upData.unshift({type: 'users', id: userId})
                            break;
                        case 'none2down':
                            downData.unshift({type: 'users', id: userId})
                            break;
                        case 'down2up':
                            upData.unshift({type: 'users', id: userId})
                            downData.some((downvote, i) => {
                                if (downvote.id == userId) {
                                    downData.splice(i, 1)
                                }
                            })
                            break;
                        case 'up2down':
                            upData.some((upvote, i) => {
                                if (upvote.id == userId) {
                                    upData.splice(i, 1)
                                }
                            })
                            downData.unshift({type: 'users', id: userId})
                            break;
                        case 'down2none':
                            downData.some((downvote, i) => {
                                if (downvote.id == userId) {
                                    downData.splice(i, 1)
                                }
                            })
                            break;
                        case 'up2none':
                            upData.some((upvote, i) => {
                                if (upvote.id == userId) {
                                    upData.splice(i, 1)
                                }
                            })
                            break;
                    }
                    this.upvotedata(upData)
                    this.downvotedata(downData)

                    console.log(this.upvotedata())
                    console.log(this.downvotedata())


                }

            })


            extend(context, 'onunload', () => channels.main.unbind('newVote'));
        });

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
                    var downData = post.data.relationships.downvotes.data

                    isUpvoted = !isUpvoted

                    isDownvoted = false

                    post.save([isUpvoted, isDownvoted, 'vote'])

                    upData.some((upvote, i) => {
                        if (upvote.id === app.session.user.id()) {
                            upData.splice(i, 1)
                            return true
                        }
                    })

                    downData.some((downvote, i) => {
                        if (downvote.id === app.session.user.id()) {
                            downData.splice(i, 1)
                            return true
                        }
                    })

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
                    var upData = post.data.relationships.upvotes.data
                    var downData = post.data.relationships.downvotes.data

                    isDownvoted = !isDownvoted

                    isUpvoted = false

                    post.save([isUpvoted, isDownvoted, 'vote'])

                    upData.some((upvote, i) => {
                        if (upvote.id === app.session.user.id()) {
                            upData.splice(i, 1)
                            return true
                        }
                    })

                    downData.some((downvote, i) => {
                        if (downvote.id === app.session.user.id()) {
                            downData.splice(i, 1)
                            return true
                        }
                    })

                    if (isDownvoted) {
                        downData.unshift({type: 'users', id: app.session.user.id()})
                    }
                }
            })
        )
    })
}
