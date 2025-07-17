<?php

class CompressionMiddleware {
    private $minSize = 1024;
    private $supportedEncodings = ['gzip', 'deflate'];
    
    public function handle(Request $request, callable $next): Response {
        $response = $next($request);
        
        // Check if compression is supported
        $acceptEncoding = $request->getHeader('Accept-Encoding');
        $encoding = $this->getBestEncoding($acceptEncoding);
        
        if (!$encoding || strlen($response->getBody()) < $this->minSize) {
            return $response;
        }
        
        // Compress response
        $compressed = $this->compress($response->getBody(), $encoding);
        
        return $response
            ->withBody($compressed)
            ->withHeader('Content-Encoding', $encoding)
            ->withHeader('Content-Length', strlen($compressed));
    }
    
    private function getBestEncoding(string $acceptEncoding): ?string {
        foreach ($this->supportedEncodings as $encoding) {
            if (strpos($acceptEncoding, $encoding) !== false) {
                return $encoding;
            }
        }
        return null;
    }
    
    private function compress(string $data, string $encoding): string {
        switch ($encoding) {
            case 'gzip':
                return gzencode($data, 6);
            case 'deflate':
                return gzcompress($data, 6);
            default:
                return $data;
        }
    }
}