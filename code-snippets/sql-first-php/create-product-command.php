<?php

// Source: https://github.com/LongTermSupport/sql-first-php-demo/blob/main/example/Product/CreateProductCommand.php
// example/Product/CreateProductCommand.php (docblock removed)

final readonly class CreateProductCommand
{
    public function __construct(private DbServiceInterface $db)
    {
    }

    public function execute(NewProduct $new): int
    {
        $t = ProductTable::columns();

        return Insert::row(
            $this->db,
            ProductTable::TABLE_NAME,
            $t->sku->is($new->sku),
            $t->name->is($new->name),
            $t->description->is($new->description),     // NullableStringColumn::is(?string)
            $t->status->is($new->status->value),
            $t->unitPrice->is($new->unitPrice),         // DecimalColumn::is(string): no float accepted
            $t->salePrice->is($new->salePrice),
            $t->stock->is($new->stock),                 // IntColumn::is(int)
            $t->supplierId->is($new->supplierId),
            $t->isFeatured->is($new->isFeatured),       // bound as 1 or 0
        );
    }
}

// Insert::row() builds both lists from the same values, so they cannot drift apart:
// INSERT INTO `product` (`sku`, `name`, `description`, `status`, `unit_price`, `sale_price`,
//                        `stock`, `supplier_id`, `is_featured`)
//      VALUES (:sku, :name, :description, :status, :unit_price, :sale_price,
//              :stock, :supplier_id, :is_featured)
