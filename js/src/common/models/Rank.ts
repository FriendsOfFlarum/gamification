import Model from 'flarum/common/Model';

export default class Rank extends Model {
  points() {
    return Model.attribute<number>('points').call(this);
  }

  name() {
    return Model.attribute<string>('name').call(this);
  }

  color() {
    return Model.attribute<string>('color').call(this);
  }
}
