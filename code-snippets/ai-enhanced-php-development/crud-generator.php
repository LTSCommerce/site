<?php

declare(strict_types=1);

namespace App\CodeGeneration;

use App\Contracts\AIClientInterface;
use App\Exceptions\CodeGenerationException;
use App\ValueObjects\{CodeTemplate, EntityName, FieldDefinition};
use Psr\Log\LoggerInterface;

final readonly class AICodeGenerator
{
    public function __construct(
        private AIClientInterface $aiClient,
        private LoggerInterface $logger,
        private CodeTemplateRepository $templateRepository,
    ) {
    }

    /** @param array<FieldDefinition> $fields */
    public function generateCRUD(EntityName $entityName, array $fields): string
    {
        $template = $this->templateRepository->getTemplate('modern-php-entity');
        $prompt = $this->buildPrompt($entityName, $fields, $template);

        try {
            $generatedCode = $this->aiClient->generateCode($prompt);

            $this->logger->info('CRUD code generated successfully', [
                'entity'       => $entityName->value,
                'fields_count' => count($fields),
            ]);

            return $this->postProcessCode($generatedCode);
        } catch (Throwable $e) {
            throw new CodeGenerationException(
                "Failed to generate CRUD for {$entityName->value}: {$e->getMessage()}",
                previous: $e
            );
        }
    }

    /** @param array<FieldDefinition> $fields */
    private function buildPrompt(EntityName $entityName, array $fields, CodeTemplate $template): string
    {
        $fieldDescriptions = array_map(
            fn (FieldDefinition $field) => $field->toPromptString(),
            $fields
        );

        return $template->render([
            'entity_name' => $entityName->value,
            'fields'      => implode(', ', $fieldDescriptions),
            'requirements' => [
                'Use PHP 8.3+ features',
                'Include strict typing with declare(strict_types=1)',
                'Use readonly properties where appropriate',
                'Include proper validation and error handling',
                'Follow domain-driven design principles',
                'Use value objects for complex data',
                'Include comprehensive PHPDoc',
            ],
        ]);
    }

    private function postProcessCode(string $code): string
    {
        // Post-process generated code to ensure consistency
        return $code;
    }
}
