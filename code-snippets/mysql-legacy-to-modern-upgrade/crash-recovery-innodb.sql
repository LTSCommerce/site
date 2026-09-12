-- Modern MySQL 8: automatic crash recovery
-- InnoDB uses write-ahead logging (redo logs)

-- After crash, automatic recovery on startup
-- MySQL error log shows:
-- InnoDB: Starting crash recovery
-- InnoDB: Reading redo log from checkpoint
-- InnoDB: Applying redo log records
-- InnoDB: Rollback of uncommitted transactions
-- InnoDB: Crash recovery completed - duration depends on redo log size

-- No data loss for committed transactions
SELECT COUNT(*) FROM orders;  -- All committed orders intact

-- Configure for faster recovery
SET GLOBAL innodb_fast_shutdown = 0;  -- Clean shutdown when possible
SET GLOBAL innodb_flush_log_at_trx_commit = 1;  -- Maximum durability
SET GLOBAL innodb_doublewrite = ON;  -- Prevent partial page writes

-- Point-in-time recovery with binary logs
-- Enable binary logging for full recovery capability
SET GLOBAL log_bin = ON;
SET GLOBAL binlog_format = 'ROW';

-- Recover to specific point before corruption
mysqlbinlog --stop-datetime="2024-12-01 10:00:00" \
    /var/log/mysql/binlog.000042 | mysql -u root -p
