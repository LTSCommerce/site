// ✅ PASSES RULE - Test-specific table name
class OrderTest extends TestCase {
    public function testCreateOrder(): void {
        $result = $this->db->query('SELECT * FROM test_orders WHERE id = ?', [1]);
        // Isolated from production schema changes
    }
}
