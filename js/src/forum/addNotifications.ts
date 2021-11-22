import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import VoteNotification from './components/VoteNotification';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';
import ItemList from 'flarum/common/utils/ItemList';

export default function addNotifications() {
  app.notificationComponents.vote = VoteNotification;

  extend(NotificationGrid.prototype, 'notificationTypes', function (items: ItemList) {
    items.add('vote', {
      name: 'vote',
      icon: 'fas fa-thumbs-up',
      label: app.translator.trans('fof-gamification.forum.notification.prefrences.vote'),
    });
  });
}
