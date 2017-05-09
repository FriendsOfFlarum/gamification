import avatar from 'flarum/helpers/avatar';
import Component from 'flarum/Component';
import IndexPage from 'flarum/components/IndexPage';
import listItems from 'flarum/helpers/listItems';
import icon from 'flarum/helpers/icon';
import username from 'flarum/helpers/username';


export default class RankingsPage extends Component {
    init() {
        this.loading = true;
        this.moreResults = false;
        this.users = [];
        this.refresh();

    }

    view() {
        return (
            <div className="RankingPage">
                {IndexPage.prototype.hero()}
                <div className="container">
                    <nav className="IndexPage- nav sideNav" config={IndexPage.prototype.affixSidebar}>
                        <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
                    </nav>
                    <div className="sideNavOffset">
                        <table class="rankings">
                            <tr>
                                <th>{app.translator.trans('reflar-gamification.forum.ranking.rank')}</th>
                                <th>{app.translator.trans('reflar-gamification.forum.ranking.name')}</th>
                                <th>{app.translator.trans('reflar-gamification.forum.ranking.amount')}</th>
                            </tr>
                            {this.users.map(function (user, i) {
                                console.log(user);


                                return [
                                    <tr>
                                        <td class={"rankings-" + ++i}> {icon("trophy")}</td>
                                        <td>
                                            <div className="PostUser">
                                                <h3 className="rankings-info">
                                                    <a href={app.route.user(user)} config={m.route}>
                                                        {avatar(user, {className: 'info-avatar rankings-' + ++i + '-avatar'})} {username(user)}
                                                    </a>
                                                </h3>
                                            </div>
                                        </td>
                                        <td>{user.data.attributes.Points}</td>
                                    </tr>
                                ]
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

        return app.request({
            method: 'GET',
            url: app.forum.attribute('apiUrl') + '/rankings',
            data
        });
    }


    loadMore() {
        this.loading = true;

        this.loadResults(this.users.length)
            .then(this.parseResults.bind(this));
    }

    parseResults(results) {
        let users = [];
        results.data.map(function (user, i) {
            users[i] = app.store.getBy('users', 'id', user.id);
        });

        [].push.apply(this.users, users);

        this.loading = false;

        m.lazyRedraw();

        return results;
    }


}
