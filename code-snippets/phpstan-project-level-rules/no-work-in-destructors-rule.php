<?php

declare(strict_types=1);

namespace App\PHPStan\Rules\Architecture;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Prevents any work from being performed in class destructors.
 *
 * Destructors are called during object cleanup and their execution timing
 * is unpredictable. They should never perform I/O, call external services,
 * or execute business logic.
 *
 * This is an architectural rule that enforces clean separation of concerns.
 *
 * @implements Rule<Node\Stmt\ClassMethod>
 */
final class NoWorkInDestructorsRule implements Rule
{
    public function getNodeType(): string
    {
        return Node\Stmt\ClassMethod::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        if (!$node instanceof Node\Stmt\ClassMethod) {
            return [];
        }

        // Only check destructors
        if ($node->name->toString() !== '__destruct') {
            return [];
        }

        // Check if destructor has any statements
        if ($node->stmts === null || count($node->stmts) === 0) {
            return [];
        }

        // Filter out comments and empty statements
        $realStatements = array_filter(
            $node->stmts,
            fn($stmt) => !($stmt instanceof Node\Stmt\Nop)
        );

        if (count($realStatements) === 0) {
            return [];
        }

        return [
            RuleErrorBuilder::message(
                'Destructors must not contain any logic. ' .
                'Destructor execution timing is unpredictable and depends on garbage collection.'
            )
            ->identifier('app.workInDestructor')
            ->line($node->getStartLine())
            ->tip(
                'Architectural guidelines:' . PHP_EOL .
                '1. Never perform I/O in destructors (database, files, network)' . PHP_EOL .
                '2. Never call external services' . PHP_EOL .
                '3. Never execute business logic' . PHP_EOL .
                '4. Use explicit cleanup methods instead (e.g., close(), dispose())' . PHP_EOL .
                'See: https://www.php.net/manual/en/language.oop5.decon.php'
            )
            ->build()
        ];
    }
}
