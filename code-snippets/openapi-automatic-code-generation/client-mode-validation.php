<?php

declare(strict_types=1);

use LTS\StrictOpenApiValidator\Spec;
use LTS\StrictOpenApiValidator\Validator;
use LTS\StrictOpenApiValidator\ValidationMode;

// Load the provider's spec in Client mode
$spec = Spec::createFromFile(
    '/path/to/payments-api.yaml',
    ValidationMode::Client
);

// Validate your request before sending - strict, catches your errors
Validator::validateRequest($requestJson, $spec, '/v1/charges', 'POST');

// Validate the response - warnings only, so external inconsistencies
// are logged but do not break your application
Validator::validateResponse($responseJson, $spec, '/v1/charges', 'POST', 201);
