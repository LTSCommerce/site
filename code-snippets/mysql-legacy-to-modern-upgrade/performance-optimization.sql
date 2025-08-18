-- MySQL 8.4 Performance Optimization
-- Advanced techniques for high-performance database operations

-- 1. Optimize InnoDB Buffer Pool
-- Check current buffer pool usage
SELECT 
    VARIABLE_NAME,
    VARIABLE_VALUE / 1024 / 1024 / 1024 AS value_gb
FROM performance_schema.global_status
WHERE VARIABLE_NAME LIKE 'Innodb_buffer_pool_%'
    AND VARIABLE_NAME IN (
        'Innodb_buffer_pool_pages_total',
        'Innodb_buffer_pool_pages_free',
        'Innodb_buffer_pool_pages_dirty'
    );

-- 2. Analyze Query Performance with Performance Schema
-- Enable query profiling
UPDATE performance_schema.setup_instruments 
SET ENABLED = 'YES', TIMED = 'YES' 
WHERE NAME LIKE '%statement/%';

-- Top slowest queries
SELECT 
    DIGEST_TEXT,
    COUNT_STAR as exec_count,
    AVG_TIMER_WAIT / 1000000000 as avg_seconds,
    MAX_TIMER_WAIT / 1000000000 as max_seconds,
    SUM_TIMER_WAIT / 1000000000 as total_seconds
FROM performance_schema.events_statements_summary_by_digest
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 10;

-- 3. Optimize Indexes with sys Schema
-- Find unused indexes
SELECT 
    object_schema,
    object_name,
    index_name,
    redundant_index_name
FROM sys.schema_redundant_indexes
WHERE object_schema = DATABASE();

-- Find tables with full table scans
SELECT 
    object_schema,
    object_name,
    rows_examined,
    rows_sent,
    exec_count
FROM sys.statement_analysis
WHERE object_schema = DATABASE()
    AND rows_examined > rows_sent * 10
ORDER BY rows_examined DESC;

-- 4. Implement Partitioning for Large Tables
-- Partition orders table by date range
ALTER TABLE orders 
PARTITION BY RANGE (YEAR(date_purchased)) (
    PARTITION p2020 VALUES LESS THAN (2021),
    PARTITION p2021 VALUES LESS THAN (2022),
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Query specific partition
SELECT * FROM orders PARTITION (p2024)
WHERE date_purchased >= '2024-01-01';

-- 5. Implement Read Replicas Configuration
-- Configure binary logging for replication
SET GLOBAL binlog_format = 'ROW';
SET GLOBAL sync_binlog = 1;
SET GLOBAL innodb_flush_log_at_trx_commit = 1;

-- Check replication status
SHOW MASTER STATUS;
SHOW SLAVE STATUS\G

-- 6. Advanced Caching Strategies
-- Query Cache optimization (MySQL 5.7 and earlier)
-- Note: Query Cache removed in MySQL 8.0, use application-level caching

-- Check InnoDB adaptive hash index
SHOW ENGINE INNODB STATUS\G

-- 7. Connection Pool Optimization
-- Monitor connection usage
SELECT 
    VARIABLE_NAME,
    VARIABLE_VALUE
FROM performance_schema.global_status
WHERE VARIABLE_NAME IN (
    'Threads_connected',
    'Threads_running',
    'Max_used_connections',
    'Connection_errors_max_connections'
);

-- Optimize connection settings
SET GLOBAL max_connections = 500;
SET GLOBAL interactive_timeout = 300;
SET GLOBAL wait_timeout = 300;

-- 8. Memory Usage Optimization
-- Check memory usage by component
SELECT 
    EVENT_NAME,
    CURRENT_NUMBER_OF_BYTES_USED / 1024 / 1024 as memory_mb
FROM performance_schema.memory_summary_global_by_event_name
WHERE CURRENT_NUMBER_OF_BYTES_USED > 0
ORDER BY CURRENT_NUMBER_OF_BYTES_USED DESC
LIMIT 20;

-- 9. I/O Performance Monitoring
-- Check file I/O statistics
SELECT 
    FILE_NAME,
    EVENT_NAME,
    COUNT_READ,
    COUNT_WRITE,
    SUM_TIMER_READ / 1000000000 as read_seconds,
    SUM_TIMER_WRITE / 1000000000 as write_seconds
FROM performance_schema.file_summary_by_instance
WHERE COUNT_READ > 0 OR COUNT_WRITE > 0
ORDER BY (SUM_TIMER_READ + SUM_TIMER_WRITE) DESC
LIMIT 10;

-- 10. Query Optimization Examples
-- Before: Inefficient subquery
/*
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.customers_id = c.customers_id
    AND o.date_purchased >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
);
*/

-- After: Optimized with JOIN
SELECT DISTINCT c.*
FROM customers c
INNER JOIN orders o ON c.customers_id = o.customers_id
WHERE o.date_purchased >= DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- 11. Batch Operations for Better Performance
-- Efficient batch inserts
INSERT INTO products (products_name, products_price, categories_id) VALUES
('Product 1', 19.99, 1),
('Product 2', 29.99, 1),
('Product 3', 39.99, 2),
('Product 4', 49.99, 2);

-- Efficient batch updates
UPDATE products 
SET products_status = 1 
WHERE products_id IN (1, 2, 3, 4, 5);

-- 12. Monitoring Queries
-- Real-time performance monitoring query
SELECT 
    p.ID,
    p.USER,
    p.DB,
    p.COMMAND,
    p.TIME,
    p.STATE,
    LEFT(p.INFO, 100) as QUERY
FROM information_schema.PROCESSLIST p
WHERE p.COMMAND != 'Sleep'
    AND p.USER != 'system user'
ORDER BY p.TIME DESC;