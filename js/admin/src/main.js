import app from 'flarum/app';

import addSettingsPage from 'Reflar/gamification/addSettingsPage';

app.initializers.add('reflar-gamification', () => {

    addSettingsPage();

});
