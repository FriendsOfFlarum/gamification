import Modal from 'flarum/components/Modal';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';

export default class VotesModal extends Modal {
    className() {
        return 'VotesModal Modal--small';
    }

    title() {
        return app.translator.trans('fof-gamification.forum.modal.title');
    }

    init() {
        this.loading = !this.props.post.upvotes() || !this.props.post.downvotes();

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
                    {['upvotes', 'downvotes'].map((type) => {
                        const voters = this.props.post[type]();

                        if (!voters || !voters.length) return;

                        return (
                            <div>
                                <legend>{app.translator.trans(`fof-gamification.forum.modal.${type}_label`)}</legend>
                                {voters.map((user) => (
                                    <li>
                                        <a href={app.route.user(user)} config={m.route}>
                                            {avatar(user)} {username(user)}
                                        </a>
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
            .find('posts', this.props.post.id(), {
                include: 'upvotes,downvotes',
            })
            .then(this.loaded.bind(this));
    }
}
