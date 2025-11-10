<?php

declare(strict_types=1);

namespace App\PHPStan\Rules\Testing;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;
use PHPStan\Type\ObjectType;

/**
 * Prevents mocking of the DatabaseService in tests.
 *
 * The DatabaseService is a critical infrastructure component that should
 * be tested against a real test database, not mocked. Mocking it produces
 * false confidence and hides real integration issues.
 *
 * This is a test safety rule that enforces proper integration testing.
 *
 * @implements Rule<Node\Expr\MethodCall>
 */
final class NoMockDatabaseServiceRule implements Rule
{
    public function getNodeType(): string
    {
        return Node\Expr\MethodCall::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        if (!$node instanceof Node\Expr\MethodCall) {
            return [];
        }

        // Only check code in test files
        if (!str_ends_with($scope->getFile(), 'Test.php')) {
            return [];
        }

        // Check if this is a createMock() or getMockBuilder() call
        if (!$node->name instanceof Node\Identifier) {
            return [];
        }

        $methodName = $node->name->toString();
        if (!in_array($methodName, ['createMock', 'getMockBuilder'], true)) {
            return [];
        }

        // Check if we're mocking DatabaseServiceInterface
        if (count($node->getArgs()) === 0) {
            return [];
        }

        $firstArg = $node->getArgs()[0]->value;

        // Check for DatabaseServiceInterface::class
        if ($firstArg instanceof Node\Expr\ClassConstFetch
            && $firstArg->class instanceof Node\Name
            && $firstArg->name instanceof Node\Identifier
            && $firstArg->name->toString() === 'class'
        ) {
            $className = $scope->resolveName($firstArg->class);

            // Check if it's the DatabaseServiceInterface
            if ($className === 'App\\Database\\DatabaseServiceInterface'
                || str_ends_with($className, '\\DatabaseServiceInterface')
            ) {
                return [
                    RuleErrorBuilder::message(
                        'Mocking DatabaseServiceInterface is not allowed. ' .
                        'This is a critical service that must be tested against a real test database.'
                    )
                    ->identifier('app.mockDatabaseService')
                    ->line($node->getStartLine())
                    ->tip(
                        'Testing guidelines:' . PHP_EOL .
                        '1. Use TestCase::setUpDatabase() to get a real test database' . PHP_EOL .
                        '2. Tests run in transactions that auto-rollback' . PHP_EOL .
                        '3. Test database is isolated and uses test fixtures' . PHP_EOL .
                        '4. Integration tests provide real confidence' . PHP_EOL .
                        'See: docs/testing/database-testing.md'
                    )
                    ->build()
                ];
            }
        }

        return [];
    }
}
