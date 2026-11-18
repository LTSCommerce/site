<?php

declare(strict_types=1);

// Dummy example of the tombstone idea, used on the oldest codebase where
// there was no test suite for a tool like Rector to lean on.
//
// Access logs suggested this script was dead. Rather than delete it, the
// body is replaced with an exception, and the original is kept as a
// comment so that it can be restored if the code turns out to be live.

throw new TombstoneException('example-report-export.php: no hits in the log window, remove or restore');

/* ORIGINAL BODY KEPT FOR RESTORATION
$rows = $db->query('SELECT ...');
foreach ($rows as $row) {
    echo format_row($row);
}
*/
