-- Legacy MyISAM: no foreign key support
-- Admin deletes inactive customer
DELETE FROM customers WHERE customer_id = 5000;

-- Orders still reference deleted customer
SELECT COUNT(*) FROM orders WHERE customer_id = 5000;
-- Returns a non-zero count - exact figure depends on order volume

-- Financial report crashes or shows incorrect totals
SELECT c.company_name, SUM(o.amount) as total_revenue
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id  -- NULL results!
GROUP BY c.customer_id;

-- GDPR compliance request fails
-- "Delete all my data" - but orders remain, violating privacy laws
