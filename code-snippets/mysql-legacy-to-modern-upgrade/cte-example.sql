-- Legacy MySQL 4-5: nested subqueries
SELECT * FROM (
    SELECT customer_id, SUM(amount) as total
    FROM orders
    GROUP BY customer_id
) AS customer_totals
WHERE total > 1000;

-- Modern MySQL 8.0+: CTE
WITH customer_totals AS (
    SELECT customer_id, SUM(amount) as total
    FROM orders
    GROUP BY customer_id
)
SELECT * FROM customer_totals
WHERE total > 1000;
