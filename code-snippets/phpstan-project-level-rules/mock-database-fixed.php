// ✅ PASSES RULE - Real database integration test
class UserRepositoryTest extends TestCase {
    private DatabaseServiceInterface $db;

    protected function setUp(): void {
        $this->db = new TestDatabaseService();  // Real test database
        $this->db->beginTransaction();
    }

    public function testGetUser(): void {
        // Test against real database - catches transaction issues, etc.
    }
}
