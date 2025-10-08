<?php

declare(strict_types=1);

namespace App\Database\Query;

use App\Database\DatabaseServiceInterface;

/**
 * Example using derived tables for performance optimization.
 * Derived tables allow complex filtering before joining, reducing result set size.
 */
final readonly class TopCustomersByRevenueQuery
{
    /**
     * Uses a derived table to pre-aggregate order totals before joining with customers.
     * This is more efficient than joining first and then aggregating.
     */
    private const string SQL_TOP_CUSTOMERS = <<<'SQL'
        SELECT
            c.id,
            c.name,
            c.email,
            revenue.total_revenue,
            revenue.order_count
        FROM customers c
        INNER JOIN (
            -- Derived table: pre-aggregate order data
            SELECT
                customer_id,
                SUM(total) as total_revenue,
                COUNT(*) as order_count
            FROM orders
            WHERE status = 'completed'
                AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY customer_id
            HAVING total_revenue > 1000
        ) AS revenue ON c.id = revenue.customer_id
        WHERE c.status = 'active'
        ORDER BY revenue.total_revenue DESC
        LIMIT 100
        SQL;

    /**
     * @var array<array{id: int, name: string, email: string, total_revenue: float, order_count: int}>
     */
    public array $results;

    public function __construct(DatabaseServiceInterface $dbService)
    {
        $this->results = $dbService->query(self::SQL_TOP_CUSTOMERS);
    }
}
