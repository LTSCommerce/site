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
class UserController
{
    #[Route('/api/users', methods: ['POST'])]
    #[OA\Post(path: '/api/users', summary: 'Create a new user', tags: ['Users'])]
    #[JsonRequestBody(CreateUserDto::class, 'User creation data')]
    #[SuccessResponse(UserDto::class, 'User created successfully')]
    #[BadRequestResponse]
    #[ValidationErrorResponse]
    public function createUser(): JsonResponse
    {
        // Implementation: validate input, create user, return response
        return new JsonResponse(['id' => 1, 'email' => 'user@example.com'], Response::HTTP_CREATED);
    }

    #[Route('/api/users/{id}', methods: ['GET'])]
    #[OA\Get(path: '/api/users/{id}', summary: 'Get user by ID', tags: ['Users'])]
    #[IdParameter]
    #[SuccessResponse(UserDto::class)]
    #[BadRequestResponse]
    #[NotFoundResponse('User')]
    public function getUser(int $id): JsonResponse
    {
        // Implementation: fetch user by ID
        return new JsonResponse(['id' => $id, 'email' => 'user@example.com']);
    }

    #[Route('/api/users', methods: ['GET'])]
    #[OA\Get(path: '/api/users', summary: 'List all users', tags: ['Users'])]
    #[PageParameter]
    #[LimitParameter(default: 25, maximum: 100)]
    #[SuccessResponse(UserDto::class, 'Paginated list of users')]
    #[BadRequestResponse]
    public function listUsers(): JsonResponse
    {
        // Implementation: fetch paginated users
        return new JsonResponse(['users' => [], 'total' => 0, 'page' => 1]);
    }

    #[Route('/api/users/{id}', methods: ['PUT'])]
    #[OA\Put(path: '/api/users/{id}', summary: 'Update user', tags: ['Users'])]
    #[IdParameter]
    #[JsonRequestBody(CreateUserDto::class, 'Updated user data')]
    #[SuccessResponse(UserDto::class, 'User updated successfully')]
    #[BadRequestResponse]
    #[NotFoundResponse('User')]
    #[ValidationErrorResponse]
    public function updateUser(int $id): JsonResponse
    {
        // Implementation: validate input, update user
        return new JsonResponse(['id' => $id, 'email' => 'updated@example.com']);
    }

    #[Route('/api/users/{id}', methods: ['DELETE'])]
    #[OA\Delete(path: '/api/users/{id}', summary: 'Delete user', tags: ['Users'])]
    #[IdParameter]
    #[OA\Response(response: 204, description: 'User deleted successfully')]
    #[BadRequestResponse]
    #[NotFoundResponse('User')]
    public function deleteUser(int $id): JsonResponse
    {
        // Implementation: delete user
        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}