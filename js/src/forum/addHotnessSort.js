import { extend } from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import ItemList from 'flarum/utils/ItemList';
import DiscussionList from 'flarum/components/DiscussionList';
import Dropdown from 'flarum/components/Dropdown';
import Button from 'flarum/components/Button';
import LinkButton from 'flarum/components/LinkButton';

export default function () {
    IndexPage.prototype.viewItems = function () {
        const items = new ItemList();
        const sortMap = app.cache.discussionList.sortMap();

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
                            onclick: this.changeSort.bind(this, value),
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
        items.add(
            'rankings',
            LinkButton.component(
                {
                    href: app.route('rankings'),
                    icon: 'fas fa-trophy',
                },
                app.translator.trans('fof-gamification.forum.nav.name'),
            ),
            80
        );
    });

    IndexPage.prototype.changeSort = function (sort) {
        const params = app.search.params();

        if (sort === 'hot') {
            m.route.set('/');
            m.route.set(m.route.get() + 'hot');
        } else {
            if (sort === Object.keys(app.cache.discussionList.sortMap())[0]) {
                delete params.sort;
            } else {
                params.sort = sort;
            }
            if (params.filter === 'hot') {
                delete params.filter;
            }
            m.route.set(app.route('index', params));
        }
    };

    extend(DiscussionList.prototype, 'sortMap', function (map) {
        map.hot = 'hot';
    });

    extend(DiscussionList.prototype, 'requestParams', function (params) {
        if (this.attrs.params.filter === 'hot') {
            params.filter.q = ' is:hot';
        }
    });
}
