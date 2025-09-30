<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\CreateUserDto;
use App\Dto\UserDto;
use App\OpenApi\JsonRequestBody;
use App\OpenApi\Parameter\IdParameter;
use App\OpenApi\Parameter\LimitParameter;
use App\OpenApi\Parameter\PageParameter;
use App\OpenApi\Response\BadRequestResponse;
use App\OpenApi\Response\NotFoundResponse;
use App\OpenApi\Response\SuccessResponse;
use App\OpenApi\Response\ValidationErrorResponse;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[OA\Tag(name: 'Users', description: 'User management endpoints')]
final class UserController
{
    // Route constants eliminate duplicated magic strings
    private const string ROUTE_USERS = '/api/users';
    private const string ROUTE_USER_ID = '/api/users/{id}';

    #[OA\Post(
        path: self::ROUTE_USERS,
        summary: 'Create a new user',
        tags: ['Users'],
        requestBody: new JsonRequestBody(CreateUserDto::class, 'User creation data'),
        responses: [
            new SuccessResponse(UserDto::class, 'User created successfully'),
            new BadRequestResponse(),
            new ValidationErrorResponse()
        ]
    )]
    #[Route(self::ROUTE_USERS, methods: ['POST'])]
    public function createUser(): JsonResponse
    {
        // Implementation: validate input, create user, return response
        return new JsonResponse(['id' => 1, 'email' => 'user@example.com'], Response::HTTP_CREATED);
    }

    #[OA\Get(
        path: self::ROUTE_USER_ID,
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
    #[Route(self::ROUTE_USER_ID, methods: ['GET'])]
    public function getUser(int $id): JsonResponse
    {
        // Implementation: fetch user by ID
        return new JsonResponse(['id' => $id, 'email' => 'user@example.com']);
    }

    #[OA\Get(
        path: self::ROUTE_USERS,
        summary: 'List all users',
        tags: ['Users'],
        parameters: [
            new PageParameter(),
            new LimitParameter(default: 25, maximum: 100)
        ],
        responses: [
            new SuccessResponse(UserDto::class, 'Paginated list of users'),
            new BadRequestResponse()
        ]
    )]
    #[Route(self::ROUTE_USERS, methods: ['GET'])]
    public function listUsers(): JsonResponse
    {
        // Implementation: fetch paginated users
        return new JsonResponse(['users' => [], 'total' => 0, 'page' => 1]);
    }

    #[OA\Put(
        path: self::ROUTE_USER_ID,
        summary: 'Update user',
        tags: ['Users'],
        parameters: [
            new IdParameter()
        ],
        requestBody: new JsonRequestBody(CreateUserDto::class, 'Updated user data'),
        responses: [
            new SuccessResponse(UserDto::class, 'User updated successfully'),
            new NotFoundResponse('User'),
            new ValidationErrorResponse(),
            new BadRequestResponse()
        ]
    )]
    #[Route(self::ROUTE_USER_ID, methods: ['PUT'])]
    public function updateUser(int $id): JsonResponse
    {
        // Implementation: validate input, update user
        return new JsonResponse(['id' => $id, 'email' => 'updated@example.com']);
    }

    #[OA\Delete(
        path: self::ROUTE_USER_ID,
        summary: 'Delete user',
        tags: ['Users'],
        parameters: [
            new IdParameter()
        ],
        responses: [
            new OA\Response(response: 204, description: 'User deleted successfully'),
            new NotFoundResponse('User'),
            new BadRequestResponse()
        ]
    )]
    #[Route(self::ROUTE_USER_ID, methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        // Implementation: delete user
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}