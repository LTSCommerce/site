<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\UserDto;
use App\OpenApi\Parameter\IdParameter;
use App\OpenApi\Parameter\LimitParameter;
use App\OpenApi\Parameter\PageParameter;
use App\OpenApi\Response\BadRequestResponse;
use App\OpenApi\Response\NotFoundResponse;
use App\OpenApi\Response\SuccessResponse;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class UserController
{
    #[OA\Get(
        path: '/api/users/{id}',
        summary: 'Get user by ID',
        tags: ['Users'],
        parameters: [
            new IdParameter()
        ],
        responses: [
            new SuccessResponse(UserDto::class),
            new NotFoundResponse('User'),
            new BadRequestResponse()
        ]
    )]
    #[Route('/api/users/{id}', methods: ['GET'])]
    public function getUser(int $id): JsonResponse
    {
        // Implementation
    }

    #[OA\Get(
        path: '/api/users',
        summary: 'List users',
        tags: ['Users'],
        parameters: [
            new PageParameter(),
            new LimitParameter()
        ],
        responses: [
            new SuccessResponse(UserDto::class, 'List of users'),
            new BadRequestResponse()
        ]
    )]
    #[Route('/api/users', methods: ['GET'])]
    public function listUsers(): JsonResponse
    {
        // Implementation
    }
}