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
use Flarum\Api\JsonApi;
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
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class UploadTopImageController extends ShowForumController
{
    /**
     * @var Cloud
     */
    protected $uploadDir;

    public function __construct(
        JsonApi $api,
        protected SettingsRepositoryInterface $settings,
        protected Paths $paths,
        protected ImageManager $imageManager,
        FilesystemFactory $factory
    ) {
        parent::__construct($api);

        $this->uploadDir = $factory->disk('flarum-assets');
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
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

        $tmpFile = @tempnam($this->paths->storage . '/tmp', 'topimage.' . $id);
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

        $image = $this->imageManager->read($tmpFile);

        if (extension_loaded('exif')) {
            $image->orient();
        }

        $encodedImage = $image->resize($size, $size)->toPng();

        $key = "fof-gamification.topimage{$id}_path";
        $uploadName = 'topimage-' . Str::lower(Str::random(8)) . '.png';

        $this->uploadDir->put($uploadName, $encodedImage);

        $this->settings->set($key, $uploadName);

        unlink($tmpFile);

        return parent::handle(
            // The parent controller expects a show forum request.
            // `GET /api/forum`
            $request->withMethod('GET')->withUri($request->getUri()->withPath('/api/forum'))
        );
    }
}
