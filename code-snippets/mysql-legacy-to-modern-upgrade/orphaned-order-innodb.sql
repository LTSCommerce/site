-- Modern MySQL 8: foreign keys prevent orphans
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE RESTRICT;  -- Prevents deletion if orders exist

-- Attempting to delete customer with orders
DELETE FROM customers WHERE customer_id = 5000;
-- ERROR 1451: Cannot delete or update a parent row: foreign key constraint fails

-- For GDPR compliance: cascade delete when appropriate
ALTER TABLE customer_personal_data
ADD CONSTRAINT fk_personal_customer
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE CASCADE;  -- Personal data deleted with customer

-- For historical records: set NULL for archived data
ALTER TABLE orders
ADD CONSTRAINT fk_orders_customer_archived
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
ON DELETE SET NULL;  -- Preserves order history without customer
