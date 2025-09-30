<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\ProductDto;
use App\OpenApi\Parameter\LimitParameter;
use App\OpenApi\Parameter\PageParameter;
use App\OpenApi\Response\BadRequestResponse;
use App\OpenApi\Response\PaginatedSuccessResponse;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ProductController
{
    #[OA\Get(
        path: '/api/products',
        summary: 'List products with pagination',
        tags: ['Products'],
        parameters: [
            new PageParameter(),
            new LimitParameter(default: 25, maximum: 100)
        ],
        responses: [
            new PaginatedSuccessResponse(ProductDto::class),
            new BadRequestResponse()
        ]
    )]
    #[Route('/api/products', methods: ['GET'])]
    public function listProducts(int $page = 1, int $limit = 25): JsonResponse
    {
        // Implementation returns paginated collection
        return new JsonResponse([
            'items' => [],
            'total' => 150,
            'page' => $page,
            'limit' => $limit,
            'pages' => 6
        ]);
    }
}