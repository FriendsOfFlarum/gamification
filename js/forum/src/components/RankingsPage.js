import avatar from 'flarum/helpers/avatar';
import Component from 'flarum/Component';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/helpers/listItems';
import icon from 'flarum/helpers/icon';
import username from 'flarum/helpers/username';
import UserCard from 'flarum/components/UserCard';

export default class RankingsPage extends Component {
  init() {
    app.current = this;
    this.cardVisible = false;

    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/rankings'
    }).then(
        response => {
          this.data = response.data;
          this.users = [];
          for (i = 0; i < this.data.length; i++) {
            this.users[i] = [];
            this.users[i]['user'] = this.findRecipient(this.data[i].id);
            this.users[i]['class'] = i+1;
          }
          console.log(this.users);
          console.log(this.users[1]);
          this.loading = false;
          m.redraw();
        }
    )
  }

  view() {
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
                  {this.users.map((user) => {
                    
                  user['user'].then(function(user) {
                    
                  let card = '';

                  return [
                    <tr>
                      <td class={"rankings-" + user['class']}>{icon("trophy")}</td>
                      <td>
                        <div className = "PostUser">
                          <h3 className="rankings-info">
                            <a href={app.route.user(user)} config={m.route}>
                              {avatar(user, {className: 'info-avatar rankings-' + user + '-avatar'})}
                            </a>
                          </h3>
                          {card}
                        </div>
                      </td>
                      <td>{user.data.attributes['antoinefr-money.money']}</td>
                    </tr>
                    ]
                  })
                })}
            </table>
          </div>
        </div>
      </div>
    );
  }

  findRecipient(id) {
    return app.store.find('users', id);
  }

  config(isInitialized) {
    if (isInitialized) return;

    let timeout;

    this.$()
      .on('mouseover', 'h3 a, .UserCard', () => {
        clearTimeout(timeout);
        timeout = setTimeout(this.showCard.bind(this), 500);
      })
      .on('mouseout', 'h3 a, .UserCard', () => {
        clearTimeout(timeout);
        timeout = setTimeout(this.hideCard.bind(this), 250);
      });
  }

  showCard() {
    this.cardVisible = true;

    m.redraw();

    setTimeout(() => this.$('.UserCard').addClass('in'));
  }

  hideCard() {
    this.$('.UserCard').removeClass('in')
      .one('transitionend webkitTransitionEnd oTransitionEnd', () => {
        this.cardVisible = false;
        m.redraw();
      });
  }
}
