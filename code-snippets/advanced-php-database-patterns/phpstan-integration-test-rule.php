<?php

declare(strict_types=1);

namespace App\PHPStan\Rules;

use PhpParser\Node;
use PHPStan\Analyser\Scope;
use PHPStan\Node\InClassNode;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Enforces that all database test classes implement DatabaseIntegrationTestInterface.
 *
 * This rule prevents bugs where SQL references wrong tables/columns but tests pass
 * because they only use mocked data and never execute real SQL.
 *
 * @implements Rule<InClassNode>
 */
final class DatabaseTestClassRequiresIntegrationTestRule implements Rule
{
    public function getNodeType(): string
    {
        return InClassNode::class;
    }

    /**
     * @param InClassNode $node
     */
    public function processNode(Node $node, Scope $scope): array
    {
        $classReflection = $node->getClassReflection();

        // Only process test classes in tests/Database/ directory
        if (!$this->isDatabaseTestClass($classReflection->getName())) {
            return [];
        }

        // Check if class implements DatabaseIntegrationTestInterface
        if (!$classReflection->implementsInterface('App\Tests\Database\DatabaseIntegrationTestInterface')) {
            return [
                RuleErrorBuilder::message(sprintf(
                    "Test class %s must implement DatabaseIntegrationTestInterface and have itWorksWithRealDb() method.\n\n" .
                    "Database Query/PreparedStmt/Generator test classes MUST have integration tests that execute\n" .
                    "SQL against real database to catch bugs like table name errors, missing columns, etc.\n\n" .
                    "Unit tests with mocked data are NOT sufficient - they don't validate SQL correctness.\n\n" .
                    "To fix:\n" .
                    "1. Implement App\\Tests\\Database\\DatabaseIntegrationTestInterface\n" .
                    "2. Add itWorksWithRealDb() method with #[Test] attribute\n" .
                    "3. Use real DatabaseServiceInterface from container (not mocked)\n" .
                    "4. Mark test class with #[Medium] or #[Large] attribute",
                    $classReflection->getDisplayName()
                ))
                    ->identifier('databaseTest.missingIntegrationTest')
                    ->build(),
            ];
        }

        // Check if itWorksWithRealDb() method exists
        if (!$classReflection->hasMethod('itWorksWithRealDb')) {
            return [
                RuleErrorBuilder::message(sprintf(
                    "Test class %s implements DatabaseIntegrationTestInterface but is missing itWorksWithRealDb() method.\n\n" .
                    "The interface requires a method named 'itWorksWithRealDb' that:\n" .
                    "- Uses real DatabaseServiceInterface from container\n" .
                    "- Executes actual SQL against real database\n" .
                    "- Verifies query returns expected structure\n" .
                    "- Has #[Test] attribute",
                    $classReflection->getDisplayName()
                ))
                    ->identifier('databaseTest.missingMethod')
                    ->build(),
            ];
        }

        return [];
    }

    /**
     * Check if class is a database test class in tests/Database/ directory.
     */
    private function isDatabaseTestClass(string $className): bool
    {
        // Must be in App\Tests\Database namespace
        if (!str_starts_with($className, 'App\Tests\Database\\')) {
            return false;
        }

        // Must end with "Test"
        if (!str_ends_with($className, 'Test')) {
            return false;
        }

        // Must be in Query, PreparedStmt, or Generator subdirectory
        return str_contains($className, '\Query\\')
            || str_contains($className, '\PreparedStmt\\')
            || str_contains($className, '\Generator\\');
    }
}
