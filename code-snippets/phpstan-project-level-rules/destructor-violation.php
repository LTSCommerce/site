// ❌ VIOLATES RULE - I/O work in destructor
class Logger {
    public function __destruct() {
        $this->fileHandle->flush();  // PHPStan error!
        fclose($this->fileHandle);   // Unpredictable timing
    }
}
