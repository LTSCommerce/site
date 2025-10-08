<?php

declare(strict_types=1);

namespace App\Database;

use InvalidArgumentException;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Throwable;

/**
 * Efficiently updates a single column for multiple rows using CASE WHEN.
 * Accumulates changes and executes them in optimized bulk operations.
 */
final class BulkUpdateSingleColumn
{
    /**
     * SQL template for bulk update using CASE WHEN.
     */
    private const string SQL_BULK_UPDATE_TEMPLATE = 'UPDATE %s SET %s = CASE %s %s END WHERE %s IN (%s)';

    /**
     * SQL template for each CASE WHEN clause.
     */
    private const string SQL_CASE_WHEN_TEMPLATE = "WHEN '%s' THEN ?";

    /** @var array<string|int,scalar|null> */
    private array $idsToVals = [];
    private int $chunkSize = 5000;

    /**
     * @param DatabaseServiceInterface $dbService Database service with retry capability
     * @param string $table Table name
     * @param string $idColumnName Name of the ID column
     * @param string $updateColumnName Name of the column to update
     * @param string $extraWhereConditions Additional WHERE conditions
     * @param LoggerInterface|null $logger Logger for output
     */
    public function __construct(
        private readonly DatabaseServiceInterface $dbService,
        private readonly string $table,
        private readonly string $idColumnName,
        private readonly string $updateColumnName,
        private readonly string $extraWhereConditions = '',
        private readonly ?LoggerInterface $logger = null,
    ) {
    }

    public function __destruct()
    {
        // Ensure pending updates are flushed
        if ([] === $this->idsToVals) {
            return;
        }

        try {
            $this->runBulkUpdate();
        } catch (Throwable) {
            throw new RuntimeException(
                "BulkUpdateSingleColumn('{$this->table}.{$this->updateColumnName}') was destroyed with pending updates. " .
                'You must call runBulkUpdate() before destroying.'
            );
        }
    }

    /**
     * Add an ID and value pair to the update queue.
     * Automatically triggers bulk update when chunk size is reached.
     *
     * @param int|string $id The ID value
     * @param bool|float|int|string|null $val The value to set
     */
    public function addIdAndValue(int|string $id, bool|float|int|string|null $val): void
    {
        $this->idsToVals[$id] = $val;
        if (count($this->idsToVals) > $this->chunkSize) {
            $this->runBulkUpdate();
        }
    }

    /**
     * Execute the accumulated bulk update.
     */
    public function runBulkUpdate(): void
    {
        if ([] === $this->idsToVals) {
            return;
        }

        $this->logger?->info(
            'Running Bulk Update of ' . $this->table . '.' . $this->updateColumnName .
            ' on ' . count($this->idsToVals) . ' Rows'
        );

        $sql = $this->buildSql();
        $params = array_values($this->idsToVals);
        $start = microtime(true);

        $affectedRows = $this->dbService->execute($sql, $params);

        $this->logger?->info(
            'Bulk Update of ' . $this->table . '.' . $this->updateColumnName .
            ' updated ' . $affectedRows . ' rows in ' . (microtime(true) - $start) . ' seconds'
        );

        $this->idsToVals = [];
    }

    public function setChunkSize(int $chunkSize): void
    {
        $this->chunkSize = $chunkSize;
    }

    /**
     * Build the SQL statement for bulk update using CASE WHEN.
     */
    private function buildSql(): string
    {
        $caseWhenClauses = '';
        foreach ($this->idsToVals as $id => $val) {
            $caseWhenClauses .= ' ' . sprintf(self::SQL_CASE_WHEN_TEMPLATE, $id) . "\n";
        }

        $inClause = "'" . implode("','", array_keys($this->idsToVals)) . "'";

        $sql = sprintf(
            self::SQL_BULK_UPDATE_TEMPLATE,
            $this->table,
            $this->updateColumnName,
            $this->idColumnName,
            $caseWhenClauses,
            $this->idColumnName,
            $inClause
        );

        if ('' !== $this->extraWhereConditions) {
            if (!str_starts_with(strtolower(trim($this->extraWhereConditions)), 'and')) {
                throw new InvalidArgumentException('Extra where condition must start with an "AND"');
            }
            $sql .= $this->extraWhereConditions;
        }

        return $sql;
    }
}
