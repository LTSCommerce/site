<?php

declare(strict_types=1);

namespace App\OpenApi\Security;

use Attribute;
use OpenApi\Attributes as OA;

#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
final class BearerAuth extends OA\SecurityScheme
{
    public function __construct()
    {
        parent::__construct(
            securityScheme: 'bearerAuth',
            type: 'http',
            name: 'Authorization',
            in: 'header',
            bearerFormat: 'JWT',
            scheme: 'bearer'
        );
    }
}