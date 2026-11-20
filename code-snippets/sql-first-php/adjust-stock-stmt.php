<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/example/Product/AdjustStockStmt.php
// Trimmed from example/Product/AdjustStockStmt.php

final class AdjustStockStmt extends AbstractPreparedStmt
{
    public const string SQL = <<<'SQL'
        UPDATE product
        SET stock = stock + :delta
        WHERE sku = :sku
          AND stock >= :required
        SQL;

    public function adjust(string $sku, int $delta): bool
    {
        return 1 === $this->execute(self::SQL, [
            self::PARAM_DELTA     => $delta,
            ProductTable::COL_SKU => $sku,
            self::PARAM_REQUIRED  => max(0, -$delta),   // removing 3 needs at least 3 in stock
        ]);
    }
}

// Constructed once, called many times, inside one transaction:
$adjust = new AdjustStockStmt($db);
$db->transactional(function () use ($adjust, $lines): void {
    foreach ($lines as $line) {
        $adjust->adjust($line->sku, $line->delta);
    }
});
