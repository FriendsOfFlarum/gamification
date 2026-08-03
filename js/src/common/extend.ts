import Extend from 'flarum/common/extenders';
import Rank from './models/Rank';
import TrendingGambit from './gambits/TrendingGambit';

export default [
  new Extend.Store() //
    .add('ranks', Rank),

  new Extend.Search() //
    .gambit('discussions', TrendingGambit),
];
