function processAttachment(string $attachment): void {
    if (!preg_match(ATTACHMENT_REGEX, $attachment, $matches)) {
        throw new InvalidArgumentException('Invalid attachment format');
    }

    // Extract all data from named capture groups in one pass
    $filename = $matches['filename'];
    $mimeType = $matches['mime'];
    $base64Data = $matches['data'];

    // Decode and save
    $decoded = base64_decode($base64Data);
    saveAttachment($filename, $decoded, $mimeType);
}