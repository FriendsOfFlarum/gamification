import saveVote from './saveVote';
import setting from './setting';

import { helpers as commonHelpers } from '../../common/helpers';

export const helpers = {
    saveVote,
    setting,
    ...commonHelpers,
};
