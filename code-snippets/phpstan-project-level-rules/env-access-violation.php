// ❌ VIOLATES RULE - Direct environment access
class EmailService {
    public function send(): void {
        $apiKey = getenv('MAILGUN_API_KEY');  // PHPStan error!
        // Send email using $apiKey...
    }
}
