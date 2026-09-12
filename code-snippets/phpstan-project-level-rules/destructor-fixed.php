// ✅ PASSES RULE - destructor is empty; cleanup happens in an explicit method
class FileLogger {
    private bool $closed = false;

    public function close(): void {
        fflush($this->handle);
        fclose($this->handle);
        $this->closed = true;
    }

    public function __destruct() {
        // Intentionally empty - the rule only allows destructors with
        // no statements. Callers must invoke close() explicitly.
    }
}
