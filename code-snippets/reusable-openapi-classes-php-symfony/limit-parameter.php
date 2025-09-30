<?php

declare(strict_types=1);

namespace App\OpenApi\Parameter;

use Attribute;
use OpenApi\Attributes as OA;

/**
 * Reusable pagination limit parameter.
 *
 * Controls the number of items returned per page with sensible defaults
 * and maximum limits to prevent performance issues.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final class LimitParameter extends OA\Parameter
{
    public function __construct(int $default = 20, int $maximum = 100)
    {
        parent::__construct(
            name: 'limit',
            in: 'query',
            required: false,
            schema: new OA\Schema(
                type: 'integer',
                description: 'Maximum number of items to return',
                default: $default,
                minimum: 1,
                maximum: $maximum
            )
        );
    }
}