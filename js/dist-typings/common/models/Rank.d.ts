import Model from 'flarum/common/Model';
export default class Rank extends Model {
    points(): number;
    name(): string;
    color(): string;
}
