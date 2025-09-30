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

class UserController
{
    #[Route('/api/users/{id}', methods: ['GET'])]
    #[OA\Get(path: '/api/users/{id}', summary: 'Get user by ID', tags: ['Users'])]
    #[IdParameter]
    #[SuccessResponse(UserDto::class)]
    #[BadRequestResponse]
    #[NotFoundResponse('User')]
    public function getUser(int $id): JsonResponse
    {
        // Implementation
    }

    #[Route('/api/users', methods: ['GET'])]
    #[OA\Get(path: '/api/users', summary: 'List users', tags: ['Users'])]
    #[PageParameter]
    #[LimitParameter]
    #[SuccessResponse(UserDto::class, 'List of users')]
    #[BadRequestResponse]
    public function listUsers(): JsonResponse
    {
        // Implementation
    }
}