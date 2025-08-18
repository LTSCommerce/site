<?php
/**
 * MySQL Legacy to Modern Migration Script
 * Comprehensive PHP script to orchestrate MySQL 8.4 upgrade process
 */

declare(strict_types=1);

class MySQLMigrationManager
{
    private PDO $pdo;
    private array $config;
    private array $migrationLog = [];
    
    public function __construct(array $config)
    {
        $this->config = $config;
        $this->connectDatabase();
    }
    
    private function connectDatabase(): void
    {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            $this->config['host'],
            $this->config['port'],
            $this->config['database']
        );
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $this->pdo = new PDO($dsn, $this->config['username'], $this->config['password'], $options);
    }
    
    /**
     * Perform complete database assessment
     */
    public function assessDatabase(): array
    {
        $assessment = [
            'tables' => $this->inventoryTables(),
            'orphaned_records' => $this->findOrphanedRecords(),
            'duplicates' => $this->findDuplicateRecords(),
            'implied_relationships' => $this->analyzeImpliedRelationships(),
            'integrity_issues' => $this->checkDataIntegrity()
        ];
        
        $this->logMigration('Assessment completed', $assessment);
        return $assessment;
    }
    
    private function inventoryTables(): array
    {
        $query = "
            SELECT 
                table_name,
                engine,
                table_rows,
                data_length,
                index_length,
                (data_length + index_length) / 1024 / 1024 AS size_mb
            FROM information_schema.tables 
            WHERE table_schema = DATABASE()
                AND table_type = 'BASE TABLE'
            ORDER BY size_mb DESC
        ";
        
        return $this->pdo->query($query)->fetchAll();
    }
    
    private function findOrphanedRecords(): array
    {
        $orphaned = [];
        
        // Check common relationships in osCommerce
        $checks = [
            'products_without_categories' => "
                SELECT COUNT(*) as count FROM products p
                LEFT JOIN categories c ON p.categories_id = c.categories_id
                WHERE c.categories_id IS NULL
            ",
            'orders_without_customers' => "
                SELECT COUNT(*) as count FROM orders o
                LEFT JOIN customers c ON o.customers_id = c.customers_id
                WHERE c.customers_id IS NULL
            ",
            'reviews_without_products' => "
                SELECT COUNT(*) as count FROM products_reviews pr
                LEFT JOIN products p ON pr.products_id = p.products_id
                WHERE p.products_id IS NULL
            "
        ];
        
        foreach ($checks as $name => $query) {
            try {
                $result = $this->pdo->query($query)->fetch();
                $orphaned[$name] = $result['count'] ?? 0;
            } catch (PDOException $e) {
                $orphaned[$name] = "Table doesn't exist or query failed: " . $e->getMessage();
            }
        }
        
        return $orphaned;
    }
    
    private function findDuplicateRecords(): array
    {
        $duplicates = [];
        
        $checks = [
            'duplicate_customers' => "
                SELECT COUNT(*) as count FROM (
                    SELECT customers_email_address
                    FROM customers 
                    GROUP BY customers_email_address 
                    HAVING COUNT(*) > 1
                ) d
            ",
            'duplicate_products' => "
                SELECT COUNT(*) as count FROM (
                    SELECT products_model
                    FROM products 
                    WHERE products_model IS NOT NULL AND products_model != ''
                    GROUP BY products_model 
                    HAVING COUNT(*) > 1
                ) d
            "
        ];
        
        foreach ($checks as $name => $query) {
            try {
                $result = $this->pdo->query($query)->fetch();
                $duplicates[$name] = $result['count'] ?? 0;
            } catch (PDOException $e) {
                $duplicates[$name] = "Query failed: " . $e->getMessage();
            }
        }
        
        return $duplicates;
    }
    
    private function analyzeImpliedRelationships(): array
    {
        $query = "
            SELECT 
                table_name,
                column_name,
                data_type,
                is_nullable
            FROM information_schema.columns 
            WHERE table_schema = DATABASE() 
                AND column_name REGEXP '_id$|^fk_|parent_'
            ORDER BY table_name, column_name
        ";
        
        return $this->pdo->query($query)->fetchAll();
    }
    
    private function checkDataIntegrity(): array
    {
        $issues = [];
        
        // Check for tables without primary keys
        $query = "
            SELECT table_name
            FROM information_schema.tables t
            LEFT JOIN information_schema.statistics s 
                ON t.table_name = s.table_name 
                AND s.index_name = 'PRIMARY'
                AND s.table_schema = t.table_schema
            WHERE t.table_schema = DATABASE() 
                AND s.index_name IS NULL
                AND t.table_type = 'BASE TABLE'
        ";
        
        $noPrimaryKey = $this->pdo->query($query)->fetchAll(PDO::FETCH_COLUMN);
        $issues['tables_without_primary_keys'] = $noPrimaryKey;
        
        return $issues;
    }
    
    /**
     * Perform data cleanup before migration
     */
    public function cleanupData(): bool
    {
        try {
            $this->pdo->beginTransaction();
            
            // Create backup tables
            $this->createBackupTables();
            
            // Remove orphaned records
            $this->removeOrphanedRecords();
            
            // Resolve duplicates
            $this->resolveDuplicates();
            
            // Fix data consistency issues
            $this->fixDataConsistency();
            
            $this->pdo->commit();
            $this->logMigration('Data cleanup completed successfully');
            
            return true;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            $this->logMigration('Data cleanup failed: ' . $e->getMessage());
            
            return false;
        }
    }
    
    private function createBackupTables(): void
    {
        $tables = ['customers', 'orders', 'products', 'categories'];
        
        foreach ($tables as $table) {
            try {
                $this->pdo->exec("CREATE TABLE {$table}_backup AS SELECT * FROM {$table}");
                $this->logMigration("Backup created for table: {$table}");
            } catch (PDOException $e) {
                $this->logMigration("Backup creation failed for {$table}: " . $e->getMessage());
            }
        }
    }
    
    private function removeOrphanedRecords(): void
    {
        $cleanupQueries = [
            "DELETE pr FROM products_reviews pr
             LEFT JOIN products p ON pr.products_id = p.products_id
             WHERE p.products_id IS NULL",
            
            "DELETE op FROM orders_products op
             LEFT JOIN orders o ON op.orders_id = o.orders_id
             WHERE o.orders_id IS NULL",
            
            "DELETE cb FROM customers_basket cb
             LEFT JOIN customers c ON cb.customers_id = c.customers_id
             WHERE c.customers_id IS NULL"
        ];
        
        foreach ($cleanupQueries as $query) {
            try {
                $stmt = $this->pdo->exec($query);
                $this->logMigration("Orphaned records cleanup query executed. Rows affected: {$stmt}");
            } catch (PDOException $e) {
                $this->logMigration("Cleanup query failed: " . $e->getMessage());
            }
        }
    }
    
    private function resolveDuplicates(): void
    {
        // Handle duplicate customers (keep most recent)
        $query = "
            DELETE c1 FROM customers c1
            INNER JOIN customers c2 
            WHERE c1.customers_email_address = c2.customers_email_address
                AND c1.customers_id < c2.customers_id
        ";
        
        try {
            $affectedRows = $this->pdo->exec($query);
            $this->logMigration("Duplicate customers resolved. Rows deleted: {$affectedRows}");
        } catch (PDOException $e) {
            $this->logMigration("Duplicate resolution failed: " . $e->getMessage());
        }
    }
    
    private function fixDataConsistency(): void
    {
        // Normalize phone numbers
        $this->pdo->exec("
            UPDATE customers 
            SET customers_telephone = REGEXP_REPLACE(customers_telephone, '[^0-9]', '')
            WHERE customers_telephone IS NOT NULL
        ");
        
        // Fix invalid dates
        $this->pdo->exec("
            UPDATE customers 
            SET customers_dob = NULL 
            WHERE customers_dob = '0000-00-00' OR customers_dob = '1970-01-01'
        ");
        
        $this->logMigration("Data consistency fixes applied");
    }
    
    /**
     * Convert tables from MyISAM to InnoDB
     */
    public function convertStorageEngine(): bool
    {
        try {
            // Disable foreign key checks
            $this->pdo->exec("SET foreign_key_checks = 0");
            $this->pdo->exec("SET unique_checks = 0");
            $this->pdo->exec("SET autocommit = 0");
            
            $myisamTables = $this->getMyISAMTables();
            
            foreach ($myisamTables as $table) {
                $this->convertTableToInnoDB($table);
            }
            
            // Re-enable checks
            $this->pdo->exec("SET foreign_key_checks = 1");
            $this->pdo->exec("SET unique_checks = 1");
            $this->pdo->exec("SET autocommit = 1");
            
            $this->logMigration('All tables converted to InnoDB successfully');
            return true;
            
        } catch (Exception $e) {
            $this->logMigration('Storage engine conversion failed: ' . $e->getMessage());
            return false;
        }
    }
    
    private function getMyISAMTables(): array
    {
        $query = "
            SELECT table_name
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
                AND engine = 'MyISAM'
        ";
        
        return $this->pdo->query($query)->fetchAll(PDO::FETCH_COLUMN);
    }
    
    private function convertTableToInnoDB(string $tableName): void
    {
        try {
            $this->pdo->exec("ALTER TABLE `{$tableName}` ENGINE=InnoDB");
            $this->logMigration("Table {$tableName} converted to InnoDB");
            
            // Optimize table after conversion
            $this->pdo->exec("OPTIMIZE TABLE `{$tableName}`");
        } catch (PDOException $e) {
            $this->logMigration("Failed to convert {$tableName}: " . $e->getMessage());
        }
    }
    
    /**
     * Add foreign key constraints
     */
    public function addForeignKeys(): bool
    {
        try {
            $this->pdo->beginTransaction();
            
            $foreignKeys = $this->getForeignKeyDefinitions();
            
            foreach ($foreignKeys as $fk) {
                $this->addForeignKey($fk);
            }
            
            $this->pdo->commit();
            $this->logMigration('Foreign keys added successfully');
            
            return true;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            $this->logMigration('Foreign key creation failed: ' . $e->getMessage());
            
            return false;
        }
    }
    
    private function getForeignKeyDefinitions(): array
    {
        return [
            [
                'table' => 'orders',
                'constraint' => 'fk_orders_customers',
                'column' => 'customers_id',
                'references' => 'customers(customers_id)',
                'on_delete' => 'RESTRICT',
                'on_update' => 'CASCADE'
            ],
            [
                'table' => 'orders_products',
                'constraint' => 'fk_orders_products_orders',
                'column' => 'orders_id',
                'references' => 'orders(orders_id)',
                'on_delete' => 'CASCADE',
                'on_update' => 'CASCADE'
            ],
            [
                'table' => 'products_reviews',
                'constraint' => 'fk_reviews_products',
                'column' => 'products_id',
                'references' => 'products(products_id)',
                'on_delete' => 'CASCADE',
                'on_update' => 'CASCADE'
            ]
        ];
    }
    
    private function addForeignKey(array $fk): void
    {
        $sql = sprintf(
            "ALTER TABLE %s ADD CONSTRAINT %s FOREIGN KEY (%s) REFERENCES %s ON DELETE %s ON UPDATE %s",
            $fk['table'],
            $fk['constraint'],
            $fk['column'],
            $fk['references'],
            $fk['on_delete'],
            $fk['on_update']
        );
        
        try {
            $this->pdo->exec($sql);
            $this->logMigration("Foreign key {$fk['constraint']} added to {$fk['table']}");
        } catch (PDOException $e) {
            $this->logMigration("Failed to add foreign key {$fk['constraint']}: " . $e->getMessage());
        }
    }
    
    /**
     * Generate comprehensive migration report
     */
    public function generateReport(): array
    {
        return [
            'timestamp' => date('Y-m-d H:i:s'),
            'mysql_version' => $this->getMySQLVersion(),
            'migration_log' => $this->migrationLog,
            'final_assessment' => $this->assessDatabase()
        ];
    }
    
    private function getMySQLVersion(): string
    {
        return $this->pdo->query('SELECT VERSION()')->fetchColumn();
    }
    
    private function logMigration(string $message, array $data = []): void
    {
        $this->migrationLog[] = [
            'timestamp' => date('Y-m-d H:i:s'),
            'message' => $message,
            'data' => $data
        ];
    }
}

// Usage example
try {
    $config = [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'oscommerce',
        'username' => 'root',
        'password' => 'password'
    ];
    
    $migrator = new MySQLMigrationManager($config);
    
    echo "Starting MySQL Legacy to Modern Migration...\n";
    
    // Step 1: Assess current state
    echo "1. Assessing database...\n";
    $assessment = $migrator->assessDatabase();
    
    // Step 2: Clean up data
    echo "2. Cleaning up data...\n";
    if (!$migrator->cleanupData()) {
        throw new Exception('Data cleanup failed');
    }
    
    // Step 3: Convert storage engines
    echo "3. Converting to InnoDB...\n";
    if (!$migrator->convertStorageEngine()) {
        throw new Exception('Storage engine conversion failed');
    }
    
    // Step 4: Add foreign keys
    echo "4. Adding foreign keys...\n";
    if (!$migrator->addForeignKeys()) {
        throw new Exception('Foreign key creation failed');
    }
    
    // Step 5: Generate report
    echo "5. Generating migration report...\n";
    $report = $migrator->generateReport();
    
    file_put_contents('migration_report.json', json_encode($report, JSON_PRETTY_PRINT));
    echo "Migration completed successfully! Report saved to migration_report.json\n";
    
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>