-- Slow: Correlated subquery
SELECT u.*, 
       (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count
FROM users u
WHERE u.status = 'active';

-- Fast: LEFT JOIN with GROUP BY
SELECT u.*, COALESCE(o.order_count, 0) as order_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
) o ON u.id = o.user_id
WHERE u.status = 'active';

-- Slow: IN subquery with large result set
SELECT * FROM products 
WHERE id IN (
    SELECT product_id FROM order_items 
    WHERE order_id IN (SELECT id FROM orders WHERE status = 'completed')
);

-- Fast: EXISTS with proper indexing
SELECT p.* FROM products p
WHERE EXISTS (
    SELECT 1 FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.product_id = p.id AND o.status = 'completed'
);