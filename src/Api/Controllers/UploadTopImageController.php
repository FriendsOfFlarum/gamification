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
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Cloud;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Laminas\Diactoros\UploadedFile;
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

        $id = (int) Arr::get($request->getQueryParams(), 'id', 0);

        /** @var UploadedFile | null */
        $file = Arr::first($request->getUploadedFiles());

        if (!$file) {
            throw new ValidationException(['file' => 'No file was uploaded']);
        }

        if (!$file instanceof UploadedFile) {
            if (is_array($file)) {
                $file = Arr::first($file);
            }
        }

        $tmpFile = @tempnam($this->paths->storage.'/tmp', 'topimage.'.$id);
        $file->moveTo($tmpFile);

        switch ($id) {
            case 1:
                $size = 150;
                break;
            case 2:
                $size = 125;
                break;
            default:
                $size = 100;
                break;
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

        unlink($tmpFile);

        return parent::data($request, $document);
    }
}
