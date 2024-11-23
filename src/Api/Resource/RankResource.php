<?php

namespace FoF\Gamification\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Gamification\Rank;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<Rank>
 */
class RankResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'ranks';
    }

    public function model(): string
    {
        return Rank::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        // $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Create::make()
                ->admin(),
            Endpoint\Update::make()
                ->admin(),
            Endpoint\Delete::make()
                ->admin(),
            Endpoint\Index::make(),
        ];
    }

    public function fields(): array
    {
        return [

            Schema\Number::make('points')
                ->requiredOnCreate(),
            Schema\Str::make('name')
                ->requiredOnCreate(),
            Schema\Str::make('color')
                ->requiredOnCreate(),

        ];
    }

    public function sorts(): array
    {
        return [
            // SortColumn::make('createdAt'),
        ];
    }
}
