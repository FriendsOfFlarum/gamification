import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import PostControls from 'flarum/forum/utils/PostControls';

import VotesModal from './components/VotesModal';

export default function () {
  extend(PostControls, 'moderationControls', function (items, post) {
    if (post.contentType() === 'comment' && post.seeVoters()) {
      items.add(
        'viewVotes',
        <Button
          icon="fas fa-thumbs-up"
          onclick={() => {
            app.modal.show(VotesModal, { post });
          }}
        >
          {app.translator.trans('fof-gamification.forum.mod_item')}
        </Button>
      );
    }
  });
}
