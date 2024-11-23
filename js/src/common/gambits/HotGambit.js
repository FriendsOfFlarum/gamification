import app from 'flarum/common/app';
import { BooleanGambit } from 'flarum/common/query/IGambit';

export default class HotGambit extends BooleanGambit {
  key() {
    return app.translator.trans('fof-gamification.lib.gambits.hot.key', {}, true);
  }

  filterKey() {
    return 'hot';
  }
}
