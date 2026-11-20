<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/example/Product/Product.php#L43-L59
// Trimmed from example/Product/Product.php. Not one literal column name.

final readonly class Product
{
    // ... constructor with ten typed, promoted, public properties ...

    public static function fromRow(Row $row): self
    {
        $t = ProductTable::columns();

        return new self(
            id: $t->id->fromRow($row),
            sku: $t->sku->fromRow($row),
            name: $t->name->fromRow($row),
            description: $t->description->fromRow($row),           // ?string
            status: ProductStatus::from($t->status->fromRow($row)), // throws on an unknown ENUM value
            unitPrice: $t->unitPrice->fromRow($row),               // string, exact
            salePrice: $t->salePrice->fromRow($row),               // ?string, exact
            stock: $t->stock->fromRow($row),                       // int, and NULL would throw
            supplierId: $t->supplierId->fromRow($row),             // ?int
            isFeatured: $t->isFeatured->fromRow($row),             // bool, only from 0 or 1
        );
    }
}
