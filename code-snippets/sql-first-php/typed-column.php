<?php

// src/Schema/NullableDecimalColumn.php, near enough. One small final class per PHP type, so
// PHPStan knows exactly what fromRow() returns and what is() accepts.

final readonly class NullableDecimalColumn extends AbstractColumn
{
    public function fromRow(Row $row): ?string
    {
        return $row->nullableDecimal($this->name);
    }

    public function is(?string $value): ColumnValue
    {
        return null === $value
            ? new ColumnValue($this, null)
            : new DecimalColumn($this->name)->is($value);   // validates the decimal format
    }
}
