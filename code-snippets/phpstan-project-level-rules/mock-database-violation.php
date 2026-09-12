// ❌ VIOLATES RULE - Mocking critical database service
class UserRepositoryTest extends TestCase {
    public function testGetUser(): void {
        $mockDb = $this->createMock(DatabaseServiceInterface::class);  // PHPStan error!
        $mockDb->method('query')->willReturn(['id' => 1]);
        // False confidence - not testing real database behaviour
    }
}
