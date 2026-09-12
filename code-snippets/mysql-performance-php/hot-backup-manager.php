<?php

declare(strict_types=1);

namespace App\Database\Backup;

use Exception;
use PDO;
use Symfony\Component\Process\Process;

final class HotBackupManager
{
    public function __construct(
        private readonly PDO $pdo,
        private readonly string $backupPath
    ) {
    }

    public function createIncrementalBackup(): void
    {
        // Get current binary log position
        $sql    = 'SHOW MASTER STATUS';
        $status = $this->pdo->query($sql)->fetch();

        $backupInfo = [
            'timestamp'    => date('Y-m-d H:i:s'),
            'log_file'     => $status['File'],
            'log_position' => $status['Position'],
            'type'         => 'incremental',
        ];

        // Symfony Process takes an argument array, so there is no shell
        // string to construct and nothing to escape.
        $process = new Process([
            'xtrabackup',
            '--backup',
            '--target-dir=' . $this->backupPath . '/incremental_' . date('Y-m-d_H-i-s'),
            '--incremental-basedir=' . $this->getLastFullBackup(),
        ]);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new Exception('Backup failed: ' . $process->getErrorOutput());
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

        $process = new Process(['xtrabackup', '--backup', '--target-dir=' . $backupDir]);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new Exception('Full backup failed: ' . $process->getErrorOutput());
        }

        // Prepare the backup
        $prepareProcess = new Process(['xtrabackup', '--prepare', '--target-dir=' . $backupDir]);
        $prepareProcess->run();
    }

    private function getLastFullBackup(): string
    {
        $backups = glob($this->backupPath . '/full_*');
        if (empty($backups)) {
            throw new Exception('No full backup found');
        }

        // Sort by modification time, get the latest
        usort($backups, function ($a, $b) {
            return filemtime($b) - filemtime($a);
        });

        return $backups[0];
    }
}
