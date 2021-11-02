<?php

namespace FoF\Gamification\Access;

use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class PostPolicy extends AbstractPolicy
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    private function singleTagMode(): bool
    {
        return (bool) $this->settings->get('fof-gamification.single-tag-mode', false);
    }
    
    public function vote(User $actor, Post $post)
    {
        if ($this->singleTagMode()) {
            $discussion = $post->discussion();
            //dd($discussion);
        }
    }
}
