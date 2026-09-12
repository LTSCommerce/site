-- Modern MySQL 8: automatic cascade updates
-- Define referential actions once
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer_cascade
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON UPDATE CASCADE;

ALTER TABLE invoices
ADD CONSTRAINT fk_invoices_customer_cascade
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON UPDATE CASCADE;

ALTER TABLE customer_addresses
ADD CONSTRAINT fk_addresses_customer_cascade
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON UPDATE CASCADE
ON DELETE CASCADE;  -- Addresses deleted with customer

-- Single update cascades everywhere
UPDATE customers SET customer_id = 9000 WHERE customer_id = 1000;
-- All related records automatically updated!

-- Verify cascade worked
SELECT 'orders' as table_name, COUNT(*) as updated_records
FROM orders WHERE customer_id = 9000
UNION ALL
SELECT 'invoices', COUNT(*)
FROM invoices WHERE customer_id = 9000
UNION ALL
SELECT 'addresses', COUNT(*)
FROM customer_addresses WHERE customer_id = 9000;
