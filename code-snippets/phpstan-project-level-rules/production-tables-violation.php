// ❌ VIOLATES RULE - Production table name in test
class OrderTest extends TestCase {
    public function testCreateOrder(): void {
        $result = $this->db->query('SELECT * FROM orders WHERE id = ?', [1]);  // PHPStan error!
        // Coupled to production schema
    }
}
