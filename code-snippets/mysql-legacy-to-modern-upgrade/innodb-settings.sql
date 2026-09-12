-- Key InnoDB settings for production
SET GLOBAL innodb_buffer_pool_size = 2147483648;  -- 2GB, adjust based on RAM
SET GLOBAL innodb_log_file_size = 536870912;      -- 512MB
SET GLOBAL innodb_flush_log_at_trx_commit = 1;    -- Full ACID compliance
SET GLOBAL innodb_file_per_table = ON;            -- Separate files per table
