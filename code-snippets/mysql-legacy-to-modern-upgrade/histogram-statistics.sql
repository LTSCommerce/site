-- Create a histogram for better statistics
ANALYZE TABLE orders UPDATE HISTOGRAM ON status;

-- View histogram information
SELECT * FROM information_schema.column_statistics
WHERE table_name = 'orders' AND column_name = 'status';
