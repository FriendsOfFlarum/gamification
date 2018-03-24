import {extend} from "flarum/extend";
import AdminNav from "flarum/components/AdminNav";
import AdminLinkButton from "flarum/components/AdminLinkButton";
import SettingsPage from "Reflar/Gamification/components/SettingsPage";

export default function () {
    app.routes['Reflar-Gamification'] = {path: '/reflar/gamification', component: SettingsPage.component()};

    app.extensionSettings['Reflar-Gamification'] = () => m.route(app.route('Reflar-Gamification'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('Reflar-Gamification', AdminLinkButton.component({
            href: app.route('Reflar-Gamification'),
            icon: 'thumbs-up',
            children: 'Gamification',
            description: app.translator.trans('reflar-gamification.admin.nav.desc')
        }));
    });
}
