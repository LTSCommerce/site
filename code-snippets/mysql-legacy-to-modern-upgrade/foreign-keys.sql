-- Implementing Proper Foreign Key Constraints
-- Convert implied relationships to explicit foreign keys with appropriate cascading

-- 1. Add foreign keys for customer relationships
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_customers 
FOREIGN KEY (customers_id) REFERENCES customers(customers_id) 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE customers_info 
ADD CONSTRAINT fk_customers_info_customers 
FOREIGN KEY (customers_info_id) REFERENCES customers(customers_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Add foreign keys for product relationships
ALTER TABLE products 
ADD CONSTRAINT fk_products_categories 
FOREIGN KEY (categories_id) REFERENCES categories(categories_id) 
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE orders_products 
ADD CONSTRAINT fk_orders_products_orders 
FOREIGN KEY (orders_id) REFERENCES orders(orders_id) 
ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_orders_products_products 
FOREIGN KEY (products_id) REFERENCES products(products_id) 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3. Add foreign keys for review system
ALTER TABLE products_reviews 
ADD CONSTRAINT fk_reviews_products 
FOREIGN KEY (products_id) REFERENCES products(products_id) 
ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_reviews_customers 
FOREIGN KEY (customers_id) REFERENCES customers(customers_id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Add foreign keys for shopping cart
ALTER TABLE customers_basket 
ADD CONSTRAINT fk_basket_customers 
FOREIGN KEY (customers_id) REFERENCES customers(customers_id) 
ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_basket_products 
FOREIGN KEY (products_id) REFERENCES products(products_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Check constraint examples (MySQL 8.0.16+)
-- Ensure order quantities are positive
ALTER TABLE orders_products 
ADD CONSTRAINT chk_quantity_positive 
CHECK (products_quantity > 0);

-- Ensure product prices are non-negative
ALTER TABLE products 
ADD CONSTRAINT chk_price_non_negative 
CHECK (products_price >= 0);

-- Ensure valid email formats
ALTER TABLE customers 
ADD CONSTRAINT chk_email_format 
CHECK (customers_email_address REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');

-- 6. Create indexes to support foreign keys
-- MySQL automatically creates indexes for foreign key columns,
-- but we can optimize with composite indexes

CREATE INDEX idx_orders_customer_date 
ON orders (customers_id, date_purchased);

CREATE INDEX idx_products_category_status 
ON products (categories_id, products_status);

CREATE INDEX idx_orders_products_order_product 
ON orders_products (orders_id, products_id);

-- 7. Verify foreign key constraints
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    DELETE_RULE,
    UPDATE_RULE
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
    AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- 8. Test constraint enforcement
-- These should fail with foreign key constraint violations:

-- INSERT INTO orders (customers_id, date_purchased) 
-- VALUES (99999, NOW()); -- Non-existent customer

-- INSERT INTO orders_products (orders_id, products_id, products_quantity) 
-- VALUES (99999, 1, 1); -- Non-existent order

-- DELETE FROM customers WHERE customers_id = 1; -- Should be restricted

-- 9. Handle constraint violations gracefully
-- Enable proper error handling in application code
SHOW VARIABLES LIKE 'sql_mode';

-- Set strict mode for better data integrity
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- 10. Monitor constraint violations
-- Create a log table for tracking constraint violations
CREATE TABLE constraint_violations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(64),
    constraint_name VARCHAR(64),
    violation_type ENUM('INSERT', 'UPDATE', 'DELETE'),
    attempted_values JSON,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);