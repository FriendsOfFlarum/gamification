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

use Carbon\Carbon;
use Flarum\Discussion\Discussion;
use Flarum\Post\Post;
use Flarum\Tags\Tag;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\User\User;
use FoF\Gamification\EnabledTags;
use FoF\Gamification\Tests\EnhancedTestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Gamification narrows the discussion index's `firstPost` eager load to the
 * tags voting is enabled on, so that pages carrying none skip the dependent
 * vote query entirely.
 *
 * That constraint is applied through `Endpoint::eagerLoadWhere()`, which feeds
 * `loadMissing()` — and a relation loaded with no match is still *marked*
 * loaded. On a discussion outside the enabled tags the relation is therefore
 * present-and-null, so a client that explicitly asked for `include=firstPost`
 * is silently handed nothing: no relationship linkage, no included post.
 *
 * A performance constraint must not decide what the API returns. Flarum's own
 * admin announcements widget reads `firstPost.contentHtml` from exactly this
 * include to build its excerpts, and rendered every card blank because of it.
 */
class FirstPostIncludeTest extends EnhancedTestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-tags', 'fof-gamification');

        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
            ],
            Tag::class => [
                ['id' => 1, 'name' => 'Gamified', 'slug' => 'gamified', 'position' => 0, 'is_restricted' => 0],
                ['id' => 2, 'name' => 'Plain', 'slug' => 'plain', 'position' => 1, 'is_restricted' => 0],
            ],
            'discussion_tag' => [
                ['discussion_id' => 1, 'tag_id' => 1],
                ['discussion_id' => 2, 'tag_id' => 2],
            ],
            Discussion::class => [
                ['id' => 1, 'title' => 'In a gamified tag', 'created_at' => Carbon::now()->toDateTimeString(), 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 1, 'is_private' => 0],
                ['id' => 2, 'title' => 'In a plain tag', 'created_at' => Carbon::now()->toDateTimeString(), 'user_id' => 2, 'first_post_id' => 2, 'comment_count' => 1, 'is_private' => 0],
            ],
            Post::class => [
                ['id' => 1, 'discussion_id' => 1, 'number' => 1, 'created_at' => Carbon::now()->toDateTimeString(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>gamified content</p></t>'],
                ['id' => 2, 'discussion_id' => 2, 'number' => 1, 'created_at' => Carbon::now()->toDateTimeString(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>plain content</p></t>'],
            ],
        ]);

        // Voting on tag 1 only, so discussion 2 sits outside the gate. Without
        // this the gate is unconfigured and stands down entirely, which is why
        // the existing suite never met this.
        $this->setting(EnabledTags::SETTING, json_encode([1]));
    }

    /**
     * @return array{0: array<string, mixed>, 1: array<string, mixed>} data keyed by id, included posts keyed by id
     */
    private function listWithFirstPost(): array
    {
        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 2])
                ->withQueryParams(['include' => 'firstPost'])
        );

        $body = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals(200, $response->getStatusCode(), json_encode($body));

        $data = [];
        foreach ($body['data'] ?? [] as $row) {
            $data[$row['id']] = $row;
        }

        $posts = [];
        foreach ($body['included'] ?? [] as $row) {
            if ($row['type'] === 'posts') {
                $posts[$row['id']] = $row;
            }
        }

        return [$data, $posts];
    }

    #[Test]
    public function a_discussion_in_an_enabled_tag_includes_its_first_post()
    {
        [$data, $posts] = $this->listWithFirstPost();

        $this->assertSame('1', $data['1']['relationships']['firstPost']['data']['id'] ?? null);
        $this->assertArrayHasKey('1', $posts);
    }

    /**
     * The reported failure. Voting does not apply here, but the client asked
     * for the post and is entitled to it.
     */
    #[Test]
    public function a_discussion_outside_the_enabled_tags_still_includes_its_first_post()
    {
        [$data, $posts] = $this->listWithFirstPost();

        $this->assertSame(
            '2',
            $data['2']['relationships']['firstPost']['data']['id'] ?? null,
            'A discussion outside the gamified tags lost its firstPost linkage.'
        );

        $this->assertArrayHasKey(
            '2',
            $posts,
            'The first post of a discussion outside the gamified tags was not serialized, despite being explicitly included.'
        );
    }

    /**
     * The excerpt the announcements widget reads. Content, not just linkage —
     * an included resource with no attributes would satisfy the assertions
     * above while still being useless to the caller.
     */
    #[Test]
    public function the_included_first_post_carries_its_content()
    {
        [, $posts] = $this->listWithFirstPost();

        $this->assertStringContainsString('plain content', $posts['2']['attributes']['contentHtml'] ?? '');
    }
}
