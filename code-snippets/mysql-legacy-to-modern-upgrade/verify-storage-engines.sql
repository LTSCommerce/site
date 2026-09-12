-- Confirm all tables use InnoDB
SELECT table_name, engine
FROM information_schema.tables
WHERE table_schema = DATABASE()
    AND engine != 'InnoDB';
