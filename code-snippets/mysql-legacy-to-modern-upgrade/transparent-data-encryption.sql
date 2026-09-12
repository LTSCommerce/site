-- Enable encryption for new tables
SET GLOBAL default_table_encryption=ON;

-- Encrypt an existing table
ALTER TABLE sensitive_data ENCRYPTION='Y';

-- Verify encryption status
SELECT table_name, create_options
FROM information_schema.tables
WHERE create_options LIKE '%ENCRYPTION%';
