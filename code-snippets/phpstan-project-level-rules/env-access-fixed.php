// ✅ PASSES RULE - Constructor injection
class EmailService {
    public function __construct(
        private readonly string $mailgunApiKey
    ) {}

    public function send(): void {
        // Use $this->mailgunApiKey - testable, explicit
    }
}
