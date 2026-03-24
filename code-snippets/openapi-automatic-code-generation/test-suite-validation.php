<?php

declare(strict_types=1);

use LTS\StrictOpenApiValidator\Spec;
use LTS\StrictOpenApiValidator\Validator;
use LTS\StrictOpenApiValidator\ValidationMode;

final class ProductApiTest extends ApiTestCase
{
    private Spec $spec;

    protected function setUp(): void
    {
        parent::setUp();
        $this->spec = Spec::createFromFile(
            __DIR__ . '/../../api-spec.yaml',
            ValidationMode::Server
        );
    }

    public function testCreateProductMatchesSpec(): void
    {
        $requestBody = json_encode([
            'name' => 'Test Product',
            'price' => 29.99,
            'category' => 'electronics',
        ], JSON_THROW_ON_ERROR);

        // Validate request against spec
        Validator::validateRequest(
            $requestBody, $this->spec, '/v1/products', 'POST'
        );

        $response = $this->postJson('/v1/products', $requestBody);
        $response->assertStatus(201);

        // Validate response against spec - catches any drift
        Validator::validateResponse(
            $response->getContent(),
            $this->spec,
            '/v1/products',
            'POST',
            201
        );
    }
}
