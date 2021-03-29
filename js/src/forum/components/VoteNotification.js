import Notification from 'flarum/forum/components/Notification';

export default class UpvotedNotification extends Notification {
    icon() {
        if (this.attrs.notification.content() > 0) {
            return 'fas fa-thumbs-up';
        } else {
            return 'fas fa-thumbs-down';
        }
    }

    href() {
        return app.route.post(this.attrs.notification.subject());
    }

    content() {
        const user = this.attrs.notification.fromUser();
        const content = parseInt(this.attrs.notification.content());

        if (content > 0) {
            return app.translator.trans('fof-gamification.forum.notification.upvote', { user });
        } else {
            return app.translator.trans('fof-gamification.forum.notification.downvote', { user });
        }
    }

    excerpt() {
        return this.attrs.notification.subject().contentPlain();
    }
}
