function process(string $value): void {
    if (empty($value)) {
        handleEmpty();
    } else {
        handleValue($value);
    }
}