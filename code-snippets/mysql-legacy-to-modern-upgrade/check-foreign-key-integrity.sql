-- Test that foreign key constraints are working
-- This should fail if the constraint is active
INSERT INTO orders (customer_id, amount)
VALUES (99999, 100.00);  -- Non-existent customer
