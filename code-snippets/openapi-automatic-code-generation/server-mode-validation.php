<?php

declare(strict_types=1);

use LTS\StrictOpenApiValidator\Spec;
use LTS\StrictOpenApiValidator\Validator;
use LTS\StrictOpenApiValidator\ValidationMode;

// Load your own spec in Server mode - maximum strictness on your responses
$spec = Spec::createFromFile(
    '/path/to/your-api-spec.yaml',
    ValidationMode::Server
);

// In your middleware or test suite:

// Validate incoming requests - provides public-safe error messages
// so clients get helpful feedback without leaking internal details
Validator::validateRequest($requestJson, $spec, '/v1/products', 'POST');

// Validate your own responses strictly - if this fails, your API
// is not honouring its contract and you need to fix it
Validator::validateResponse($responseJson, $spec, '/v1/products', 'POST', 201);
