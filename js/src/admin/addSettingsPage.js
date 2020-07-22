import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import SettingsPage from './components/SettingsPage';

export default function () {
    app.routes['fof-gamification'] = { path: '/fof/gamification', component: SettingsPage.component() };

    app.extensionSettings['fof-gamification'] = () => m.route(app.route('fof-gamification'));

    extend(AdminNav.prototype, 'items', (items) => {
        items.add(
            'fof-gamification',
            AdminLinkButton.component({
                href: app.route('fof-gamification'),
                icon: 'fas fa-thumbs-up',
                children: 'Gamification',
                description: app.translator.trans('fof-gamification.admin.nav.desc'),
            })
        );
    });
}
