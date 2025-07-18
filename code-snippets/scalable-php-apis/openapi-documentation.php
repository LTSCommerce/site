<?php

declare(strict_types=1);

class OpenAPIGenerator
{
    private array $paths = [];

    private array $components = [];

    public function addEndpoint(string $path, string $method, array $definition): void
    {
        $this->paths[$path][$method] = $definition;
    }

    public function addComponent(string $name, array $schema): void
    {
        $this->components['schemas'][$name] = $schema;
    }

    public function generate(): array
    {
        return [
            'openapi' => '3.0.0',
            'info'    => [
                'title'       => 'API Documentation',
                'version'     => '1.0.0',
                'description' => 'Scalable PHP API',
            ],
            'servers' => [
                ['url' => 'https://api.example.com/v1'],
            ],
            'paths'      => $this->paths,
            'components' => $this->components,
        ];
    }

    public function generateFromAnnotations(): array
    {
        $reflection = new ReflectionClass(UserController::class);
        $methods    = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);

        foreach ($methods as $method) {
            $docComment = $method->getDocComment();
            if ($docComment) {
                $this->parseDocComment($docComment, $method);
            }
        }

        return $this->generate();
    }

    private function parseDocComment(string $docComment, ReflectionMethod $method): void
    {
        // Parse PHPDoc annotations for OpenAPI spec
        if (preg_match('/@Route\("([^"]+)".*method="([^"]+)"\)/', $docComment, $matches)) {
            $path       = $matches[1];
            $httpMethod = strtolower($matches[2]);

            // Extract other annotations
            $summary     = $this->extractAnnotation($docComment, 'summary');
            $description = $this->extractAnnotation($docComment, 'description');

            $this->addEndpoint($path, $httpMethod, [
                'summary'     => $summary,
                'description' => $description,
                'operationId' => $method->getName(),
            ]);
        }
    }

    private function extractAnnotation(string $docComment, string $annotation): ?string
    {
        if (preg_match("/@{$annotation}\s+(.+)/", $docComment, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }
}
