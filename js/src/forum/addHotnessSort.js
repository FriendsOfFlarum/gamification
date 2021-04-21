import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import ItemList from 'flarum/common/utils/ItemList';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import Dropdown from 'flarum/common/components/Dropdown';
import Button from 'flarum/common/components/Button';
import LinkButton from 'flarum/common/components/LinkButton';

export default function () {
    IndexPage.prototype.viewItems = function () {
        const items = new ItemList();
        const sortMap = app.discussions.sortMap();

        const sortOptions = {};
        for (const i in sortMap) {
            sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button');
        }

        let dropDownLabel = sortOptions[app.search.params().sort] || Object.keys(sortMap).map((key) => sortOptions[key])[0];

        if (/^.*?\/hot/.test(m.route.get())) {
            dropDownLabel = app.translator.trans('core.forum.index_sort.hot_button');
        }

        items.add(
            'sort',
            Dropdown.component(
                {
                    buttonClassName: 'Button',
                    label: dropDownLabel,
                },
                Object.keys(sortOptions).map((value) => {
                    const label = sortOptions[value];
                    let active = (app.search.params().sort || Object.keys(sortMap)[0]) === value;

                    if (/^.*?\/hot/.test(m.route.get()) && value === 'hot') {
                        active = true;
                    }

                    if (/^.*?\/hot/.test(m.route.get()) && value === 'latest') {
                        active = false;
                        m.redraw();
                    }

                    return Button.component(
                        {
                            icon: active ? 'fas fa-check' : true,
                            onclick: app.search.changeSort.bind(app.search, value),
                            active: active,
                        },
                        label
                    );
                })
            )
        );

        return items;
    };

    extend(IndexPage.prototype, 'navItems', function (items) {
        if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
            return;
        }
        items.add(
            'rankings',
            LinkButton.component(
                {
                    href: app.route('rankings'),
                    icon: 'fas fa-trophy',
                },
                app.translator.trans('fof-gamification.forum.nav.name')
            ),
            80
        );
    });

    extend(DiscussionListState.prototype, 'sortMap', function (map) {
        map.hot = '-hotness';
    });
}
