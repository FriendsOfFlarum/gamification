import app from 'flarum/app'
import {extend} from 'flarum/extend'
import PermissionGrid from 'flarum/components/PermissionGrid'

import addSettingsPage from 'Reflar/Gamification/addSettingsPage'
import Rank from 'Reflar/Gamification/models/Rank'

app.initializers.add('Reflar-Gamification', app => {
  app.store.models.ranks = Rank

  extend(PermissionGrid.prototype, 'replyItems', items => {
    items.add('Vote', {
      icon: 'thumbs-up',
      label: app.translator.trans('reflar-gamification.admin.permissions.vote_label'),
      permission: 'discussion.vote'
    })
  })

  extend(PermissionGrid.prototype, 'viewItems', items => {
    items.add('canSeeVotes', {
      icon: 'info-circle',
      label: app.translator.trans('reflar-gamification.admin.permissions.see_votes_label'),
      permission: 'discussion.canSeeVotes'
    })
    items.add('canViewRankingPage', {
      icon: 'trophy',
      label: app.translator.trans('reflar-gamification.admin.permissions.see_ranking_page'),
      permission: 'reflar.gamification.viewRankingPage',
      allowGuest: true
    })
  })

  addSettingsPage()
})
