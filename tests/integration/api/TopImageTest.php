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
use FoF\Gamification\Tests\EnhancedTestCase;

class TopImageTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-gamification');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
        ]);
    }

    public function topImagesProvider()
    {
        return [
            [1],
            [2],
            [3],
        ];
    }

    /**
     * @dataProvider topImagesProvider
     *
     * @test
     */
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

    /**
     * @dataProvider topImagesProvider
     *
     * @test
     */
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
