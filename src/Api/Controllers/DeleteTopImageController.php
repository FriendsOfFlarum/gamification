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

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;

class DeleteTopImageController extends AbstractDeleteController
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Cloud
     */
    protected $uploadDir;

    public function __construct(SettingsRepositoryInterface $settings, Factory $factory)
    {
        $this->settings = $settings;
        $this->uploadDir = $factory->disk('flarum-assets');
    }

    protected function delete(ServerRequestInterface $request)
    {
        $id = Arr::get($request->getQueryParams(), 'id');

        RequestUtil::getActor($request)->assertAdmin();

        $path = $this->settings->get($key = "fof-gamification.topimage{$id}_path");

        $this->settings->set($key, null);

        if ($this->uploadDir->exists($path)) {
            $this->uploadDir->delete($path);
        }

        return new EmptyResponse(204);
    }
}
