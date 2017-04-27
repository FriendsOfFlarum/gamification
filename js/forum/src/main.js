import {extend} from 'flarum/extend';
import app from 'flarum/app';
// import NotificationGrid from 'flarum/components/NotificationGrid';

import AddAttributes from 'Reflar/gamification/components/AddAttributes';
import AddHotnessFilter from 'Reflar/gamification/components/AddHotnessSort';
import AddVoteButtons from 'Reflar/gamification/components/AddVoteButtons';
import Rank from 'Reflar/gamification/models/Rank';
// import UserPromotedNotification from 'Reflar/gamification/components/UserPromotedNotification';
// import RankingsPage from 'Reflar/gamification/components/RankingsPage';


app.initializers.add('Reflar-gamification', () => {
  
  
    app.store.models.ranks = Rank;
  
    // app.notificationComponents.userPromoted = UserPromotedNotification;

    // app.routes.page = {path: '/rankings', component: RankingsPage.component()};

    AddVoteButtons();
    AddHotnessFilter();
    AddAttributes();

  /**
    extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
        items.add('userPromoted', {
            name: 'userPromoted',
            icon: 'arrow-up',
            label: ['hi']
        });
    });*/
});
