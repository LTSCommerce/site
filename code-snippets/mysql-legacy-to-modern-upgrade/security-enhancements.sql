-- MySQL 8.4 Security Enhancements
-- Comprehensive security hardening for production environments

-- 1. Transparent Data Encryption (TDE)
-- Enable encryption for tablespaces
CREATE TABLESPACE encrypted_space 
ADD DATAFILE 'encrypted_space.ibd' 
ENCRYPTION = 'Y';

-- Create encrypted table
CREATE TABLE sensitive_customer_data (
    id INT PRIMARY KEY,
    customer_id INT,
    credit_card_hash VARCHAR(255),
    ssn_encrypted VARBINARY(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) TABLESPACE = encrypted_space;

-- Enable binary log encryption
SET GLOBAL binlog_encryption = ON;

-- Check encryption status
SELECT 
    TABLESPACE_NAME,
    ENCRYPTION
FROM information_schema.INNODB_TABLESPACES
WHERE ENCRYPTION = 'Y';

-- 2. Role-Based Access Control
-- Create application roles
CREATE ROLE 'app_read_only';
CREATE ROLE 'app_read_write';
CREATE ROLE 'app_admin';
CREATE ROLE 'report_viewer';

-- Grant permissions to roles
GRANT SELECT ON ecommerce.* TO 'app_read_only';

GRANT SELECT, INSERT, UPDATE, DELETE ON ecommerce.customers TO 'app_read_write';
GRANT SELECT, INSERT, UPDATE, DELETE ON ecommerce.orders TO 'app_read_write';
GRANT SELECT, INSERT, UPDATE, DELETE ON ecommerce.products TO 'app_read_write';

GRANT ALL PRIVILEGES ON ecommerce.* TO 'app_admin';
GRANT CREATE, DROP, ALTER ON ecommerce.* TO 'app_admin';

-- Grant read-only access for reporting
GRANT SELECT ON ecommerce.orders TO 'report_viewer';
GRANT SELECT ON ecommerce.customers TO 'report_viewer';

-- Create users and assign roles
CREATE USER 'app_user'@'%' IDENTIFIED BY 'SecureP@ssw0rd123!';
GRANT 'app_read_write' TO 'app_user'@'%';
SET DEFAULT ROLE 'app_read_write' TO 'app_user'@'%';

CREATE USER 'report_user'@'%' IDENTIFIED BY 'Rep0rt$ecure456!';
GRANT 'report_viewer' TO 'report_user'@'%';
SET DEFAULT ROLE 'report_viewer' TO 'report_user'@'%';

-- 3. Password Validation Component
-- Install password validation plugin
INSTALL COMPONENT 'file://component_validate_password';

-- Configure password policies
SET GLOBAL validate_password.length = 12;
SET GLOBAL validate_password.number_count = 2;
SET GLOBAL validate_password.special_char_count = 2;
SET GLOBAL validate_password.mixed_case_count = 2;
SET GLOBAL validate_password.policy = STRONG;

-- Check password validation settings
SHOW VARIABLES LIKE 'validate_password%';

-- 4. Connection Security
-- Require SSL for all connections
ALTER USER 'app_user'@'%' REQUIRE SSL;
ALTER USER 'report_user'@'%' REQUIRE SSL;

-- Create SSL certificates (run on server)
/*
mysql_ssl_rsa_setup --uid=mysql
*/

-- Check SSL status
SHOW VARIABLES LIKE '%ssl%';
SHOW STATUS LIKE '%ssl%';

-- 5. Audit Logging
-- Install audit log plugin (MySQL Enterprise)
/*
INSTALL PLUGIN audit_log SONAME 'audit_log.so';
SET GLOBAL audit_log_policy = ALL;
SET GLOBAL audit_log_format = JSON;
*/

-- Alternative: General query log for basic auditing
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/log/mysql/mysql-general.log';

-- Log specific events
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/log/mysql/mysql-slow.log';
SET GLOBAL long_query_time = 2;
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- 6. Firewall Rules (MySQL Enterprise)
/*
INSTALL PLUGIN mysql_firewall SONAME 'firewall.so';
SELECT install_firewall();

-- Create firewall user group
CALL mysql.sp_set_firewall_mode('app_user@%', 'RECORDING');
-- Run normal application queries to record patterns
CALL mysql.sp_set_firewall_mode('app_user@%', 'PROTECTING');
*/

-- 7. Data Masking and De-identification
-- Create masked views for sensitive data
CREATE VIEW customers_masked AS
SELECT 
    customers_id,
    customers_firstname,
    CONCAT(LEFT(customers_lastname, 1), REPEAT('*', LENGTH(customers_lastname) - 1)) as customers_lastname,
    CONCAT(LEFT(customers_email_address, 3), '***@', SUBSTRING_INDEX(customers_email_address, '@', -1)) as customers_email_address,
    CONCAT(REPEAT('*', LENGTH(customers_telephone) - 4), RIGHT(customers_telephone, 4)) as customers_telephone,
    customers_dob,
    date_account_created
FROM customers;

-- Grant access to masked view instead of original table
GRANT SELECT ON ecommerce.customers_masked TO 'report_viewer';

-- 8. Secure Configuration Variables
-- Disable dangerous features
SET GLOBAL local_infile = OFF;
SET GLOBAL skip_networking = OFF; -- Set to ON if only local connections needed
SET GLOBAL skip_show_database = ON;

-- Limit resource usage
SET GLOBAL max_connections = 500;
SET GLOBAL max_user_connections = 50;
SET GLOBAL max_queries_per_hour = 10000;
SET GLOBAL max_updates_per_hour = 5000;

-- 9. Connection Rate Limiting
-- Create user with connection limits
CREATE USER 'limited_user'@'%' 
IDENTIFIED BY 'StrongP@ssw0rd!' 
WITH MAX_QUERIES_PER_HOUR 100
     MAX_UPDATES_PER_HOUR 50
     MAX_CONNECTIONS_PER_HOUR 20
     MAX_USER_CONNECTIONS 5;

-- 10. Security Monitoring Queries
-- Monitor failed login attempts
SELECT 
    USER,
    HOST,
    CONNECTION_ID,
    PROCESSLIST_TIME,
    PROCESSLIST_STATE,
    PROCESSLIST_INFO
FROM performance_schema.threads t
JOIN information_schema.processlist p ON t.processlist_id = p.id
WHERE p.user NOT IN ('root', 'system user');

-- Monitor privilege escalation attempts
SELECT 
    EVENT_TIME,
    USER_HOST,
    THREAD_ID,
    SERVER_ID,
    COMMAND_TYPE,
    ARGUMENT
FROM mysql.general_log
WHERE argument LIKE '%GRANT%' OR argument LIKE '%CREATE USER%'
ORDER BY EVENT_TIME DESC;

-- 11. Database File Permissions
-- Ensure proper file system permissions (run as system admin)
/*
chown -R mysql:mysql /var/lib/mysql
chmod 750 /var/lib/mysql
chmod 640 /var/lib/mysql/*.frm
chmod 640 /var/lib/mysql/*.MYD
chmod 640 /var/lib/mysql/*.MYI
*/

-- 12. Backup Security
-- Create encrypted backup
/*
mysqldump --single-transaction \
  --flush-logs \
  --master-data=2 \
  --all-databases | \
  gpg --symmetric --cipher-algo AES256 > backup_encrypted.sql.gpg
*/

-- Verify backup integrity
/*
gpg --decrypt backup_encrypted.sql.gpg | mysql --dry-run
*/