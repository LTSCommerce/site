-- Generate conversion statements for all MyISAM tables
SELECT CONCAT('ALTER TABLE ', table_name, ' ENGINE=InnoDB;') AS conversion_sql
FROM information_schema.tables
WHERE table_schema = DATABASE()
    AND engine = 'MyISAM'
ORDER BY table_rows ASC;  -- Convert smallest tables first
