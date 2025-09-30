<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\UserDto;
use App\Dto\ErrorDto;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class UserController
{
    #[Route('/api/users/{id}', methods: ['GET'])]
    #[OA\Get(
        path: '/api/users/{id}',
        summary: 'Get user by ID',
        tags: ['Users']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(
            type: 'integer',
            minimum: 1,
            maximum: PHP_INT_MAX
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Successful operation',
        content: new Model(type: UserDto::class)
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid request',
        content: new Model(type: ErrorDto::class)
    )]
    #[OA\Response(
        response: 404,
        description: 'User not found',
        content: new Model(type: ErrorDto::class)
    )]
    public function getUser(int $id): JsonResponse
    {
        // Implementation
    }

    #[Route('/api/users', methods: ['GET'])]
    #[OA\Get(
        path: '/api/users',
        summary: 'List users',
        tags: ['Users']
    )]
    #[OA\Parameter(
        name: 'page',
        in: 'query',
        required: false,
        schema: new OA\Schema(
            type: 'integer',
            minimum: 1,
            maximum: PHP_INT_MAX,
            default: 1
        )
    )]
    #[OA\Parameter(
        name: 'limit',
        in: 'query',
        required: false,
        schema: new OA\Schema(
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Successful operation',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: UserDto::class))
        )
    )]
    #[OA\Response(
        response: 400,
        description: 'Invalid request',
        content: new Model(type: ErrorDto::class)
    )]
    public function listUsers(): JsonResponse
    {
        // Implementation
    }
}