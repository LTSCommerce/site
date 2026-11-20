<?php

// example/Product/FindProductByIdQuery.php (docblock removed)

final readonly class FindProductByIdQuery
{
    public const string SQL = <<<'SQL'
        SELECT id, sku, name, description, status, unit_price, sale_price, stock, supplier_id, is_featured
        FROM product
        WHERE id = :id
        SQL;

    public function __construct(private DbServiceInterface $db)
    {
    }

    public function execute(int $id): ?Product
    {
        $row = $this->db->queryRows(self::SQL, [ProductTable::COL_ID => $id])->firstOrNull();

        return null === $row ? null : Product::fromRow($row);
    }
}

// At the call site:
$product = new FindProductByIdQuery($db)->execute($id);
