import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import icon from 'flarum/common/helpers/icon';

export interface RankingImageAttrs extends ComponentAttrs {
  place: number;
}

export default class RankingImage extends Component<RankingImageAttrs> {
  view() {
    const imgUrl = app.forum.attribute(`fof-gamification.topimage${this.attrs.place}Url`);
    const place = this.attrs.place;

    return imgUrl ? (
      <img className={`rankings-mobile rankings-image rankings-${place}`} src={imgUrl} alt="" />
    ) : (
      <td className={`rankings-mobile rankings-${place}`}>{icon('fas fa-trophy')}</td>
    );
  }
}
