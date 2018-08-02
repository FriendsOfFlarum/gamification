import compat from '../common/compat';

import AddAttributes from './components/AddAttributes';
import AddHotnessSort from './components/AddHotnessSort';
import AddVoteButtons from './components/AddVoteButtons';
import RankingsPage from './components/RankingsPage';
import VoteNotification from './components/VoteNotification';
import VotesModal from './components/VotesModal';

export default Object.assign(compat, {
  'components/AddAttributes': AddAttributes,
  'components/AddHotnessSort': AddHotnessSort,
  'components/AddVoteButtons': AddVoteButtons,
  'components/RankingsPage': RankingsPage,
  'components/VoteNotification': VoteNotification,
  'components/VotesModal': VotesModal,
});