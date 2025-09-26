function process(string $value, ?string $mimeType): void {
    if (empty($value)) {
        handleEmpty();
    } else {
        if ($mimeType === null) {
            handleValueWithoutMime($value);
        } else {
            handleValueWithMime($value, $mimeType);
        }
    }
}