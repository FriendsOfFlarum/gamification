import app from 'flarum/app'
import AddAttributes from 'Reflar/Gamification/components/AddAttributes'
import AddHotnessFilter from 'Reflar/Gamification/components/AddHotnessSort'
import AddVoteButtons from 'Reflar/Gamification/components/AddVoteButtons'
import Rank from 'Reflar/Gamification/models/Rank'
import RankingsPage from 'Reflar/Gamification/components/RankingsPage'
import VoteNotification from 'Reflar/Gamification/components/VoteNotification'

app.initializers.add('Reflar-Gamification', app => {
  app.store.models.ranks = Rank

  app.notificationComponents.vote = VoteNotification

  app.routes.rankings = {path: '/rankings', component: RankingsPage.component()}

  AddVoteButtons()
  AddHotnessFilter()
  AddAttributes()
})
