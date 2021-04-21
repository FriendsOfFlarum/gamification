import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin';

export default class Rank extends mixin(Model, {
    points: Model.attribute('points'),
    name: Model.attribute('name'),
    color: Model.attribute('color'),
}) {}
