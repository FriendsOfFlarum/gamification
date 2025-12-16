import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import { default as commonExtend } from '../common/extend';
import SettingsPage from './components/SettingsPage';

export default [
  ...commonExtend,

  new Extend.Admin() //
    .page(SettingsPage)
    .permission(
      () => ({
        icon: 'fas fa-thumbs-up',
        label: app.translator.trans('fof-gamification.admin.permissions.vote_label'),
        permission: 'discussion.votePosts',
      }),
      'reply'
    )
    .permission(
      () => ({
        icon: 'fas fa-thumbs-up',
        label: app.translator.trans('fof-gamification.admin.permissions.see_votes_label'),
        permission: 'discussion.canSeeVotes',
        allowGuest: true,
      }),
      'view'
    )
    .permission(
      () => ({
        icon: 'fas fa-info-circle',
        label: app.translator.trans('fof-gamification.admin.permissions.see_voters_label'),
        permission: 'discussion.canSeeVoters',
        allowGuest: true,
      }),
      'view'
    )
    .permission(
      () => ({
        icon: 'fas fa-trophy',
        label: app.translator.trans('fof-gamification.admin.permissions.see_ranking_page'),
        permission: 'fof.gamification.viewRankingPage',
        allowGuest: true,
      }),
      'view'
    )
    .permission(
      () => ({
        icon: 'fas fa-bell',
        label: app.translator.trans('fof-gamification.admin.permissions.upvote_notifications'),
        permission: 'discussion.upvote_notifications',
      }),
      'view'
    )
    .permission(
      () => ({
        icon: 'fas fa-bell',
        label: app.translator.trans('fof-gamification.admin.permissions.downvote_notifications'),
        permission: 'discussion.downvote_notifications',
      }),
      'view'
    ),
];
