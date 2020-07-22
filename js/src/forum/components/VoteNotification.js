import Notification from 'flarum/components/Notification';

export default class UpvotedNotification extends Notification {
    icon() {
        if (this.props.notification.content() > 0) {
            return 'fas fa-thumbs-up';
        } else {
            return 'fas fa-thumbs-down';
        }
    }

    href() {
        return app.route.post(this.props.notification.subject());
    }

    content() {
        const user = this.props.notification.fromUser();
        const content = this.props.notification.content();

        if (content > 0) {
            return app.translator.trans('fof-gamification.forum.notification.upvote', { user });
        } else {
            return app.translator.trans('fof-gamification.forum.notification.downvote', { user });
        }
    }

    excerpt() {
        return this.props.notification.subject().contentPlain();
    }
}
