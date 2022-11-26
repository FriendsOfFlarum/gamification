import { extend } from 'flarum/common/extend';
import type ItemList from 'flarum/common/utils/ItemList';
import CommentPost from 'flarum/forum/components/CommentPost';

import type Mithril from 'mithril';
import VotingWidget from './components/VotingWidget';

/**
 * Adds our custom {@link VotingWidget} component to the post footer.
 */
export default function addVotersToDiscussionPageSideBar() {
  extend(CommentPost.prototype, 'footerItems', function (items: ItemList<Mithril.Children>) {
    const post = this.attrs.post;

    if (post?.canSeeVotes() && post?.seeVoters()) {
      items.add('post-voters', <VotingWidget post={post} />, -7);
    }
  });
}
