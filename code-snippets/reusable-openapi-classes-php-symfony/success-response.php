<?php

declare(strict_types=1);

namespace App\OpenApi\Response;

use Attribute;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;

/**
 * Reusable 200 success response attribute for OpenAPI documentation.
 *
 * This class eliminates repetitive response definitions across controllers
 * by encapsulating the common success response pattern.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final class SuccessResponse extends OA\Response
{
    public function __construct(string $modelClass, string $description = 'Successful operation')
    {
        parent::__construct(
            response: 200,
            description: $description,
            content: new Model(type: $modelClass)
        );
    }
}