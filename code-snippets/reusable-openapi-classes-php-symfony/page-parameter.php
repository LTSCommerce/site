<?php

declare(strict_types=1);

namespace App\OpenApi\Parameter;

use Attribute;
use OpenApi\Attributes as OA;

/**
 * Reusable pagination page number parameter.
 *
 * Provides consistent pagination behavior across all paginated endpoints
 * with configurable defaults and validation rules.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final class PageParameter extends OA\Parameter
{
    public function __construct(int $default = 1)
    {
        parent::__construct(
            name: 'page',
            in: 'query',
            required: false,
            schema: new OA\Schema(
                type: 'integer',
                description: 'Page number for pagination (1-indexed)',
                default: $default,
                minimum: 1,
                maximum: PHP_INT_MAX
            )
        );
    }
}