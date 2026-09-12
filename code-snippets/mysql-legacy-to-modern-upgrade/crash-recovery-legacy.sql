-- Legacy MyISAM: after an unexpected shutdown
-- Tables marked as crashed
SELECT table_name, table_comment
FROM information_schema.tables
WHERE engine = 'MyISAM' AND table_comment LIKE '%crashed%';

-- Manual repair required, and it can lose data
REPAIR TABLE orders;  -- Locks the table for the duration; large tables can take hours
-- Illustrative repair output - the exact figures vary by table:
-- Query OK, <rows_after> rows affected
-- Warning: Number of rows changed from <rows_before> to <rows_after>
-- Any shortfall between those two counts is data REPAIR TABLE could not recover

-- The application is effectively unavailable for the whole repair window,
-- and MyISAM gives no guarantee on how long that window will be
