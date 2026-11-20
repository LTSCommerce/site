<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/tests/Support/TableClassSchemaChecker.php#L74-L120
// Trimmed from tests/Support/TableClassSchemaChecker.php

final readonly class TableClassSchemaChecker
{
    public const string SQL = <<<'SQL'
        SELECT COLUMN_NAME, IS_NULLABLE, DATA_TYPE, COLUMN_TYPE
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table_name
        ORDER BY ORDINAL_POSITION
        SQL;

    // Which column class may sit over which MySQL types, and whether it expects NULL.
    private const array COMPATIBLE = [
        IntColumn::class             => ['nullable' => false, 'types' => self::INTEGER_TYPES],
        NullableIntColumn::class     => ['nullable' => true,  'types' => self::INTEGER_TYPES],
        DecimalColumn::class         => ['nullable' => false, 'types' => ['decimal']],
        NullableDecimalColumn::class => ['nullable' => true,  'types' => ['decimal']],
        BoolColumn::class            => ['nullable' => false, 'types' => ['tinyint']],
        // ...
    ];

    // For each typed column the table class declares (found by reflection), the live table
    // must have it, with matching nullability and a compatible type. Live columns the class
    // does not declare are reported, not failed, so a wide legacy table can be modelled a bit
    // at a time.
}
