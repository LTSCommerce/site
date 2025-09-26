function processAttachment(string $dataUri): void {
    if (!preg_match(DATA_URI_REGEX, $dataUri, $matches)) {
        throw new InvalidArgumentException('Invalid data URI');
    }

    // Extract directly from named capture groups
    $mimeType = $matches['mime'];
    $base64Data = $matches['data'];

    // Decode and process
    $decoded = base64_decode($base64Data);
    saveAttachment($decoded, $mimeType);
}