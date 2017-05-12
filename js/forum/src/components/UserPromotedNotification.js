import Notification from 'flarum/components/Notification';

export default class UserPromotedNotification extends Notification {
  icon() {
    return 'arrow-up';
  }

  href() {
    return app.route.post(this.props.notification.subject());
  }

  content() {
    const notification = this.props.notification;

    return app.translator.trans('reflar-gamification.forum.notification.promoted', {rank: notification.content().rank});
  }

  excerpt() {
    return this.props.notification.subject().contentPlain();
  }
}