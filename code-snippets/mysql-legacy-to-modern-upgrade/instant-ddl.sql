-- Add a column instantly (no table rebuild)
ALTER TABLE large_table
ADD COLUMN new_field VARCHAR(100) DEFAULT NULL,
ALGORITHM=INSTANT;

-- Operations that support the INSTANT algorithm:
-- - Adding a column (with restrictions), MySQL 8.0.12+
-- - Renaming a column, MySQL 8.0+
-- - Setting/dropping column default values, MySQL 8.0+
-- - Dropping a column, MySQL 8.0.29+
