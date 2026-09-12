<?php

declare(strict_types=1);

namespace App\OpenApi\Security;

use Attribute;
use OpenApi\Attributes as OA;

/**
 * Declares the "bearerAuth" security scheme, applied once at API level.
 *
 * A SecurityScheme only defines an authentication method - it doesn't apply
 * it to any endpoint. Attach #[BearerAuth] to a single declaration class
 * (below), then reference the scheme by name from individual operations -
 * see security-usage.php.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final class BearerAuth extends OA\SecurityScheme
{
    public function __construct()
    {
        parent::__construct(
            securityScheme: 'bearerAuth',
            type: 'http',
            bearerFormat: 'JWT',
            scheme: 'bearer'
        );
    }
}

#[BearerAuth]
final class OpenApiSecurityDefinitions
{
    // Empty marker class: the #[BearerAuth] attribute above registers the
    // scheme once for the whole API when swagger-php scans this file.
}