<?php

declare(strict_types=1);

namespace App\Example;

use App\Database\DatabaseServiceInterface;
use App\Database\Generator\ProductGenerator;

/**
 * Example: Processing large datasets with generators for memory efficiency.
 */
final readonly class ExportProductsService
{
    public function __construct(
        private DatabaseServiceInterface $dbService,
    ) {
    }

    /**
     * Export millions of products to CSV without exhausting memory.
     *
     * Using generators, this can process millions of rows while using
     * only a few megabytes of memory, regardless of result set size.
     */
    public function exportToCsv(string $filename): void
    {
        $generator = new ProductGenerator($this->dbService);

        $handle = fopen($filename, 'w');

        // Write CSV header
        fputcsv($handle, ['ID', 'Name', 'Price']);

        // Process results one at a time - memory stays constant
        foreach ($generator->generator as $product) {
            fputcsv($handle, [
                $product['id'],
                $product['name'],
                $product['price'],
            ]);
        }

        fclose($handle);
    }

    /**
     * Alternative: Stream query results directly without separate generator class.
     */
    public function exportWithDirectStream(string $filename): void
    {
        $sql = 'SELECT id, name, price FROM products WHERE deleted_at IS NULL ORDER BY name';

        $handle = fopen($filename, 'w');
        fputcsv($handle, ['ID', 'Name', 'Price']);

        // Direct streaming - no intermediate array storage
        foreach ($this->dbService->stream($sql) as $row) {
            fputcsv($handle, [
                $row['id'],
                $row['name'],
                $row['price'],
            ]);
        }

        fclose($handle);
    }
}
