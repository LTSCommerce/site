<?php

// Trimmed from example/Product/ProductTable.php (four of the ten columns shown)

final class ProductTable
{
    public const string TABLE_NAME = 'product';

    public const string COL_ID         = 'id';
    public const string COL_UNIT_PRICE = 'unit_price';
    public const string COL_SALE_PRICE = 'sale_price';
    public const string COL_STOCK      = 'stock';

    public readonly IntColumn $id;
    public readonly DecimalColumn $unitPrice;
    public readonly NullableDecimalColumn $salePrice;
    public readonly IntColumn $stock;

    private static ?self $instance = null;

    private function __construct()
    {
        $this->id        = new IntColumn(self::COL_ID);
        $this->unitPrice = new DecimalColumn(self::COL_UNIT_PRICE);
        $this->salePrice = new NullableDecimalColumn(self::COL_SALE_PRICE);
        $this->stock     = new IntColumn(self::COL_STOCK);
    }

    public static function columns(): self
    {
        return self::$instance ??= new self();
    }
}
