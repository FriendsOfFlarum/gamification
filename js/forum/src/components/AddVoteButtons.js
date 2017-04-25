import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import CommentPost from 'flarum/components/CommentPost';

export default function () {
  extend(CommentPost.prototype, 'actionItems', function(items) {
    const post = this.props.post;

    if (post.isHidden()) return;

    let isUpvoted = app.session.user && post.upvotes().some(user => user === app.session.user);
    let isDownvoted = app.session.user && post.downvotes().some(user => user === app.session.user);

    items.add('upvote',
      Button.component({
        icon: 'thumbs-up',
        className: 'Post-vote Post-upvote',
        style: isUpvoted !== false ? 'color:' + app.forum.attribute('themePrimaryColor') : 'color:',
        onclick: () => {
          var upData = post.data.relationships.upvotes.data;
          var downData = post.data.relationships.downvotes.data;

          isUpvoted = !isUpvoted;

          isDownvoted = false;

          post.save({isUpvoted, isDownvoted});

          upData.some((upvote, i) => {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1);
              return true;
            }
          });

          downData.some((downvote, i) => {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1);
              return true;
            }
          });

          if (isUpvoted) {
            upData.unshift({type: 'users', id: app.session.user.id()});
          }
        }
      })
    );
    
      items.add('points', (
        <div className="Post-points">
          {post.data.relationships.upvotes.data.length - post.data.relationships.downvotes.data.length}
        </div>
      ));

    items.add('downvote',
      Button.component({
        icon: 'thumbs-down',
        className: 'Post-vote Post-downvote',
        style: isDownvoted !== false ? 'color:' + app.forum.attribute('themePrimaryColor') : '',
        onclick: () => {
          var upData = post.data.relationships.upvotes.data;
          var downData = post.data.relationships.downvotes.data

          isDownvoted = !isDownvoted;

          isUpvoted = false;

          post.save({isUpvoted, isDownvoted});

          upData.some((upvote, i) => {
            if (upvote.id === app.session.user.id()) {
              upData.splice(i, 1);
              return true;
            }
          });

          downData.some((downvote, i) => {
            if (downvote.id === app.session.user.id()) {
              downData.splice(i, 1);
              return true;
            }
          });

          if (isDownvoted) {
            downData.unshift({type: 'users', id: app.session.user.id()});
          }
        }
      })
    );
  });
}
