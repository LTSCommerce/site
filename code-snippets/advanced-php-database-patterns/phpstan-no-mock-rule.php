<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use PhpParser\Node;
use PhpParser\Node\Arg;
use PhpParser\Node\Expr\ClassConstFetch;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Name;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * PHPStan rule to enforce: Do not mock DatabaseServiceInterface in tests.
 *
 * This prevents brittle tests that mock database operations instead of
 * testing against real database connections, which can hide SQL errors.
 *
 * @implements Rule<MethodCall>
 */
final readonly class NoMockDatabaseServiceRule implements Rule
{
    private const string DB_SERVICE_INTERFACE = 'App\Database\DatabaseServiceInterface';
    private const array MOCK_METHODS = ['createMock', 'getMockBuilder'];

    public function getNodeType(): string
    {
        return MethodCall::class;
    }

    /**
     * @param MethodCall $node
     * @return list<\PHPStan\Rules\IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        // Check if method call is on $this
        if (!$node->var instanceof Variable || 'this' !== $node->var->name) {
            return [];
        }

        // Check if method is createMock or getMockBuilder
        if (!$node->name instanceof Node\Identifier) {
            return [];
        }

        $methodName = $node->name->toString();
        if (!in_array($methodName, self::MOCK_METHODS, true)) {
            return [];
        }

        // Check if first argument is DatabaseServiceInterface::class
        if ([] === $node->args) {
            return [];
        }

        $firstArg = $node->args[0];
        if (!$firstArg instanceof Arg || !$firstArg->value instanceof ClassConstFetch) {
            return [];
        }

        $classConstFetch = $firstArg->value;

        // Check if constant is 'class'
        if (!$classConstFetch->name instanceof Node\Identifier || 'class' !== $classConstFetch->name->toString()) {
            return [];
        }

        // Get the class name
        if (!$classConstFetch->class instanceof Name) {
            return [];
        }

        $className = $classConstFetch->class->toString();

        // Check if it's DatabaseServiceInterface
        if (self::DB_SERVICE_INTERFACE !== $className) {
            return [];
        }

        // Build error message
        return [
            RuleErrorBuilder::message(
                'Do not mock DatabaseServiceInterface in tests. Use a test database service with ' .
                'real database connections instead. Mocking database operations hides SQL errors ' .
                'and creates brittle tests that pass even when queries reference wrong tables or columns.'
            )
                ->identifier('app.noMockDatabaseService')
                ->build(),
        ];
    }
}
