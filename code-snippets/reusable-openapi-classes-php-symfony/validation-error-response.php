<?php

declare(strict_types=1);

namespace App\OpenApi\Response;

use App\Dto\ValidationErrorDto;
use Attribute;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reusable 422 Unprocessable Entity response for validation errors.
 *
 * Used when the request syntax is correct but the data fails business
 * validation rules. Links to a ValidationErrorDto that provides detailed
 * field-level error messages.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final class ValidationErrorResponse extends OA\Response
{
    public function __construct()
    {
        parent::__construct(
            response: Response::HTTP_UNPROCESSABLE_ENTITY,
            description: 'Validation errors in request data',
            content: new Model(type: ValidationErrorDto::class)
        );
    }
}