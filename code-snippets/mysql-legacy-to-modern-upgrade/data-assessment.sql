-- MySQL Legacy Database Assessment Queries
-- Comprehensive analysis of existing MyISAM tables and data integrity issues

-- 1. Inventory all tables and their storage engines
SELECT 
    table_schema,
    table_name,
    engine,
    table_rows,
    data_length,
    index_length,
    (data_length + index_length) / 1024 / 1024 AS size_mb
FROM information_schema.tables 
WHERE table_schema NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
ORDER BY engine, size_mb DESC;

-- 2. Find orphaned records in common osCommerce tables
-- Example: Products without valid categories
SELECT 
    p.products_id,
    p.products_name,
    p.categories_id
FROM products p
LEFT JOIN categories c ON p.categories_id = c.categories_id
WHERE c.categories_id IS NULL;

-- Example: Orders without valid customers
SELECT 
    o.orders_id,
    o.customers_id,
    o.date_purchased
FROM orders o
LEFT JOIN customers c ON o.customers_id = c.customers_id
WHERE c.customers_id IS NULL;

-- 3. Identify duplicate records (common in legacy systems)
-- Find duplicate customers by email
SELECT 
    customers_email_address,
    COUNT(*) as duplicate_count,
    GROUP_CONCAT(customers_id) as customer_ids
FROM customers 
GROUP BY customers_email_address 
HAVING COUNT(*) > 1;

-- Find duplicate products by model
SELECT 
    products_model,
    COUNT(*) as duplicate_count,
    GROUP_CONCAT(products_id) as product_ids
FROM products 
WHERE products_model IS NOT NULL AND products_model != ''
GROUP BY products_model 
HAVING COUNT(*) > 1;

-- 4. Analyze table relationships and implied foreign keys
-- Check for common foreign key patterns in osCommerce
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = DATABASE() 
    AND column_name REGEXP '_id$|^fk_|parent_'
ORDER BY table_name, column_name;

-- 5. Identify tables with no primary keys (problematic for replication)
SELECT 
    table_name
FROM information_schema.tables t
LEFT JOIN information_schema.statistics s 
    ON t.table_name = s.table_name 
    AND s.index_name = 'PRIMARY'
WHERE t.table_schema = DATABASE() 
    AND s.index_name IS NULL;

-- 6. Check for MyISAM tables that need conversion
SELECT 
    table_name,
    table_rows,
    avg_row_length,
    (data_length + index_length) / 1024 / 1024 AS size_mb
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
    AND engine = 'MyISAM'
ORDER BY size_mb DESC;

-- 7. Analyze character set inconsistencies
SELECT 
    table_name,
    table_collation,
    COUNT(*) as column_count
FROM information_schema.tables t
JOIN information_schema.columns c USING (table_name, table_schema)
WHERE table_schema = DATABASE()
GROUP BY table_name, table_collation
ORDER BY table_name;