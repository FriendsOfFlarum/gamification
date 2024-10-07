import Extend from 'flarum/common/extenders';
import Rank from './models/Rank';

export default [
  new Extend.Store() //
    .add('ranks', Rank),
];
