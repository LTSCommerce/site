-- MySQL Legacy Data Cleanup Strategies
-- Automated approaches for resolving data integrity issues

-- 1. Remove orphaned records (CASCADE equivalent)
-- Clean up orphaned product reviews
DELETE pr FROM products_reviews pr
LEFT JOIN products p ON pr.products_id = p.products_id
WHERE p.products_id IS NULL;

-- Clean up orphaned order products
DELETE op FROM orders_products op
LEFT JOIN orders o ON op.orders_id = o.orders_id
WHERE o.orders_id IS NULL;

-- 2. Resolve duplicate customers (keep most recent)
-- Create temporary table with customers to keep
CREATE TEMPORARY TABLE customers_to_keep AS
SELECT customers_id
FROM customers c1
WHERE c1.customers_id = (
    SELECT MAX(c2.customers_id)
    FROM customers c2 
    WHERE c2.customers_email_address = c1.customers_email_address
);

-- Update foreign key references to point to kept customers
UPDATE orders o
JOIN customers c_old ON o.customers_id = c_old.customers_id
JOIN customers c_new ON c_old.customers_email_address = c_new.customers_email_address
SET o.customers_id = c_new.customers_id
WHERE c_new.customers_id IN (SELECT customers_id FROM customers_to_keep)
    AND c_old.customers_id NOT IN (SELECT customers_id FROM customers_to_keep);

-- Delete duplicate customers
DELETE c FROM customers c
WHERE c.customers_id NOT IN (SELECT customers_id FROM customers_to_keep);

-- 3. Handle missing primary keys
-- Add auto-increment primary key to tables that lack them
ALTER TABLE table_without_pk 
ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST;

-- 4. Standardize data formats
-- Fix inconsistent date formats
UPDATE customers 
SET customers_dob = STR_TO_DATE(customers_dob, '%m/%d/%Y')
WHERE customers_dob REGEXP '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$';

-- Normalize phone numbers
UPDATE customers 
SET customers_telephone = REGEXP_REPLACE(customers_telephone, '[^0-9]', '');

-- 5. Create backup before major changes
CREATE TABLE customers_backup AS SELECT * FROM customers;
CREATE TABLE orders_backup AS SELECT * FROM orders;
CREATE TABLE products_backup AS SELECT * FROM products;

-- 6. Validate data integrity before migration
-- Check that all foreign key relationships will be valid
SELECT 'orders -> customers' as relationship,
       COUNT(*) as invalid_count
FROM orders o
LEFT JOIN customers c ON o.customers_id = c.customers_id
WHERE c.customers_id IS NULL

UNION ALL

SELECT 'products -> categories' as relationship,
       COUNT(*) as invalid_count
FROM products p
LEFT JOIN categories cat ON p.categories_id = cat.categories_id
WHERE cat.categories_id IS NULL;

-- 7. Create staging tables for complex migrations
CREATE TABLE products_staging LIKE products;
ALTER TABLE products_staging ENGINE=InnoDB;

-- Copy data with transformations
INSERT INTO products_staging 
SELECT 
    products_id,
    products_name,
    products_model,
    COALESCE(categories_id, 1) as categories_id, -- Default category
    products_price,
    products_status,
    NOW() as created_date,
    NOW() as modified_date
FROM products;