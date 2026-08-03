import app from 'flarum/common/app';
import { BooleanGambit } from 'flarum/common/query/IGambit';

export default class TrendingGambit extends BooleanGambit {
  key() {
    return app.translator.trans('fof-gamification.lib.gambits.trending.key', {}, true);
  }

  filterKey() {
    return 'trending';
  }
}
