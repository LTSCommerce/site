<?php

declare(strict_types=1);

namespace App\Example;

use App\Database\BulkUpdateSingleColumn;
use App\Database\DatabaseServiceInterface;
use Psr\Log\LoggerInterface;

/**
 * Example: Using BulkUpdateSingleColumn to efficiently update thousands of rows.
 */
final readonly class UpdateProductPricesService
{
    public function __construct(
        private DatabaseServiceInterface $dbService,
        private LoggerInterface $logger,
    ) {
    }

    /**
     * Update prices for thousands of products efficiently.
     *
     * @param array<int,float> $productPrices Map of product ID to new price
     */
    public function updatePrices(array $productPrices): void
    {
        $bulkUpdate = new BulkUpdateSingleColumn(
            dbService: $this->dbService,
            table: 'products',
            idColumnName: 'id',
            updateColumnName: 'price',
            extraWhereConditions: 'AND deleted_at IS NULL',
            logger: $this->logger,
        );

        // Set chunk size to control batch size
        $bulkUpdate->setChunkSize(5000);

        // Add all price updates - bulk operations happen automatically
        foreach ($productPrices as $productId => $newPrice) {
            $bulkUpdate->addIdAndValue($productId, $newPrice);
        }

        // The destructor would flush this on scope exit anyway, but calling
        // it explicitly here makes the flush point clear to the reader.
        $bulkUpdate->runBulkUpdate();
    }
}
