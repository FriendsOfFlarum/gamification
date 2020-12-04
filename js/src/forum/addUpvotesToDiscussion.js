import { extend } from 'flarum/extend';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import abbreviateNumber from 'flarum/utils/abbreviateNumber';
import icon from 'flarum/helpers/icon';
import setting from './helpers/setting';

export default function () {
    if (!setting('showVotesOnDiscussionPage', true) || setting('useAlternateLayout', true)) {
        return;
    }

    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
        items.add(
            'discussion-votes',
            <span className="DiscussionListItem-votes" title={app.translator.trans('fof-gamification.forum.votes')}>
                {icon('far fa-thumbs-up')}
                {abbreviateNumber(this.attrs.discussion.votes())}
            </span>,
            20
        );
    });
}
