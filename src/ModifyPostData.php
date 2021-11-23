<?php

namespace FoF\Gamification;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;

class ModifyPostData
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }
    
    public function __invoke(PostSerializer $serializer, Post $post, array $attributes): array
    {
        if ((bool) $this->settings->get('fof-gamification.firstPostOnly', false) && $post->number !== 1) {
            $attributes['canVote'] = false;
            $attributes['canSeeVotes'] = false;
            $attributes['seeVoters'] = false;
            Arr::pull($attributes, 'votes');
            Arr::pull($attributes, 'hasUpvoted');
            Arr::pull($attributes, 'hasDownvoted');
        }

        return $attributes;
    }
}
