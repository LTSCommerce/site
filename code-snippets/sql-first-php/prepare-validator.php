<?php

// Trimmed from tests/Support/ServerSidePrepareValidator.php

final readonly class ServerSidePrepareValidator
{
    public function __construct(private PDO $pdo)
    {
        // With emulated prepares, prepare() never reaches the server and this check would pass
        // for any SQL at all. Refuse such a connection rather than prove nothing.
        if (false !== (bool)$pdo->getAttribute(PDO::ATTR_EMULATE_PREPARES)) {
            throw new LogicException('Needs a PDO with ATTR_EMULATE_PREPARES off.');
        }
    }

    /** @param array<string, string> $statements class => SQL */
    public function validate(array $statements): array
    {
        $failures = [];
        foreach ($statements as $class => $sql) {
            try {
                $this->pdo->prepare($sql);   // parsed and resolved by MySQL, not executed
            } catch (PDOException $e) {
                $failures[] = $class . '::SQL does not prepare: ' . $e->getMessage();
            }
        }

        return $failures;                    // every failure, not just the first
    }
}
