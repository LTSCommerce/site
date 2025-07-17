<?php

declare(strict_types=1);

namespace App\AI\CodeReview;

use App\ValueObjects\{CodeSnippet, ReviewResult, AIPrompt};
use App\Exceptions\{AIServiceException, CodeReviewException};
use App\Contracts\AIClientInterface;
use Psr\Log\LoggerInterface;

final readonly class AICodeReviewer
{
    public function __construct(
        private AIClientInterface $aiClient,
        private LoggerInterface $logger,
        private string $model = 'gpt-4-turbo',
        private int $maxTokens = 2000,
    ) {}
    
    public function reviewCode(CodeSnippet $code): ReviewResult
    {
        $systemPrompt = AIPrompt::system(<<< 'PROMPT'
            You are a senior PHP 8.3+ developer reviewing code for:
            - Modern PHP syntax and features
            - Type safety and strict typing
            - Security vulnerabilities
            - Performance optimizations
            - SOLID principles adherence
            - Best practices and code quality
            
            Provide specific, actionable feedback with code examples.
            PROMPT);
        
        $userPrompt = AIPrompt::user(
            "Please review this PHP code:\n\n" . $code->content
        );
        
        try {
            $response = $this->aiClient->chat([
                'model' => $this->model,
                'max_tokens' => $this->maxTokens,
                'temperature' => 0.1, // Low temperature for consistent reviews
                'messages' => [
                    $systemPrompt->toArray(),
                    $userPrompt->toArray(),
                ],
            ]);
            
            $reviewContent = $response['choices'][0]['message']['content'];
            
            $this->logger->info('Code review completed', [
                'code_length' => strlen($code->content),
                'tokens_used' => $response['usage']['total_tokens'],
            ]);
            
            return $this->parseReviewResponse($reviewContent);
        } catch (Throwable $e) {
            $this->logger->error('AI code review failed', [
                'error' => $e->getMessage(),
                'code_snippet' => substr($code->content, 0, 100) . '...',
            ]);
            
            throw new CodeReviewException(
                "Code review failed: {$e->getMessage()}",
                previous: $e
            );
        }
    }
    
    private function parseReviewResponse(string $response): ReviewResult
    {
        // Parse structured review response
        return ReviewResult::fromAIResponse($response);
    }
    
    public function batchReviewFiles(array $files): array
    {
        $reviews = [];
        
        foreach ($files as $file) {
            $code = CodeSnippet::fromFile($file);
            $reviews[$file] = $this->reviewCode($code);
        }
        
        return $reviews;
    }
}