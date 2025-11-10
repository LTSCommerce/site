<?php

declare(strict_types=1);

namespace App\PHPStan\Rules\Testing;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Prevents references to production table names in test files.
 *
 * Tests should use test-specific table fixtures, not production table names.
 * This ensures tests are isolated and don't accidentally depend on
 * production schema details.
 *
 * This is a test isolation rule that enforces proper test data management.
 *
 * @implements Rule<Node\Scalar\String_>
 */
final class NoProductionTablesInTestsRule implements Rule
{
    /**
     * List of production table names that should not appear in tests.
     */
    private const PRODUCTION_TABLES = [
        'users',
        'orders',
        'products',
        'customers',
        'invoices',
        'payments',
        'transactions',
        'accounts',
    ];

    public function getNodeType(): string
    {
        return Node\Scalar\String_::class;
    }

    public function processNode(Node $node, Scope $scope): array
    {
        // Only check code in test files
        if (!str_ends_with($scope->getFile(), 'Test.php')) {
            return [];
        }

        if (!$node instanceof Node\Scalar\String_) {
            return [];
        }

        $stringValue = strtolower($node->value);

        // Check if the string matches a production table name
        foreach (self::PRODUCTION_TABLES as $tableName) {
            // Match exact table name or in SQL-like context
            if ($stringValue === $tableName
                || str_contains($stringValue, "from {$tableName}")
                || str_contains($stringValue, "from `{$tableName}`")
                || str_contains($stringValue, "join {$tableName}")
                || str_contains($stringValue, "join `{$tableName}`")
                || str_contains($stringValue, "into {$tableName}")
                || str_contains($stringValue, "into `{$tableName}`")
                || str_contains($stringValue, "table {$tableName}")
                || str_contains($stringValue, "table `{$tableName}`")
            ) {
                return [
                    RuleErrorBuilder::message(
                        sprintf(
                            'Production table name "%s" detected in test file. ' .
                            'Tests must use test-specific fixtures.',
                            $tableName
                        )
                    )
                    ->identifier('app.productionTableInTest')
                    ->line($node->getStartLine())
                    ->tip(
                        'Test isolation guidelines:' . PHP_EOL .
                        '1. Use test fixtures with "test_" prefix (e.g., "test_users")' . PHP_EOL .
                        '2. Load fixtures via TestCase::loadFixtures()' . PHP_EOL .
                        '3. Never depend on production schema details' . PHP_EOL .
                        '4. Keep tests isolated and repeatable' . PHP_EOL .
                        'See: docs/testing/fixtures.md'
                    )
                    ->build()
                ];
            }
        }

        return [];
    }
}
