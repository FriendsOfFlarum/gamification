import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import Voters from './components/Voters';
import type ItemList from 'flarum/common/utils/ItemList';

import type Mithril from 'mithril';

/**
 * Adds our custom {@link Voters} component to the discussion sidebar.
 */
export default function addVotersToDiscussionPageSideBar() {
  extend(DiscussionPage.prototype, 'sidebarItems', function (this: DiscussionPage, items: ItemList<Mithril.Children>) {
    const discussion = this.discussion;
    const posts = discussion!.posts() || [];
    const firstPost = posts?.[0];
    if (firstPost?.canSeeVotes?.() && firstPost?.seeVoters?.() && !!app.forum.attribute('fof-gamification.firstPostOnly')) {
      items.add('op-voters', <Voters post={firstPost} />, 90);
    }
  });
}
