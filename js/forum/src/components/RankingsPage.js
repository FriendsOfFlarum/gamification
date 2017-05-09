import avatar from 'flarum/helpers/avatar';
import Component from 'flarum/Component';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/helpers/listItems';
import icon from 'flarum/helpers/icon';
import username from 'flarum/helpers/username';
import UserCard from 'flarum/components/UserCard';


  function UserItem(user, number) {
    return (
      <tr>
        <td class={"rankings-" + number}>{icon("trophy")}</td>
          <td>
            <div className = "PostUser">
              <h3 className="rankings-info">
                <a href={app.route.user(user)} config={m.route}>
                  {avatar(user, {className: 'info-avatar rankings-' + user + '-avatar'})}
                </a>
              </h3>
            </div>
          </td>
        <td>{user.data.attributes['antoinefr-money.money']}</td>
      </tr>
    )
  }

export default class RankingsPage extends Component {
  init() {
      this.loading = true;
      this.moreResults = false;
      this.users = [];
      this.refresh();

  }
  
  view() {
    console.log(this.users);
    return (
      <div className="RankingPage">
        {IndexPage.prototype.hero()}
        <div className="container">
          <nav className="IndexPage-nav sideNav" config={IndexPage.prototype.affixSidebar}>
            <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
          </nav>
          <div className="sideNavOffset">
            <table class="rankings">
              <tr>
                <th>{app.translator.trans('reflar-gamification.forum.ranking.rank')}</th>
                <th>{app.translator.trans('reflar-gamification.forum.ranking.name')}</th>
                <th>{app.translator.trans('reflar-gamification.forum.ranking.amount')}</th>
              </tr>
              {this.users.map(user => {
                UserItem(user, i)
              })}
            </table>
          </div>
        </div>
      </div>
    )
  }

    refresh(clear = true) {
        if (clear) {
            this.loading = true;
            this.users = [];
        }

        return this.loadResults().then(
            results => {
                this.users = [];
                this.parseResults(results);
            },
            () => {
                this.loading = false;
                m.redraw();
            }
        );
    }


    loadResults(offset) {
        const data = {};
        data.page = {
            offset: offset,
            limit: '10'
        };

        app.request({
          method: 'GET',
          url: app.forum.attribute('apiUrl') + '/rankings',
          data
        }).then(this.parseResults.bind(this));
    }


    loadMore() {
        this.loading = true;

        this.loadResults(this.users.length)
            .then(this.parseResults.bind(this));
    }

    parseResults() {
        this.map(user => {
          user = app.store.find('users', user.id)
        });
        [].push.apply(this.users, results);

        this.loading = false;
        this.moreResults = !!results.payload.links.next;

        m.lazyRedraw();

        return results;
    }




}
