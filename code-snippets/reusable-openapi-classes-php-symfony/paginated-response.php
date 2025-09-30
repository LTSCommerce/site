<?php

declare(strict_types=1);

namespace App\OpenApi\Response;

use Attribute;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;

#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
final class PaginatedSuccessResponse extends OA\Response
{
    public function __construct(
        string $itemClass,
        string $description = 'Paginated collection retrieved successfully'
    ) {
        parent::__construct(
            response: 200,
            description: $description,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(
                        property: 'items',
                        type: 'array',
                        items: new OA\Items(ref: new Model(type: $itemClass))
                    ),
                    new OA\Property(property: 'total', type: 'integer', example: 150),
                    new OA\Property(property: 'page', type: 'integer', example: 1),
                    new OA\Property(property: 'limit', type: 'integer', example: 25),
                    new OA\Property(property: 'pages', type: 'integer', example: 6)
                ]
            )
        );
    }
}