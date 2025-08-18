-- Modern MySQL 8.4 Features Implementation
-- Leverage cutting-edge capabilities for enhanced functionality

-- 1. JSON Column Implementation
-- Add structured product attributes
ALTER TABLE products 
ADD COLUMN attributes JSON,
ADD COLUMN specifications JSON;

-- Example: Insert JSON product data
UPDATE products 
SET attributes = JSON_OBJECT(
    'weight', '2.5kg',
    'dimensions', JSON_OBJECT('length', 30, 'width', 20, 'height', 15),
    'colors', JSON_ARRAY('red', 'blue', 'green'),
    'features', JSON_ARRAY('waterproof', 'durable', 'lightweight')
),
specifications = JSON_OBJECT(
    'material', 'aluminum',
    'warranty', '2 years',
    'certifications', JSON_ARRAY('ISO9001', 'CE'),
    'technical_specs', JSON_OBJECT(
        'power_consumption', '150W',
        'operating_temperature', '-10°C to +50°C'
    )
)
WHERE products_id = 1;

-- Query JSON data
SELECT 
    products_name,
    JSON_EXTRACT(attributes, '$.weight') as weight,
    JSON_EXTRACT(attributes, '$.colors') as available_colors,
    JSON_EXTRACT(specifications, '$.technical_specs.power_consumption') as power
FROM products 
WHERE JSON_CONTAINS(attributes->'$.colors', '"blue"');

-- 2. Window Functions for Analytics
-- Calculate running totals and rankings
SELECT 
    customers_id,
    orders_id,
    date_purchased,
    order_total,
    SUM(order_total) OVER (
        PARTITION BY customers_id 
        ORDER BY date_purchased 
        ROWS UNBOUNDED PRECEDING
    ) as running_total,
    ROW_NUMBER() OVER (
        PARTITION BY customers_id 
        ORDER BY order_total DESC
    ) as order_rank,
    LAG(order_total) OVER (
        PARTITION BY customers_id 
        ORDER BY date_purchased
    ) as previous_order_total
FROM (
    SELECT 
        o.customers_id,
        o.orders_id,
        o.date_purchased,
        SUM(op.products_price * op.products_quantity) as order_total
    FROM orders o
    JOIN orders_products op ON o.orders_id = op.orders_id
    GROUP BY o.customers_id, o.orders_id, o.date_purchased
) order_totals;

-- 3. Common Table Expressions (CTEs)
-- Complex hierarchical category queries
WITH RECURSIVE category_hierarchy AS (
    -- Base case: top-level categories
    SELECT 
        categories_id,
        categories_name,
        parent_id,
        0 as level,
        CAST(categories_name AS CHAR(1000)) as path
    FROM categories 
    WHERE parent_id IS NULL OR parent_id = 0
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT 
        c.categories_id,
        c.categories_name,
        c.parent_id,
        ch.level + 1,
        CONCAT(ch.path, ' > ', c.categories_name)
    FROM categories c
    JOIN category_hierarchy ch ON c.parent_id = ch.categories_id
)
SELECT 
    categories_id,
    CONCAT(REPEAT('  ', level), categories_name) as indented_name,
    level,
    path
FROM category_hierarchy
ORDER BY path;

-- 4. Generated (Computed) Columns
-- Add computed columns for common calculations
ALTER TABLE products 
ADD COLUMN price_with_tax DECIMAL(15,2) AS (products_price * 1.20) STORED,
ADD COLUMN price_category ENUM('budget', 'mid-range', 'premium') AS (
    CASE 
        WHEN products_price < 50 THEN 'budget'
        WHEN products_price < 200 THEN 'mid-range'
        ELSE 'premium'
    END
) VIRTUAL;

-- 5. Invisible Indexes (MySQL 8.0+)
-- Create indexes that optimizer can ignore for testing
CREATE INDEX idx_products_price_invisible ON products (products_price) INVISIBLE;

-- Make visible after testing
ALTER TABLE products ALTER INDEX idx_products_price_invisible VISIBLE;

-- 6. Instant DDL (MySQL 8.0+)
-- Add columns without table rebuild
ALTER TABLE customers 
ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en',
ADD COLUMN marketing_consent BOOLEAN DEFAULT FALSE,
ALGORITHM=INSTANT;

-- 7. Histogram Statistics for Better Query Optimization
-- Analyze data distribution for query optimizer
ANALYZE TABLE products UPDATE HISTOGRAM ON products_price, categories_id;
ANALYZE TABLE orders UPDATE HISTOGRAM ON date_purchased;

-- View histogram information
SELECT 
    SCHEMA_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    HISTOGRAM
FROM information_schema.COLUMN_STATISTICS
WHERE SCHEMA_NAME = DATABASE();

-- 8. MySQL Clone Plugin Usage
-- Clone database for testing/staging
-- Note: Requires BACKUP_ADMIN privilege and plugin installation
/*
INSTALL PLUGIN clone SONAME 'mysql_clone.so';
CLONE LOCAL DATA DIRECTORY = '/var/mysql/clone_dir';
*/

-- 9. Multi-Valued Indexes for JSON Arrays
-- Optimize queries on JSON array elements
ALTER TABLE products 
ADD INDEX idx_product_colors ((CAST(attributes->'$.colors' AS CHAR(255) ARRAY)));

-- Query optimization for JSON arrays
SELECT products_name, attributes->'$.colors'
FROM products 
WHERE JSON_OVERLAPS(attributes->'$.colors', '["red", "blue"]');

-- 10. Resource Groups (MySQL 8.0+ Enterprise)
-- Manage resource allocation for different workloads
/*
CREATE RESOURCE GROUP batch_jobs
    TYPE = SYSTEM
    VCPU = 2-3
    THREAD_PRIORITY = -20;

CREATE RESOURCE GROUP user_queries
    TYPE = USER
    VCPU = 0-1
    THREAD_PRIORITY = 0;
*/

-- 11. Functional Indexes
-- Index on expressions for complex queries
CREATE INDEX idx_customer_email_domain 
ON customers ((SUBSTRING_INDEX(customers_email_address, '@', -1)));

-- Query using functional index
SELECT * FROM customers 
WHERE SUBSTRING_INDEX(customers_email_address, '@', -1) = 'gmail.com';