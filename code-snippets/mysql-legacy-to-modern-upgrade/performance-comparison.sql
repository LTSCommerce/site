-- Compare query performance
-- Before: table lock wait
SHOW STATUS LIKE 'Table_locks_waited';

-- After: row lock wait (should be much lower)
SHOW STATUS LIKE 'Innodb_row_lock_waits';
