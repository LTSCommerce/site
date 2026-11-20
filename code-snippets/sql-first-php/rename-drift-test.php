<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/tests/Checks/SqlConstantsPrepareTest.php
// Trimmed from tests/Checks/SqlConstantsPrepareTest.php

#[Group('real-db')]
final class SqlConstantsPrepareTest extends TestCase
{
    use RealDatabase;

    #[Test]
    public function everySqlConstantPreparesAgainstTheMigratedSchema(): void
    {
        $statements = self::applicationSql();       // SqlConstantFinder::find() over example/

        // Guard against the check silently checking nothing (a wrong path, a renamed constant).
        self::assertGreaterThanOrEqual(4, \count($statements), 'expected to discover the example query classes');

        $failures = new ServerSidePrepareValidator($this->rawPdo())->validate($statements);

        self::assertSame([], $failures, implode("\n", $failures));
    }

    #[Test]
    public function aRenamedColumnIsCaughtInEveryQueryThatStillUsesIt(): void
    {
        $this->db()->execute('ALTER TABLE product RENAME COLUMN sale_price TO promo_price');

        $failures = new ServerSidePrepareValidator($this->rawPdo())->validate(self::applicationSql());

        $failed = array_map(static fn (string $f): string => strstr($f, '::SQL', true) ?: $f, $failures);
        self::assertContains(FindProductByIdQuery::class, $failed);
        self::assertContains(ListProductsByStatusQuery::class, $failed);
        self::assertStringContainsString('sale_price', $failures[0]);   // "Unknown column 'sale_price'"
    }
}
