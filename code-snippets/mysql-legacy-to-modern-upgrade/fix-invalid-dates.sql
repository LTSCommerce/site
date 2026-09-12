-- Find invalid dates (common in MySQL 4-5 era)
SELECT * FROM orders
WHERE order_date = '0000-00-00'
    OR order_date < '1970-01-01';

-- Update to NULL or a valid default
UPDATE orders
SET order_date = NULL
WHERE order_date = '0000-00-00';
