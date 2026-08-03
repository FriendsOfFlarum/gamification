import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';

export interface RankingImageAttrs extends ComponentAttrs {
  place: number;
}

export default class RankingImage extends Component<RankingImageAttrs> {
  view() {
    const imgUrl = app.forum.attribute(`fof-gamification.topimage${this.attrs.place}Url`);
    const place = this.attrs.place;

    // Both branches return the same kind of node: the caller decides what
    // cell this sits in, and returning a <td> from one branch only used to
    // nest a cell inside a cell.
    return imgUrl ? (
      <img className={`rankings-image rankings-${place}`} src={imgUrl} alt="" />
    ) : (
      <Icon name="fas fa-trophy" className={`rankings-${place}`} />
    );
  }
}
