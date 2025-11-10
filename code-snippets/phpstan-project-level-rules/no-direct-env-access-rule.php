<?php

declare(strict_types=1);

namespace App\PHPStan\Rules\Architecture;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Prevents direct access to environment variables using getenv() or $_ENV.
 *
 * Direct environment access violates dependency injection principles and
 * makes code harder to test. Configuration should be injected through
 * constructors, making dependencies explicit.
 *
 * This rule enforces proper dependency injection patterns.
 *
 * @implements Rule<Node>
 */
final class NoDirectEnvAccessRule implements Rule
{
    public function getNodeType(): string
    {
        return Node::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        $errors = [];

        // Check for getenv() calls
        if ($node instanceof Node\Expr\FuncCall
            && $node->name instanceof Node\Name
            && $node->name->toString() === 'getenv'
        ) {
            $errors[] = RuleErrorBuilder::message(
                'Direct environment access via getenv() is not allowed. ' .
                'Use dependency injection to pass configuration.'
            )
            ->identifier('app.directEnvAccess')
            ->line($node->getStartLine())
            ->tip(
                'Best practice:' . PHP_EOL .
                '1. Create a configuration class that reads from environment' . PHP_EOL .
                '2. Register it in your dependency injection container' . PHP_EOL .
                '3. Inject the configuration into classes that need it' . PHP_EOL .
                'Benefits: Testability, explicit dependencies, type safety'
            )
            ->build();
        }

        // Check for $_ENV access
        if ($node instanceof Node\Expr\ArrayDimFetch
            && $node->var instanceof Node\Expr\Variable
            && is_string($node->var->name)
            && $node->var->name === '_ENV'
        ) {
            $errors[] = RuleErrorBuilder::message(
                'Direct environment access via $_ENV is not allowed. ' .
                'Use dependency injection to pass configuration.'
            )
            ->identifier('app.directEnvAccess')
            ->line($node->getStartLine())
            ->tip(
                'Replace with constructor injection:' . PHP_EOL .
                'public function __construct(private readonly ConfigInterface $config) {}' . PHP_EOL .
                'Then use: $this->config->get(\'KEY\')'
            )
            ->build();
        }

        // Check for $_SERVER access (common for environment variables)
        if ($node instanceof Node\Expr\ArrayDimFetch
            && $node->var instanceof Node\Expr\Variable
            && is_string($node->var->name)
            && $node->var->name === '_SERVER'
        ) {
            // Only flag if accessing typical environment variable keys
            if ($node->dim instanceof Node\Scalar\String_) {
                $key = $node->dim->value;
                $envLikePatterns = [
                    'APP_',
                    'DB_',
                    'CACHE_',
                    'API_',
                    'SECRET_',
                ];

                foreach ($envLikePatterns as $pattern) {
                    if (str_starts_with($key, $pattern)) {
                        $errors[] = RuleErrorBuilder::message(
                            sprintf(
                                'Direct environment access via $_SERVER[\'%s\'] is not allowed. ' .
                                'Use dependency injection to pass configuration.',
                                $key
                            )
                        )
                        ->identifier('app.directEnvAccess')
                        ->line($node->getStartLine())
                        ->build();
                        break;
                    }
                }
            }
        }

        return $errors;
    }
}
