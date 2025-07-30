<?php
// Interface-First Design Patterns - GOOD Examples

// GOOD: Always define interfaces first, make classes final
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function save(User $user): void;
    public function findByEmail(string $email): ?User;
}

interface EmailServiceInterface
{
    public function send(string $to, string $subject, string $body): bool;
    public function sendTemplate(string $to, string $template, array $data): bool;
}

interface PasswordHasherInterface
{
    public function hash(string $password): string;
    public function verify(string $password, string $hash): bool;
}

// GOOD: Final classes that implement interfaces
final readonly class DatabaseUserRepository implements UserRepositoryInterface
{
    public function __construct(
        private PDO $connection
    ) {}

    public function findById(int $id): ?User
    {
        // Real database implementation
        $stmt = $this->connection->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $data ? User::fromArray($data) : null;
    }

    public function save(User $user): void
    {
        // Real save implementation
        $stmt = $this->connection->prepare(
            'INSERT OR REPLACE INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $user->getId(),
            $user->getEmail(),
            $user->getPasswordHash(),
            $user->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->connection->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $data ? User::fromArray($data) : null;
    }
}

final readonly class SmtpEmailService implements EmailServiceInterface
{
    public function __construct(
        private string $smtpHost,
        private int $smtpPort,
        private string $username,
        private string $password
    ) {}

    public function send(string $to, string $subject, string $body): bool
    {
        // Real SMTP implementation
        return mail($to, $subject, $body);
    }

    public function sendTemplate(string $to, string $template, array $data): bool
    {
        // Real template rendering and sending
        $body = $this->renderTemplate($template, $data);
        return $this->send($to, "Template: {$template}", $body);
    }

    private function renderTemplate(string $template, array $data): string
    {
        // Simple template rendering logic
        return str_replace(
            array_map(fn($key) => "{{$key}}", array_keys($data)),
            array_values($data),
            file_get_contents("templates/{$template}.html")
        );
    }
}

final readonly class BcryptPasswordHasher implements PasswordHasherInterface
{
    public function hash(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    public function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}

// Business service that depends on interfaces, not concrete classes
final readonly class UserRegistrationService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private EmailServiceInterface $emailService,
        private PasswordHasherInterface $passwordHasher
    ) {}

    public function registerUser(string $email, string $password): User
    {
        // Check if user already exists
        if ($this->userRepository->findByEmail($email) !== null) {
            throw new UserAlreadyExistsException("User with email {$email} already exists");
        }

        // Create new user with hashed password
        $hashedPassword = $this->passwordHasher->hash($password);
        $user = new User(
            id: null, // Will be assigned by repository
            email: $email,
            passwordHash: $hashedPassword,
            createdAt: new DateTimeImmutable()
        );

        // Save user
        $this->userRepository->save($user);

        // Send welcome email
        $this->emailService->sendTemplate($email, 'welcome', [
            'email' => $email,
            'welcome_message' => 'Welcome to our platform!'
        ]);

        return $user;
    }
}

// TESTING: Mock interfaces, never concrete classes
use PHPUnit\Framework\TestCase;

class UserRegistrationServiceTest extends TestCase
{
    public function testRegisterUserSuccess(): void
    {
        // GOOD: Mock only the interfaces, not the concrete classes
        $userRepository = $this->createMock(UserRepositoryInterface::class);
        $emailService = $this->createMock(EmailServiceInterface::class);
        $passwordHasher = $this->createMock(PasswordHasherInterface::class);

        // Configure mock behaviors
        $userRepository->method('findByEmail')->willReturn(null); // User doesn't exist
        $userRepository->expects($this->once())->method('save');
        
        $passwordHasher->method('hash')->willReturn('hashed_password_123');
        
        $emailService->expects($this->once())
            ->method('sendTemplate')
            ->with('test@example.com', 'welcome', $this->arrayHasKey('email'));

        // Create service with mocked interfaces
        $service = new UserRegistrationService(
            $userRepository,
            $emailService,
            $passwordHasher
        );

        // Test the registration logic
        $user = $service->registerUser('test@example.com', 'password123');

        $this->assertEquals('test@example.com', $user->getEmail());
        $this->assertEquals('hashed_password_123', $user->getPasswordHash());
    }

    public function testRegisterUserAlreadyExists(): void
    {
        $userRepository = $this->createMock(UserRepositoryInterface::class);
        $emailService = $this->createMock(EmailServiceInterface::class);
        $passwordHasher = $this->createMock(PasswordHasherInterface::class);

        // User already exists
        $existingUser = new User(1, 'test@example.com', 'existing_hash', new DateTimeImmutable());
        $userRepository->method('findByEmail')->willReturn($existingUser);

        $service = new UserRegistrationService(
            $userRepository,
            $emailService,
            $passwordHasher
        );

        $this->expectException(UserAlreadyExistsException::class);
        $service->registerUser('test@example.com', 'password123');
    }
}

// ANTI-PATTERN: Don't do this!
class BadUserRegistrationService
{
    // BAD: Depending on concrete classes
    public function __construct(
        private DatabaseUserRepository $userRepository,  // Concrete class!
        private SmtpEmailService $emailService,          // Concrete class!
        private BcryptPasswordHasher $passwordHasher     // Concrete class!
    ) {}

    // This is hard to test because you can't mock final classes easily
    // and you're coupled to specific implementations
}

class BadUserRegistrationServiceTest extends TestCase
{
    public function testBadExample(): void
    {
        // BAD: Can't easily mock final classes
        // Would need dg/bypass-finals or similar tools
        // Tests become brittle and slow (hitting real database, SMTP, etc.)
        
        $this->markTestSkipped('This approach makes testing difficult');
    }
}

// Value object - should NEVER be mocked
final readonly class User
{
    public function __construct(
        private ?int $id,
        private string $email,
        private string $passwordHash,
        private DateTimeImmutable $createdAt
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'],
            email: $data['email'],
            passwordHash: $data['password_hash'],
            createdAt: new DateTimeImmutable($data['created_at'])
        );
    }
}

// Custom exceptions
class UserAlreadyExistsException extends Exception {}
class ValidationException extends Exception {}