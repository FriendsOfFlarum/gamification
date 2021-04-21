<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Api\Controllers;

use Flarum\Discussion\Discussion;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Gamification\Gamification;
use FoF\Gamification\Likes;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ConvertLikesController implements RequestHandlerInterface
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Gamification
     */
    protected $gamification;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param Gamification                $gamification
     */
    public function __construct(SettingsRepositoryInterface $settings, Gamification $gamification)
    {
        $this->settings = $settings;
        $this->gamification = $gamification;
    }

    /**
     * @param ServerRequestInterface $request
     *
     * @return int
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = $request->getAttribute('actor');

        if (null !== $actor && $actor->isAdmin() && 'POST' === $request->getMethod() && false == $this->settings->get('fof-gamification.convertedLikes')) {
            $likes = Likes::all();

            $this->settings->set('fof-gamification.convertedLikes', 'converting');

            $counter = 0;

            foreach ($likes as $like) {
                $this->gamification->convertLike($like->post_id, $like->user_id);
                $counter++;
            }

            $discussions = Discussion::all();

            foreach ($discussions as $discussion) {
                $this->gamification->calculateHotness($discussion);
            }

            $this->settings->set('fof-gamification.convertedLikes', $counter);

            return new JsonResponse($counter, 200);
        }
    }
}
