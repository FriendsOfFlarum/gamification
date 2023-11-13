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

use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\Post\Post;
use FoF\Gamification\Vote;
use Symfony\Contracts\Translation\TranslatorInterface;

class VoteBlueprint implements BlueprintInterface, MailableInterface
{
    /**
     * @var Vote
     */
    public $vote;

    /**
     * VoteBlueprint constructor.
     *
     * @param Vote $vote
     */
    public function __construct(Vote $vote)
    {
        $this->vote = $vote;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->vote->post;
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser()
    {
        return $this->vote->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return $this->vote->value;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'vote';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return Post::class;
    }

    /**
     * Get the name of the view to construct a notification email with.
     *
     * @return array<string, string>
     */
    public function getEmailView()
    {
        return ['text' => 'fof-gamification::emails.postVoted'];
    }

    /**
     * Get the subject line for the notification email.
     *
     * @return string
     */
    public function getEmailSubject(TranslatorInterface $translator)
    {
        return $translator->trans('fof-gamification.email.subject.postVoted', [
            '{display_name}'     => $this->vote->user->display_name,
            '{discussion_title}' => $this->vote->post->discussion->title,
        ]);
    }
}
