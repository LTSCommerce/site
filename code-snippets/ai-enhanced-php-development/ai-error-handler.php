<?php

declare(strict_types=1);

namespace App\ErrorHandling;

use App\Contracts\AIClientInterface;
use App\Exceptions\ErrorAnalysisException;
use App\ValueObjects\{ErrorContext, ErrorSolution};
use Psr\Log\LoggerInterface;
use Throwable;

final readonly class AIErrorHandler
{
    public function __construct(
        private AIClientInterface $aiClient,
        private LoggerInterface $logger,
        private ErrorContextBuilder $contextBuilder,
    ) {
    }

    public function handleError(Throwable $error): ErrorSolution
    {
        $context = $this->contextBuilder->buildFromThrowable($error);

        try {
            $solution = $this->aiClient->suggestSolution($context);

            $this->logger->info('AI error solution generated', [
                'error_type'          => $error::class,
                'error_message'       => $error->getMessage(),
                'solution_confidence' => $solution->getConfidence(),
            ]);

            return $solution;
        } catch (Throwable $e) {
            $this->logger->error('Failed to generate AI solution', [
                'original_error' => $error->getMessage(),
                'ai_error'       => $e->getMessage(),
            ]);

            throw new ErrorAnalysisException(
                "Failed to analyze error: {$e->getMessage()}",
                previous: $e
            );
        }
    }

    public function analyzePerformanceIssue(string $slowQuery, array $metrics): ErrorSolution
    {
        $context = new ErrorContext(
            type: 'performance',
            description: 'Slow database query detected',
            metadata: [
                'query'          => $slowQuery,
                'execution_time' => $metrics['execution_time'],
                'memory_usage'   => $metrics['memory_usage'],
                'affected_rows'  => $metrics['affected_rows'],
            ]
        );

        return $this->aiClient->suggestSolution($context);
    }

    public function analyzeSecurityVulnerability(string $code, array $scanResults): ErrorSolution
    {
        $context = new ErrorContext(
            type: 'security',
            description: 'Security vulnerability detected',
            metadata: [
                'code_snippet'       => $code,
                'vulnerability_type' => $scanResults['type'],
                'severity'           => $scanResults['severity'],
                'cwe_id'             => $scanResults['cwe_id'] ?? null,
            ]
        );

        return $this->aiClient->suggestSolution($context);
    }
}
