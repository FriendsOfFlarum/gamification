import app from 'flarum/forum/app';
import PostsUserPage from 'flarum/forum/components/PostsUserPage';

import type Post from 'flarum/common/models/Post';
import type { ApiQueryParamsPlural } from 'flarum/common/Store';

/**
 * The `VotesUserPage` component shows posts which user voted on.
 */
export default class VotesUserPage extends PostsUserPage {
  /**
   * Load a new page of the user's activity feed.
   *
   * @param offset The position to start getting results from.
   * @protected
   */
  loadResults(offset: number = 0) {
    const params: ApiQueryParamsPlural = {
      filter: {
        type: 'comment',
        ...(this.user?.id() && { voted: this.user.id() }),
      },
      page: { offset, limit: this.loadLimit },
      sort: '-createdAt',
    };

    return app.store.find<Post[]>('posts', params);
  }
}
