import HotGambit from './gambits/HotGambit';
import Extend from 'flarum/common/extenders';
import Rank from './models/Rank';

export default [
  new Extend.Store() //
    .add('ranks', Rank),

  new Extend.Search() //
      .gambit('discussions', HotGambit),
];
