-- Check which tables use MyISAM
SELECT
    table_name,
    engine,
    table_rows,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = DATABASE()
    AND engine = 'MyISAM'
ORDER BY size_mb DESC;
