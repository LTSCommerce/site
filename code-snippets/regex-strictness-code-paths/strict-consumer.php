function processAttachment(string $dataUri): void {
    if (!preg_match(DATA_URI_REGEX, $dataUri)) {
        throw new InvalidArgumentException('Invalid data URI');
    }

    // Pattern matched - we KNOW it's valid
    // Extract MIME type (guaranteed to exist)
    preg_match('%^data:([^;]+);base64,%', $dataUri, $matches);
    $mimeType = $matches[1];

    // Extract Base64 data (we KNOW it's valid)
    $base64Data = substr($dataUri, strpos($dataUri, 'base64,') + 7);
    $decoded = base64_decode($base64Data);

    // Process the attachment
    saveAttachment($decoded, $mimeType);
}