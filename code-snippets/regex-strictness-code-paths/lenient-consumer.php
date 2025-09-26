function processAttachment(string $dataUri): void {
    if (!preg_match(ATTACHMENT_REGEX, $dataUri)) {
        throw new InvalidArgumentException('Invalid data URI');
    }

    // Now what? Pattern matched, but what did we actually validate?

    // Must check: Does it have a MIME type?
    if (strpos($dataUri, 'data:;base64,') !== false) {
        // No MIME type - what do we do?
        $mimeType = 'application/octet-stream'; // Guess?
    } else {
        // Extract MIME type - but is it valid?
        preg_match('%data:([^;]+);%', $dataUri, $matches);
        $mimeType = $matches[1] ?? 'application/octet-stream';

        // Is it a valid MIME type format?
        if (!str_contains($mimeType, '/')) {
            // Invalid format - now what?
        }
    }

    // Must check: Is Base64 valid?
    $base64Data = substr($dataUri, strpos($dataUri, 'base64,') + 7);
    if (base64_decode($base64Data, true) === false) {
        // Invalid Base64 - should have been caught earlier
        throw new InvalidArgumentException('Invalid Base64 encoding');
    }

    // Must check: Are there parameters we need to handle?
    // Must check: Is the payload size reasonable?
    // Must check: ... and on and on
}