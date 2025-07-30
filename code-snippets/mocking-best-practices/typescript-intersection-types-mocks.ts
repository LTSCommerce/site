// TypeScript Interface-First Design with Intersection Types for Mocks
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// GOOD: TypeScript uses I prefix for interfaces
interface IUserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<boolean>;
  sendTemplate(to: string, template: string, data: Record<string, any>): Promise<boolean>;
}

interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

// TypeScript DTO/Value Object - should NEVER be mocked
interface User {
  readonly id: number | null;
  readonly email: string;
  readonly passwordHash: string;
  readonly createdAt: Date;
}

// Business service that depends on interfaces
class UserRegistrationService {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private passwordHasher: IPasswordHasher
  ) {}

  async registerUser(email: string, password: string): Promise<User> {
    // Check if user already exists
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Create new user with hashed password
    const hashedPassword = await this.passwordHasher.hash(password);
    const user: User = {
      id: null, // Will be assigned by repository
      email,
      passwordHash: hashedPassword,
      createdAt: new Date()
    };

    // Save user
    await this.userRepository.save(user);

    // Send welcome email
    await this.emailService.sendTemplate(email, 'welcome', {
      email,
      welcomeMessage: 'Welcome to our platform!'
    });

    return user;
  }
}

describe('UserRegistrationService - TypeScript Intersection Types', () => {
  let service: UserRegistrationService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register user successfully using intersection types', async () => {
    // GOOD: Using intersection types to combine Mock<T> with interface
    // This gives you full type safety AND mock functionality
    const mockUserRepository: Mock<any> & IUserRepository = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      findByEmail: vi.fn().mockResolvedValue(null), // User doesn't exist
    };

    const mockEmailService: Mock<any> & IEmailService = {
      send: vi.fn(),
      sendTemplate: vi.fn().mockResolvedValue(true),
    };

    const mockPasswordHasher: Mock<any> & IPasswordHasher = {
      hash: vi.fn().mockResolvedValue('hashed_password_123'),
      verify: vi.fn(),
    };

    // Create service with properly typed mocks
    service = new UserRegistrationService(
      mockUserRepository,
      mockEmailService,
      mockPasswordHasher
    );

    // Test the registration logic
    const user = await service.registerUser('test@example.com', 'password123');

    // Assertions
    expect(user.email).toBe('test@example.com');
    expect(user.passwordHash).toBe('hashed_password_123');
    expect(user.createdAt).toBeInstanceOf(Date);
    
    // Verify interactions with full type safety
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        passwordHash: 'hashed_password_123'
      })
    );
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith('password123');
    expect(mockEmailService.sendTemplate).toHaveBeenCalledWith(
      'test@example.com',
      'welcome',
      expect.objectContaining({
        email: 'test@example.com'
      })
    );
  });

  it('should handle existing user error', async () => {
    const existingUser: User = {
      id: 1,
      email: 'test@example.com',
      passwordHash: 'existing_hash',
      createdAt: new Date()
    };

    // Mock returns existing user
    const mockUserRepository: Mock<any> & IUserRepository = {
      findById: vi.fn(),
      save: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue(existingUser),
    };

    const mockEmailService: Mock<any> & IEmailService = {
      send: vi.fn(),
      sendTemplate: vi.fn(),
    };

    const mockPasswordHasher: Mock<any> & IPasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };

    service = new UserRegistrationService(
      mockUserRepository,
      mockEmailService,
      mockPasswordHasher
    );

    // Should throw error for existing user
    await expect(
      service.registerUser('test@example.com', 'password123')
    ).rejects.toThrow('User with email test@example.com already exists');

    // Should not attempt to save or send email
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEmailService.sendTemplate).not.toHaveBeenCalled();
  });
});

// MODERN APPROACH: Using vi.Mocked<T> utility (RECOMMENDED)
describe('UserRegistrationService - Modern vi.Mocked<T>', () => {
  it('should work with vi.Mocked<T> utility', async () => {
    // BEST: Modern Vitest approach with vi.Mocked<T>
    const userRepository = {} as vi.Mocked<IUserRepository>;
    userRepository.findById = vi.fn();
    userRepository.save = vi.fn();
    userRepository.findByEmail = vi.fn().mockResolvedValue(null);

    const emailService = {} as vi.Mocked<IEmailService>;
    emailService.send = vi.fn();
    emailService.sendTemplate = vi.fn().mockResolvedValue(true);

    const passwordHasher = {} as vi.Mocked<IPasswordHasher>;
    passwordHasher.hash = vi.fn().mockResolvedValue('hashed_password_456');
    passwordHasher.verify = vi.fn();

    const service = new UserRegistrationService(
      userRepository,
      emailService,
      passwordHasher
    );

    const user = await service.registerUser('test2@example.com', 'secret123');

    expect(user.email).toBe('test2@example.com');
    expect(user.passwordHash).toBe('hashed_password_456');
    
    // Type-safe mock assertions
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test2@example.com');
    expect(passwordHasher.hash).toHaveBeenCalledWith('secret123');
  });
});

// ALTERNATIVE: satisfies approach for inline mock creation
describe('UserRegistrationService - satisfies approach', () => {
  it('should work with satisfies keyword', async () => {
    // GOOD: satisfies ensures type compliance without losing inference
    const userRepository = {
      findById: vi.fn(),
      save: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue(null),
    } satisfies IUserRepository;

    const emailService = {
      send: vi.fn(),
      sendTemplate: vi.fn().mockResolvedValue(true),
    } satisfies IEmailService;

    const passwordHasher = {
      hash: vi.fn().mockResolvedValue('hashed_password_789'),
      verify: vi.fn(),
    } satisfies IPasswordHasher;

    const service = new UserRegistrationService(
      userRepository,
      emailService,
      passwordHasher
    );

    const user = await service.registerUser('test3@example.com', 'secret789');

    expect(user.email).toBe('test3@example.com');
    expect(user.passwordHash).toBe('hashed_password_789');
    
    // Type-safe mock assertions
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test3@example.com');
    expect(passwordHasher.hash).toHaveBeenCalledWith('secret789');
  });
});

// ANTI-PATTERN: Don't use concrete classes in TypeScript either
class BadUserService {
  constructor(
    private userRepo: ConcreteUserRepository,    // BAD: Concrete class
    private emailSvc: ConcreteEmailService,      // BAD: Concrete class
    private hasher: ConcretePasswordHasher       // BAD: Concrete class
  ) {}
  
  // This makes testing difficult and couples you to specific implementations
}

// Example concrete classes (for demonstration of anti-pattern)
class ConcreteUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    // Real database logic
    throw new Error('Not implemented');
  }
  
  async save(user: User): Promise<void> {
    // Real save logic
    throw new Error('Not implemented');
  }
  
  async findByEmail(email: string): Promise<User | null> {
    // Real query logic
    throw new Error('Not implemented');
  }
}

class ConcreteEmailService implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<boolean> {
    // Real SMTP logic
    return false;
  }
  
  async sendTemplate(to: string, template: string, data: Record<string, any>): Promise<boolean> {
    // Real template rendering
    return false;
  }
}

class ConcretePasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    // Real bcrypt logic
    return '';
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    // Real verification
    return false;
  }
}