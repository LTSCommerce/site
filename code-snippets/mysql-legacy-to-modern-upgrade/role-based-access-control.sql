-- Create roles
CREATE ROLE 'app_read', 'app_write', 'app_admin';

-- Grant permissions to roles
GRANT SELECT ON mydb.* TO 'app_read';
GRANT INSERT, UPDATE, DELETE ON mydb.* TO 'app_write';
GRANT ALL ON mydb.* TO 'app_admin';

-- Assign roles to users
GRANT 'app_read' TO 'reader_user'@'localhost';
GRANT 'app_read', 'app_write' TO 'app_user'@'localhost';
