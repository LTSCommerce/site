<?php

declare(strict_types=1);

namespace App\Database\Generator;

use App\Database\DatabaseServiceInterface;
use Generator;
use RuntimeException;

/**
 * @phpstan-type ProductGeneratorType Generator<array{id: int, name: string, price: float}>
 *
 * Streams database results using PHP generators for memory efficiency.
 * Ideal for processing large datasets without loading everything into memory.
 */
final readonly class ProductGenerator
{
    /**
     * SQL query to fetch all products.
     */
    private const string SQL_FETCH_PRODUCTS = <<<'SQL'
        SELECT
            id,
            name,
            price
        FROM products
        WHERE deleted_at IS NULL
        ORDER BY name
        SQL;

    /** @var ProductGeneratorType */
    public Generator $generator;

    public function __construct(DatabaseServiceInterface $dbService)
    {
        $this->generator = $this->createGenerator($dbService);
    }

    /**
     * @return ProductGeneratorType
     */
    private function createGenerator(DatabaseServiceInterface $dbService): Generator
    {
        $rawGenerator = $dbService->stream(self::SQL_FETCH_PRODUCTS);

        foreach ($rawGenerator as $row) {
            if (
                !is_array($row)
                || !isset($row['id'], $row['name'], $row['price'])
                || !is_numeric($row['id'])
                || !is_string($row['name'])
                || '' === $row['name']
                || !is_numeric($row['price'])
            ) {
                throw new RuntimeException('Failed getting valid row from query: ' . print_r($row, true));
            }

            yield [
                'id' => (int)$row['id'],
                'name' => $row['name'],
                'price' => (float)$row['price'],
            ];
        }
    }
}
