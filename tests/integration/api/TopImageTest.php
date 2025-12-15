<?php

/*
 * This file is part of fof/gamification.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Gamification\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class TopImageTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-gamification');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
            ],
        ]);
    }

    public static function topImagesProvider()
    {
        return [
            [1],
            [2],
            [3],
        ];
    }

    #[Test]
    #[DataProvider('topImagesProvider')]
    public function normal_user_cannot_upload_top_image(int $imageNo)
    {
        $response = $this->send(
            $this->request(
                'POST',
                "/api/fof/gamification/topimage{$imageNo}",
                [
                    'authenticatedAs' => 2,
                ]
            )
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    #[Test]
    #[DataProvider('topImagesProvider')]
    public function admin_can_upload_top_image(int $imageNo)
    {
        $response = $this->send(
            $this->request(
                'POST',
                "/api/fof/gamification/topimage{$imageNo}",
                [
                    'authenticatedAs' => 1,
                    'multipart'       => [
                        $this->uploadFile($this->fixtures('topimage.png')),
                    ],
                ]
            )
        );

        $this->assertEquals(200, $response->getStatusCode());

        // TODO: expand this test to check the actual image exists on disk, settings value to set correctly, etc.
    }
}
