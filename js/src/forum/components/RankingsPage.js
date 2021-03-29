import avatar from 'flarum/common/helpers/avatar';
import Page from 'flarum/common/components/Page';
import IndexPage from 'flarum/forum/components/IndexPage';
import AffixedSidebar from 'flarum/forum/components/AffixedSidebar';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import listItems from 'flarum/common/helpers/listItems';
import username from 'flarum/common/helpers/username';
import icon from 'flarum/common/helpers/icon';
import setting from '../helpers/setting';
import Link from 'flarum/common/components/Link';

export default class RankingsPage extends Page {
    oninit(vnode) {
        super.oninit(vnode);

        if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
            m.route.set('/');
        }

        this.loading = true;
        this.users = [];
        this.refresh();
    }

    view() {
        let loading;

        if (this.loading) {
            loading = LoadingIndicator.component();
        } else {
            loading = Button.component(
                {
                    className: 'Button',
                    onclick: this.loadMore.bind(this),
                },
                app.translator.trans('core.forum.discussion_list.load_more_button')
            );
        }

        return (
            <div className="TagsPage">
                {IndexPage.prototype.hero()}
                <div className="container">
                    <AffixedSidebar>
                        <nav className="RankingPage-nav IndexPage-nav sideNav">
                            <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
                        </nav>
                    </AffixedSidebar>
                    <div className="RankingPage sideNavOffset">
                        <table class="rankings">
                            <tr>
                                <th className="rankings-mobile">{app.translator.trans('fof-gamification.forum.ranking.rank')}</th>
                                <th>{app.translator.trans('fof-gamification.forum.ranking.name')}</th>
                                <th>{app.translator.trans('fof-gamification.forum.ranking.amount')}</th>
                            </tr>
                            {this.users.map((user, i) => {
                                ++i;
                                return [
                                    <tr className={'ranking-' + i}>
                                        {i < 4 ? (
                                            setting('customRankingImages', true) ? (
                                                <img
                                                    className="rankings-mobile rankings-image"
                                                    src={app.forum.attribute('baseUrl') + app.forum.attribute(`fof-gamification.topimage${i}Url`)}
                                                />
                                            ) : (
                                                <td className={'rankings-mobile rankings-' + i}>{icon('fas fa-trophy')}</td>
                                            )
                                        ) : (
                                            <td className="rankings-4 rankings-mobile">{this.addOrdinalSuffix(i)}</td>
                                        )}
                                        <td>
                                            <div className="PostUser">
                                                <h3 className="rankings-info">
                                                    <Link href={app.route.user(user)}>
                                                        {i < 4 ? avatar(user, { className: 'info-avatar rankings-' + i + '-avatar' }) : ''}{' '}
                                                        {username(user)}
                                                    </Link>
                                                </h3>
                                            </div>
                                        </td>
                                        {i < 4 ? (
                                            <td className={'rankings-' + i}>{user.points()}</td>
                                        ) : (
                                            <td className="rankings-4">{user.points()}</td>
                                        )}
                                    </tr>,
                                ];
                            })}
                        </table>
                        <div className="rankings-loadmore"> {loading}</div>
                    </div>
                </div>
            </div>
        );
    }

    refresh(clear = true) {
        if (clear) {
            this.loading = true;
            this.users = [];
        }

        return this.loadResults().then(
            (results) => {
                this.users = [];
                this.parseResults(results);
            },
            () => {
                this.loading = false;
                m.redraw();
            }
        );
    }

    addOrdinalSuffix(i) {
        if (app.data.locale === 'en') {
            const j = i % 10;
            const k = i % 100;

            if (j === 1 && k !== 11) {
                return i + 'st';
            } else if (j === 2 && k !== 12) {
                return i + 'nd';
            } else if (j === 3 && k !== 13) {
                return i + 'rd';
            }
            return i + 'th';
        } else {
            return i;
        }
    }

    loadResults(offset) {
        const params = {};
        params.page = {
            offset: offset,
            limit: '10',
        };

        return app.store.find('rankings', params);
    }

    loadMore() {
        this.loading = true;

        this.loadResults(this.users.length).then(this.parseResults.bind(this));
    }

    parseResults(results) {
        [].push.apply(this.users, results);

        this.loading = false;

        this.users.sort(function (a, b) {
            return parseFloat(b.points()) - parseFloat(a.points());
        });

        m.redraw();

        return results;
    }
}
