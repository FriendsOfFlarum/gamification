import Component from 'flarum/common/Component';
import Post from 'flarum/common/models/Post';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import Voters from './Voters';
import VotingControl from './VotingControl';

interface IAttrs {
  post: Post;
}

export default class VotingWidget extends Component<IAttrs> {
  loading: boolean = false;

  view() {
    return (
      <div className="VotingWidgetContainer">
        <div className="VotingWidget-header">{this.headerItems().toArray()}</div>
        <div className="VotingWidget-voters">
          <div className="VotingWidget-voters-actions">{this.voteActionItems().toArray()}</div>
          <div className="VotingWidget-voters-list">{this.votersItems().toArray()}</div>
        </div>
      </div>
    );
  }

  headerItems() {
    const items = new ItemList<Mithril.Children>();

    return items;
  }

  voteActionItems() {
    const items = new ItemList<Mithril.Children>();

    items.add('vote-control', <VotingControl post={this.attrs.post} voteLoading={this.loading} />, 100);

    return items;
  }

  votersItems() {
    const items = new ItemList<Mithril.Children>();

    items.add('upvotes', <Voters post={this.attrs.post} />, 100);

    return items;
  }
}
