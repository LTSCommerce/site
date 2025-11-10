<?php

declare(strict_types=1);

namespace App\PHPStan\Rules\Performance;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;
use PHPStan\Type\ObjectType;

/**
 * Detects database query instantiation inside loops.
 *
 * This is a common performance anti-pattern where queries are created
 * inside foreach, for, while, or do-while loops. This typically leads
 * to N+1 query problems.
 *
 * Example violation:
 * foreach ($users as $user) {
 *     $query = new Query('SELECT * FROM orders WHERE user_id = ?');
 * }
 *
 * @implements Rule<Node\Expr\New_>
 */
final class QueryInLoopRule implements Rule
{
    public function getNodeType(): string
    {
        return Node\Expr\New_::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        if (!$node instanceof Node\Expr\New_) {
            return [];
        }

        // Check if we're instantiating a Query class
        if (!$node->class instanceof Node\Name) {
            return [];
        }

        $className = $scope->resolveName($node->class);
        $queryType = new ObjectType('App\\Database\\Query');

        // Check if the instantiated class is a Query type
        if (!$queryType->isSuperTypeOf(new ObjectType($className))->yes()) {
            return [];
        }

        // Check if we're inside a loop
        if (!$this->isInsideLoop($node)) {
            return [];
        }

        return [
            RuleErrorBuilder::message(
                'Query instantiation detected inside a loop. ' .
                'This creates N+1 query problems and severe performance degradation.'
            )
            ->identifier('app.queryInLoop')
            ->line($node->getStartLine())
            ->tip(
                'Refactor to: ' . PHP_EOL .
                '1. Build a list of IDs in the loop' . PHP_EOL .
                '2. Execute a single query with WHERE id IN (...)' . PHP_EOL .
                '3. Map results back to the original data' . PHP_EOL .
                'See: https://your-docs.example.com/performance/query-batching'
            )
            ->build()
        ];
    }

    /**
     * Traverses up the AST tree to determine if the node is inside a loop.
     */
    private function isInsideLoop(Node $node): bool
    {
        $parent = $node->getAttribute('parent');

        while ($parent !== null) {
            if ($parent instanceof Node\Stmt\Foreach_
                || $parent instanceof Node\Stmt\For_
                || $parent instanceof Node\Stmt\While_
                || $parent instanceof Node\Stmt\Do_
            ) {
                return true;
            }

            $parent = $parent->getAttribute('parent');
        }

        return false;
    }
}
