import { extend } from 'flarum/extend';
import DiscussionListItem from 'flarum/components/DiscussionListItem';
import abbreviateNumber from 'flarum/utils/abbreviateNumber';
import icon from 'flarum/helpers/icon';

export default function () {
    extend(DiscussionListItem.prototype, 'infoItems', function(items) {
        if (app.forum.attribute('showVotesOnDiscussionPage')) {
            $('.DiscussionListItem-info').find('.item-tags').addClass('gamification');
            items.add('discussion-votes', (
                <span className="DiscussionListItem-votes" title={app.translator.trans('fof-gamification.forum.votes')}>
                {icon('far fa-thumbs-up')}
                    {abbreviateNumber(this.props.discussion.votes())}
            </span>
            ), 10);
        }
    });
}