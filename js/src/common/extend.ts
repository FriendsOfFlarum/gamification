import Extend from 'flarum/common/extenders';
import Rank from './models/Rank';
import HotGambit from './gambits/HotGambit';

export default [
  new Extend.Store() //
    .add('ranks', Rank),

  new Extend.Search() //
    .gambit('discussions', HotGambit),
];
