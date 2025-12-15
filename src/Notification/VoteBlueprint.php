<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Notification;

use Flarum\Notification\AlertableInterface;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\Post\Post;
use FoF\Gamification\Vote;
use Symfony\Contracts\Translation\TranslatorInterface;

class VoteBlueprint implements BlueprintInterface, MailableInterface, AlertableInterface
{
    public function __construct(
        public Vote $vote
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject(): ?\Flarum\Database\AbstractModel
    {
        return $this->vote->post;
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser(): ?\Flarum\User\User
    {
        return $this->vote->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getData(): mixed
    {
        return $this->vote->value;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType(): string
    {
        return 'vote';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel(): string
    {
        return Post::class;
    }

    /**
     * Get the name of the view to construct a notification email with.
     *
     * @return array<string, string>
     */
        public function getEmailViews(): array
    {
        return ['text' => 'fof-gamification::email.plain.postVoted', 'html' => 'fof-gamification::email.html.postVoted'];
    }

    /**
     * Get the subject line for the notification email.
     *
     * @return string
     */
    public function getEmailSubject(\Flarum\Locale\TranslatorInterface $translator): string
    {
        return $translator->trans('fof-gamification.email.subject.postVoted', [
            '{display_name}'     => $this->vote->user->display_name,
            '{discussion_title}' => $this->vote->post->discussion->title,
        ]);
    }
}
