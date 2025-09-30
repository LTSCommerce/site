<?php

declare(strict_types=1);

namespace App\OpenApi\Response;

use App\Dto\ErrorDto;
use Attribute;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reusable 404 Not Found response attribute.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
final class NotFoundResponse extends OA\Response
{
    public function __construct(string $resourceType = 'Resource')
    {
        parent::__construct(
            response: Response::HTTP_NOT_FOUND,
            description: "$resourceType not found",
            content: new Model(type: ErrorDto::class)
        );
    }
}