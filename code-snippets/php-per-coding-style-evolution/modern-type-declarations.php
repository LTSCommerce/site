// Union types (PHP 8.0+)
public function process(int|string $value): void {}

// Intersection types (PHP 8.1+)
public function handle(Countable&Traversable $items): void {}

// Complex compound types with proper formatting (DNF types, PHP 8.2+)
function normalise(
    array
    |(ArrayAccess&Countable) $input
): array|(ArrayAccess&Countable) {
    // Passes array through unchanged, or returns the countable
    // collection object as-is: same shape in, same shape out.
    return $input;
}
