<?php

declare(strict_types=1);

namespace App\OpenApi\Parameter;

use Attribute;
use OpenApi\Attributes as OA;

/**
 * Reusable ID path parameter for OpenAPI documentation.
 *
 * Standardizes the definition of integer ID parameters across all endpoints,
 * ensuring consistent validation rules and documentation.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final class IdParameter extends OA\Parameter
{
    public function __construct(
        string $name = 'id',
        string $description = 'Resource identifier'
    ) {
        parent::__construct(
            name: $name,
            in: 'path',
            required: true,
            schema: new OA\Schema(
                type: 'integer',
                minimum: 1,
                maximum: PHP_INT_MAX
            ),
            description: $description
        );
    }
}