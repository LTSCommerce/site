<?php

class StreamingResponse {
    private $callback;
    private $headers = [];
    
    public function __construct(callable $callback) {
        $this->callback = $callback;
    }
    
    public function setHeader(string $name, string $value): void {
        $this->headers[$name] = $value;
    }
    
    public function send(): void {
        // Send headers
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        
        // Disable output buffering
        if (ob_get_level()) {
            ob_end_clean();
        }
        
        // Send content in chunks
        ($this->callback)();
    }
}

// Usage for large data sets
function streamLargeDataset(): void {
    $response = new StreamingResponse(function() {
        echo "[\n";
        
        $first = true;
        foreach (getLargeDataset() as $item) {
            if (!$first) {
                echo ",\n";
            }
            echo json_encode($item);
            $first = false;
            
            // Flush output buffer
            flush();
        }
        
        echo "\n]";
    });
    
    $response->setHeader('Content-Type', 'application/json');
    $response->send();
}