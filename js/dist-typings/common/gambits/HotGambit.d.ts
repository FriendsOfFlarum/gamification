import { BooleanGambit } from 'flarum/common/query/IGambit';
export default class HotGambit extends BooleanGambit {
    key(): string;
    filterKey(): string;
}
