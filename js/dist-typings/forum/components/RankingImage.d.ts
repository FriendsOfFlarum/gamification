/// <reference types="mithril" />
import Component, { ComponentAttrs } from 'flarum/common/Component';
export interface RankingImageAttrs extends ComponentAttrs {
    place: number;
}
export default class RankingImage extends Component<RankingImageAttrs> {
    view(): JSX.Element;
}
