import app from 'flarum/admin/app';
import SettingsPage from './components/SettingsPage';
import Rank from '../common/models/Rank';

app.initializers.add('fof-gamification', (app) => {
    app.store.models.ranks = Rank;

    app.extensionData
        .for('fof-gamification')
        .registerPermission(
            {
                icon: 'fas fa-thumbs-up',
                label: app.translator.trans('fof-gamification.admin.permissions.vote_label'),
                permission: 'discussion.votePosts',
            },
            'reply'
        )
        .registerPermission(
            {
                icon: 'fas fa-info-circle',
                label: app.translator.trans('fof-gamification.admin.permissions.see_votes_label'),
                permission: 'discussion.canSeeVotes',
            },
            'view'
        )
        .registerPermission(
            {
                icon: 'fas fa-trophy',
                label: app.translator.trans('fof-gamification.admin.permissions.see_ranking_page'),
                permission: 'fof.gamification.viewRankingPage',
            },
            'view'
        )
        .registerPage(SettingsPage);
});

export * from '../common/helpers';
export * from './components';
