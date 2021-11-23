import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import Voters from './components/Voters';
import type ItemList from 'flarum/common/utils/ItemList';

/**
 * Adds our custom {@link Voters} component to the discussion sidebar.
 */
export default function addVotersToDiscussionPageSideBar() {
  extend(DiscussionPage.prototype, 'sidebarItems', function (this: DiscussionPage, items: ItemList) {
    const discussion = this.discussion;
    const posts = discussion.posts();
    const firstPost = posts[0];

    // interim workaround until Flarum 1.2
    items.replace('controls', null, 100);
    items.replace('subscription', null, 80);

    if (firstPost?.canSeeVotes?.() && !!app.forum.attribute('fof-gamification-op-votes-only')) {
      items.add('op-voters', <Voters post={firstPost} />, 90);
    }
  });
}
