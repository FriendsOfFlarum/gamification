import Notification from 'flarum/components/Notification'

export default class UpvotedNotification extends Notification {
    icon() {
        if (this.props.notification.content() === 'Up') {
            return 'fas fa-thumbs-up'
        } else {
            return 'fas fa-thumbs-down'
        }
    }

    href() {
        return app.route.post(this.props.notification.subject())
    }

    content() {
		let username = this.props.notification.fromUser().username();
		
        if (this.props.notification.content() === 'Up') {
            return app.translator.trans('reflar-gamification.forum.notification.upvote', {username})
        } else {
            return app.translator.trans('reflar-gamification.forum.notification.downvote', {username})
        }
    }

    excerpt() {
        return this.props.notification.subject().contentPlain()
    }
}
