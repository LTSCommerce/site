-- Legacy MyISAM: table-level locking
-- Two customers buying the last item simultaneously

-- Customer A reads inventory (quantity = 1)
SELECT quantity FROM inventory WHERE product_id = 999;

-- Customer B reads inventory (quantity = 1)
SELECT quantity FROM inventory WHERE product_id = 999;

-- Customer A updates (locks entire table)
UPDATE inventory SET quantity = 0 WHERE product_id = 999;

-- Customer B waits for the lock, then updates
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 999;

-- Result: quantity = -1, oversold inventory!
-- Warehouse can't fulfil order, customer complaints
