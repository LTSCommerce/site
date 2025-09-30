<?php

declare(strict_types=1);

namespace App\Dto;

use OpenApi\Attributes as OA;

/**
 * Standard error response structure used across all API endpoints.
 *
 * Provides consistent error information to API consumers, making it
 * easier to handle errors in client applications.
 */
#[OA\Schema(
    schema: 'Error',
    description: 'Standard error response',
    required: ['error', 'message'],
    type: 'object'
)]
class ErrorDto
{
    public function __construct(
        #[OA\Property(description: 'Error code or type', example: 'VALIDATION_ERROR')]
        public readonly string $error,

        #[OA\Property(description: 'Human-readable error message', example: 'Invalid email format')]
        public readonly string $message,

        #[OA\Property(description: 'Additional error details', type: 'object', nullable: true)]
        public readonly ?array $details = null,
    ) {
    }
}