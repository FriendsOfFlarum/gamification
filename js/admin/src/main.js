import app from 'flarum/app';
import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';

import addSettingsPage from 'Reflar/gamification/addSettingsPage';

app.initializers.add('reflar-gamification', () => {

    extend(PermissionGrid.prototype, 'replyItems', items => {
      items.add('Vote', {
        icon: 'thumbs-up',
        label: app.translator.trans('reflar-gamification.admin.permissions.vote_label'),
        permission: 'discussion.vote'
      });
    });
  
    addSettingsPage();

});
