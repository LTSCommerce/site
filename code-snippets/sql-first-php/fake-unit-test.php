<?php

// Adapted from tests/Product/FindProductByIdQueryTest.php (the real test reuses a row fixture
// from ProductTest; it is written out inline here so the shape is visible)

final class FindProductByIdQueryTest extends TestCase
{
    #[Test]
    public function itHydratesTheMatchingRow(): void
    {
        // Configured by SQL text. The row is written in its most string-typed form, as some
        // drivers and settings deliver it; Row copes with that and with native ints alike.
        $db = new FakeDbService()->onQuery(FindProductByIdQuery::SQL, [[
            'id' => '3', 'sku' => 'ANV-001', 'name' => 'Anvil', 'description' => null,
            'status' => 'active', 'unit_price' => '149.90', 'sale_price' => null,
            'stock' => '4', 'supplier_id' => null, 'is_featured' => '1',
        ]]);

        $product = new FindProductByIdQuery($db)->execute(3);

        self::assertNotNull($product);
        self::assertSame('ANV-001', $product->sku);
        self::assertSame([['id' => 3]], array_column($db->executed(), 'params'));
    }
}

// Unconfigured SQL is not an empty result. It fails, listing what was configured:
//
//   FakeDbService::query() got SQL nobody configured:
//     SELECT * FROM product
//   Configured:
//     SELECT id, sku, name, ... FROM product WHERE id = :id
