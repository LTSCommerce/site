<?php

declare(strict_types=1);

namespace App\Database\PreparedStmt;

use App\Database\DatabaseServiceInterface;

/**
 * @phpstan-type OrderArray array{id: int, customer_id: int, total: float, status: string}
 *
 * Encapsulates a prepared statement for reusable parameterized queries.
 * Unlike Query classes, PreparedStmt classes have methods to execute with different parameters.
 */
final readonly class GetOrderByIdStmt
{
    /**
     * SQL to fetch order by ID.
     */
    private const string SQL_FETCH_ORDER = <<<'SQL'
        SELECT
            id,
            customer_id,
            total,
            status
        FROM orders
        WHERE id = :order_id
        SQL;

    public function __construct(
        private DatabaseServiceInterface $dbService
    ) {
    }

    /**
     * Execute the query and return the order, or null if not found.
     *
     * @param int $orderId The order ID to fetch
     * @return OrderArray|null The order data, or null if not found
     */
    public function getResult(int $orderId): ?array
    {
        $results = $this->dbService->query(
            self::SQL_FETCH_ORDER,
            ['order_id' => $orderId]
        );

        if ([] === $results) {
            return null;
        }

        $order = $results[0];

        // Validate and cast types
        return [
            'id' => (int)$order['id'],
            'customer_id' => (int)$order['customer_id'],
            'total' => (float)$order['total'],
            'status' => (string)$order['status'],
        ];
    }
}
