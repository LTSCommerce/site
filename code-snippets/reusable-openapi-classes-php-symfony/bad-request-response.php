<?php

declare(strict_types=1);

namespace App\OpenApi\Response;

use App\Dto\ErrorDto;
use Attribute;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reusable 400 Bad Request response attribute.
 *
 * Standardizes error responses across the API by linking to a consistent
 * ErrorDto model and providing a clear, customizable description.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final class BadRequestResponse extends OA\Response
{
    public function __construct(?string $description = null)
    {
        parent::__construct(
            response: Response::HTTP_BAD_REQUEST,
            description: $description ?? 'Invalid request parameters or format',
            content: new Model(type: ErrorDto::class)
        );
    }
}