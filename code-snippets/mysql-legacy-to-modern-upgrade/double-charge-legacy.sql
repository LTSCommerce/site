-- Legacy MyISAM: no transaction support
-- Step 1: deduct from customer balance (SUCCEEDS)
UPDATE customer_accounts
SET balance = balance - 500.00
WHERE customer_id = 1234;

-- Step 2: create order record (SERVER CRASHES HERE)
INSERT INTO orders (customer_id, amount, status)
VALUES (1234, 500.00, 'pending');

-- Step 3: update inventory (NEVER EXECUTES)
UPDATE inventory
SET quantity = quantity - 1
WHERE product_id = 5678;

-- Result: customer charged $500, no order created, inventory not updated
-- Customer service nightmare: "Where's my order? You took my money!"
