import { BooleanGambit } from 'flarum/common/query/IGambit';
export default class TrendingGambit extends BooleanGambit {
    key(): string;
    filterKey(): string;
}
