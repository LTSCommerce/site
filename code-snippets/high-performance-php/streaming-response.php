<?php

declare(strict_types=1);

namespace App\Http;

use Generator;
use PDO;

final class StreamingResponse
{
    public function __construct(
        private readonly PDO $pdo,
    ) {
    }

    /**
     * Streams rows as newline-delimited JSON without buffering the full
     * result set in memory, using an unbuffered cursor.
     */
    public function streamQueryAsNdjson(string $sql): void
    {
        header('Content-Type: application/x-ndjson');
        header('X-Accel-Buffering: no');

        foreach ($this->fetchRows($sql) as $row) {
            echo json_encode($row, JSON_THROW_ON_ERROR), "\n";

            if (ob_get_level() > 0) {
                ob_flush();
            }

            flush();
        }
    }

    /**
     * Uses an unbuffered query so PDO fetches rows from the server as they
     * are consumed, rather than pulling the whole result set into memory
     * before the first row is available.
     *
     * @return Generator<int, array<string, mixed>>
     */
    private function fetchRows(string $sql): Generator
    {
        $wasBuffered = $this->pdo->getAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY);
        $this->pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);

        $stmt = $this->pdo->query($sql);

        while (($row = $stmt->fetch(PDO::FETCH_ASSOC)) !== false) {
            yield $row;
        }

        $this->pdo->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, $wasBuffered);
    }
}
