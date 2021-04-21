import Modal from 'flarum/common/components/Modal';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Link from 'flarum/common/components/Link';

export default class VotesModal extends Modal {
    className() {
        return 'VotesModal Modal--small';
    }

    title() {
        return app.translator.trans('fof-gamification.forum.modal.title');
    }

    oninit(vnode) {
        super.oninit(vnode);

        this.loading = !this.attrs.post.upvotes();

        if (this.loading) {
            this.load();
        }
    }

    content() {
        if (this.loading) {
            return (
                <div className="Modal-body">
                    <LoadingIndicator />
                </div>
            );
        }

        return (
            <div className="Modal-body">
                <ul className="VotesModal-list">
                    {['upvotes'].map((type) => {
                        const voters = this.attrs.post[type]();

                        if (!voters || !voters.length) return;

                        return (
                            <div>
                                <legend>{app.translator.trans(`fof-gamification.forum.modal.${type}_label`)}</legend>
                                {voters.map((user) => (
                                    <li>
                                        <Link href={app.route.user(user)}>
                                            {avatar(user)} {username(user)}
                                        </Link>
                                    </li>
                                ))}
                            </div>
                        );
                    })}
                </ul>
            </div>
        );
    }

    load() {
        return app.store
            .find('posts', this.attrs.post.id(), {
                include: 'upvotes',
            })
            .then(this.loaded.bind(this));
    }
}
