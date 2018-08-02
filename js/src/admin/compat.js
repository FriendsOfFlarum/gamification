import compat from '../common/compat';

import addSettingsPage from './addSettingsPage';
import SettingsPage from './components/SettingsPage';

export default Object.assign(compat, {
  'addSettingsPage': addSettingsPage,
  'components/SettingsPage': SettingsPage,
});