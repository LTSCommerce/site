<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Dto\UserDto;
use App\OpenApi\Response\BadRequestResponse;
use App\OpenApi\Response\SuccessResponse;
use App\OpenApi\Security\BearerAuth;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class ProfileController
{
    #[OA\Get(
        path: '/api/profile',
        summary: 'Get current user profile',
        security: [new BearerAuth()],
        tags: ['Profile'],
        responses: [
            new SuccessResponse(UserDto::class, 'User profile retrieved'),
            new BadRequestResponse(),
            new OA\Response(response: 401, description: 'Unauthorized')
        ]
    )]
    #[Route('/api/profile', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        // Implementation: return authenticated user's profile
        return new JsonResponse(['id' => 1, 'email' => 'user@example.com']);
    }
}