<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Basic PHPStan rule structure demonstrating the core interface requirements.
 *
 * Every PHPStan rule must implement the Rule interface with two methods:
 * 1. getNodeType() - Specifies which AST node types to examine
 * 2. processNode() - Analyses the node and returns errors if violations found
 */
final class ExampleRule implements Rule
{
    /**
     * Returns the AST node type this rule monitors.
     *
     * Common node types:
     * - Node\Expr\New_::class           (new ClassName())
     * - Node\Expr\MethodCall::class     ($object->method())
     * - Node\Expr\StaticCall::class     (Class::method())
     * - Node\Stmt\ClassMethod::class    (method definitions)
     * - Node\Expr\FuncCall::class       (function calls)
     */
    public function getNodeType(): string
    {
        return Node\Expr\MethodCall::class;
    }

    /**
     * Processes each node of the specified type and returns errors.
     *
     * @param Node $node  The AST node being examined
     * @param Scope $scope The analysis scope providing type and context information
     * @return array<\PHPStan\Rules\RuleError> Array of rule errors
     */
    public function processNode(Node $node, Scope $scope): array
    {
        // Type check is required since Rule interface uses covariant return types
        if (!$node instanceof Node\Expr\MethodCall) {
            return [];
        }

        // Access node properties to examine the code
        $methodName = $node->name;

        // Skip if method name isn't a simple identifier
        if (!$methodName instanceof Node\Identifier) {
            return [];
        }

        // Example: Detect calls to a problematic method
        if ($methodName->toString() === 'dangerousMethod') {
            return [
                RuleErrorBuilder::message(
                    'Calling dangerousMethod() is not allowed. Use safeMethod() instead.'
                )
                ->identifier('app.dangerousMethodCall')
                ->line($node->getStartLine())
                ->tip('Replace with: $object->safeMethod()')
                ->build()
            ];
        }

        // No violations found
        return [];
    }
}
