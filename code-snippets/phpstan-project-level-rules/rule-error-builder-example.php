RuleErrorBuilder::message(
    'Query instantiation detected inside a loop. ' .
    'This creates N+1 query problems and severe performance degradation.'
)
    ->identifier('app.queryInLoop')
    ->line($node->getStartLine())
    ->tip(
        'Refactor to:' . PHP_EOL .
        '1. Build a list of IDs in the loop' . PHP_EOL .
        '2. Execute a single query with WHERE id IN (...)' . PHP_EOL .
        '3. Map results back to the original data' . PHP_EOL .
        'See: https://your-docs.example.com/performance/query-batching'
    )
    ->build()
