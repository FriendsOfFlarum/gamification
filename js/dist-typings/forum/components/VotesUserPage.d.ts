import PostsUserPage from 'flarum/forum/components/PostsUserPage';
import type Post from 'flarum/common/models/Post';
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
    loadResults(offset: number): Promise<import("flarum/common/Store").ApiResponsePlural<Post>>;
}
