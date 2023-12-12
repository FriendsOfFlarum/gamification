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

use Flarum\Api\Controller\ShowForumController;
use Flarum\Foundation\Paths;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadTopImageController extends ShowForumController
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var Paths
     */
    protected $paths;

    /**
     * @var ImageManager
     */
    protected $imageManager;

    /**
     * @var Cloud
     */
    protected $uploadDir;

    public function __construct(SettingsRepositoryInterface $settings, Paths $paths, ImageManager $imageManager, FilesystemFactory $factory)
    {
        $this->settings = $settings;
        $this->paths = $paths;
        $this->imageManager = $imageManager;
        $this->uploadDir = $factory->disk('flarum-assets');
    }

    public function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');

        $file = Arr::first($request->getUploadedFiles());

        $tmpFile = tempnam($this->paths->storage.'/tmp', 'topimage.'.$id);
        $file->moveTo($tmpFile);

        if ('1' == $id) {
            $size = 200;
        } elseif ('2' == $id) {
            $size = 150;
        } else {
            $size = 100;
        }

        $image = $this->imageManager->make($tmpFile);

        if (extension_loaded('exif')) {
            $image->orientate();
        }

        $encodedImage = $image->fit($size, $size)->encode('png');

        $key = "fof-gamification.topimage{$id}_path";
        $uploadName = 'topimage-'.Str::lower(Str::random(8)).'.png';

        $this->uploadDir->put($uploadName, $encodedImage);

        $this->settings->set($key, $uploadName);

        return parent::data($request, $document);
    }
}
