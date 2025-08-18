-- MySQL Engine Migration: MyISAM to InnoDB
-- Systematic approach to convert storage engines with proper preparation

-- 1. Pre-migration checklist queries
-- Check current MySQL version and InnoDB support
SELECT VERSION() as mysql_version;
SHOW ENGINES;

-- Verify InnoDB configuration
SHOW VARIABLES LIKE 'innodb%buffer%pool%size';
SHOW VARIABLES LIKE 'innodb%log%file%size';

-- 2. Disable foreign key checks during migration
SET foreign_key_checks = 0;
SET unique_checks = 0;
SET autocommit = 0;

-- 3. Convert tables in dependency order (children first, then parents)

-- Convert child tables first
ALTER TABLE products_reviews ENGINE=InnoDB;
ALTER TABLE orders_products ENGINE=InnoDB;
ALTER TABLE customers_basket ENGINE=InnoDB;
ALTER TABLE customers_info ENGINE=InnoDB;

-- Convert parent tables
ALTER TABLE customers ENGINE=InnoDB;
ALTER TABLE orders ENGINE=InnoDB;
ALTER TABLE categories ENGINE=InnoDB;
ALTER TABLE products ENGINE=InnoDB;

-- 4. Re-enable checks
SET foreign_key_checks = 1;
SET unique_checks = 1;
SET autocommit = 1;

-- 5. Optimize tables after conversion
OPTIMIZE TABLE customers, orders, products, categories, 
               orders_products, products_reviews, 
               customers_basket, customers_info;

-- 6. Update MySQL configuration for InnoDB optimization
-- Add these to my.cnf:
/*
[mysqld]
# InnoDB Buffer Pool (75% of available RAM)
innodb_buffer_pool_size = 4G
innodb_buffer_pool_instances = 4

# InnoDB Log Files
innodb_log_file_size = 512M
innodb_log_buffer_size = 64M

# InnoDB Performance
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

# Reduce MyISAM memory usage
key_buffer_size = 32M
*/

-- 7. Verify successful conversion
SELECT 
    table_name,
    engine,
    table_rows,
    (data_length + index_length) / 1024 / 1024 AS size_mb
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
    AND table_name IN ('customers', 'orders', 'products', 'categories')
ORDER BY table_name;

-- 8. Check for conversion issues
-- Verify all tables are now InnoDB
SELECT table_name, engine
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
    AND engine != 'InnoDB'
    AND table_type = 'BASE TABLE';

-- 9. Performance comparison queries
-- Before/after query performance test
EXPLAIN SELECT 
    c.customers_firstname,
    c.customers_lastname,
    o.orders_id,
    o.date_purchased,
    SUM(op.products_price * op.products_quantity) as order_total
FROM customers c
JOIN orders o ON c.customers_id = o.customers_id
JOIN orders_products op ON o.orders_id = op.orders_id
WHERE o.date_purchased >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
GROUP BY c.customers_id, o.orders_id
ORDER BY order_total DESC
LIMIT 20;