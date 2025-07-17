<?php

declare(strict_types=1);

namespace App\Database\Backup;

use PDO;
use Exception;

final class HotBackupManager 
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly string $backupPath
    ) {}
    
    public function createIncrementalBackup(): void 
    {
        // Get current binary log position
        $sql = "SHOW MASTER STATUS";
        $status = $this->pdo->query($sql)->fetch();
        
        $backupInfo = [
            'timestamp' => date('Y-m-d H:i:s'),
            'log_file' => $status['File'],
            'log_position' => $status['Position'],
            'type' => 'incremental'
        ];
        
        // Create backup using xtrabackup
        $command = sprintf(
            'xtrabackup --backup --target-dir=%s --incremental-basedir=%s',
            $this->backupPath . '/incremental_' . date('Y-m-d_H-i-s'),
            $this->getLastFullBackup()
        );
        
        exec($command, $output, $returnCode);
        
        if ($returnCode !== 0) {
            throw new Exception('Backup failed: ' . implode("\n", $output));
        }
        
        // Save backup metadata
        file_put_contents(
            $this->backupPath . '/backup_info.json',
            json_encode($backupInfo)
        );
    }
    
    public function createFullBackup(): void 
    {
        $backupDir = $this->backupPath . '/full_' . date('Y-m-d_H-i-s');
        
        $command = sprintf(
            'xtrabackup --backup --target-dir=%s',
            $backupDir
        );
        
        exec($command, $output, $returnCode);
        
        if ($returnCode !== 0) {
            throw new Exception('Full backup failed: ' . implode("\n", $output));
        }
        
        // Prepare the backup
        $prepareCommand = sprintf('xtrabackup --prepare --target-dir=%s', $backupDir);
        exec($prepareCommand);
    }
    
    private function getLastFullBackup(): string 
    {
        $backups = glob($this->backupPath . '/full_*');
        if (empty($backups)) {
            throw new Exception('No full backup found');
        }
        
        // Sort by modification time, get the latest
        usort($backups, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });
        
        return $backups[0];
    }
}