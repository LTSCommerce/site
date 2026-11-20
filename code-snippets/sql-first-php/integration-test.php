<?php

// Trimmed from tests/Product/FindProductByIdQueryIntegrationTest.php

#[Group('real-db')]
final class FindProductByIdQueryIntegrationTest extends TestCase
{
    use RealDatabase;   // a fresh test_demo_* schema per test, built from schema.sql, dropped after

    #[Test]
    public function itFindsARealRow(): void
    {
        $ids = ProductFixtures::seed($this->db());

        $product = new FindProductByIdQuery($this->db())->execute($ids['anvil']);

        self::assertSame('149.99', $product?->unitPrice);
        self::assertSame('129.50', $product?->salePrice);   // the trailing zero survives
    }
}
