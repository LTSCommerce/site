<?php

declare(strict_types=1);

namespace App\OpenApi;

use Attribute;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;

/**
 * Reusable request body attribute for OpenAPI documentation.
 *
 * Simplifies the definition of JSON request bodies by automatically
 * setting up the content type and marking the body as required.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
final class JsonRequestBody extends OA\RequestBody
{
    public function __construct(
        string $modelClass,
        string $description = 'Request payload',
        bool $required = true
    ) {
        parent::__construct(
            required: $required,
            description: $description,
            content: new Model(type: $modelClass)
        );
    }
}