// Mocking Guidelines: When to mock and when not to mock

// ✅ GOOD: Mock external dependencies and side effects
export class GoodMockingExamples {
  // Mock HTTP clients - external network calls
  static mockHttpClient() {
    const httpClient = {
      get: vi.fn().mockResolvedValue({ data: { userId: 123 } }),
      post: vi.fn().mockResolvedValue({ status: 201 }),
    };
    return httpClient;
  }

  // Mock database connections - external systems
  static mockDatabase() {
    const database = {
      query: vi.fn().mockResolvedValue([{ id: 1, name: 'Test User' }]),
      transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(); // Simple transaction mock
      }),
    };
    return database;
  }

  // Mock file system operations - side effects
  static mockFileSystem() {
    const fs = {
      readFile: vi.fn().mockResolvedValue('file content'),
      writeFile: vi.fn().mockResolvedValue(undefined),
      exists: vi.fn().mockReturnValue(true),
    };
    return fs;
  }

  // Mock third-party services - external APIs
  static mockPaymentGateway() {
    const paymentGateway = {
      charge: vi.fn().mockResolvedValue({
        success: true,
        transactionId: 'tx_123',
        amount: 1000
      }),
    };
    return paymentGateway;
  }
}

// ❌ BAD: Don't mock these things
export class BadMockingExamples {
  // DON'T mock pure functions - test them directly!
  static dontMockPureFunctions() {
    // BAD - mocking a pure calculation
    const calculator = {
      add: vi.fn().mockReturnValue(5), // Why mock this?
      multiply: vi.fn().mockReturnValue(10),
    };
    
    // GOOD - use the real implementation
    const realCalculator = new Calculator();
    expect(realCalculator.add(2, 3)).toBe(5);
  }

  // DON'T mock value objects - they're data, not behavior
  static dontMockValueObjects() {
    // BAD - mocking a simple data structure
    const mockUser = {
      getName: vi.fn().mockReturnValue('John'),
      getEmail: vi.fn().mockReturnValue('john@example.com'),
    };

    // GOOD - create real value objects
    const user = new User('John', 'john@example.com');
    expect(user.getName()).toBe('John');
  }

  // DON'T mock internal business logic - test it!
  static dontMockBusinessLogic() {
    // BAD - mocking the very logic you want to test
    const orderService = {
      calculateDiscount: vi.fn().mockReturnValue(10),
      applyTax: vi.fn().mockReturnValue(108),
      validateOrder: vi.fn().mockReturnValue(true),
    };

    // GOOD - test the real business logic
    const realOrderService = new OrderService();
    const order = { items: [{ price: 100, quantity: 1 }], discountCode: 'SAVE10' };
    const result = realOrderService.calculateTotal(order);
    expect(result.discount).toBe(10);
  }

  // DON'T mock everything in a collaborator - be selective
  static dontOverMockCollaborators() {
    // BAD - mocking every method, even pure ones
    const userService = {
      findById: vi.fn(),
      validateEmail: vi.fn(), // Pure function - don't mock!
      hashPassword: vi.fn(),  // Pure function - don't mock!
      saveUser: vi.fn(),      // Database call - OK to mock
      sendWelcomeEmail: vi.fn(), // External service - OK to mock
    };

    // GOOD - mock only external dependencies
    const userRepository = { save: vi.fn(), findById: vi.fn() };
    const emailService = { send: vi.fn() };
    const realUserService = new UserService(userRepository, emailService);
  }
}

// Mocking Decision Tree
export const MockingDecisionTree = {
  shouldMock(dependency: any): boolean {
    // External system (database, API, file system)?
    if (this.isExternalSystem(dependency)) return true;
    
    // Has side effects (logging, messaging, notifications)?
    if (this.hasSideEffects(dependency)) return true;
    
    // Slow or expensive to create?
    if (this.isSlowOrExpensive(dependency)) return true;
    
    // Non-deterministic (random, time-based)?
    if (this.isNonDeterministic(dependency)) return true;
    
    // Otherwise, use the real implementation
    return false;
  },

  isExternalSystem(dependency: any): boolean {
    const externalIndicators = [
      'client', 'gateway', 'api', 'repository', 
      'database', 'cache', 'queue', 'storage'
    ];
    const name = dependency.constructor?.name?.toLowerCase() || '';
    return externalIndicators.some(indicator => name.includes(indicator));
  },

  hasSideEffects(dependency: any): boolean {
    const sideEffectIndicators = [
      'logger', 'mailer', 'notifier', 'publisher',
      'tracker', 'monitor', 'reporter'
    ];
    const name = dependency.constructor?.name?.toLowerCase() || '';
    return sideEffectIndicators.some(indicator => name.includes(indicator));
  },

  isSlowOrExpensive(dependency: any): boolean {
    // Check for expensive operations
    const expensiveIndicators = [
      'processor', 'generator', 'builder', 'compiler'
    ];
    const name = dependency.constructor?.name?.toLowerCase() || '';
    return expensiveIndicators.some(indicator => name.includes(indicator));
  },

  isNonDeterministic(dependency: any): boolean {
    const nonDeterministicIndicators = [
      'random', 'uuid', 'timestamp', 'clock', 'timer'
    ];
    const name = dependency.constructor?.name?.toLowerCase() || '';
    return nonDeterministicIndicators.some(indicator => name.includes(indicator));
  }
};

// Example usage in tests
export class SmartMockingTest {
  static createTestSubject() {
    // Only mock what needs mocking
    const httpClient = vi.fn(); // External - mock it
    const database = vi.fn();   // External - mock it
    const logger = vi.fn();     // Side effect - mock it
    
    // Use real implementations for business logic
    const calculator = new PriceCalculator();
    const validator = new OrderValidator();
    const formatter = new CurrencyFormatter();

    return new OrderService(
      httpClient,
      database,
      logger,
      calculator,  // Real implementation
      validator,   // Real implementation  
      formatter    // Real implementation
    );
  }
}

// Hot Sauce Principle: A little goes a long way
export const HotSaucePrinciple = {
  // Like hot sauce, mocks should enhance the test, not overpower it
  // Too much mocking makes tests inedible (unmaintainable)
  
  tooLittleMocking: 'Tests are slow, flaky, or coupled to external systems',
  justRightMocking: 'Tests are fast, reliable, and focus on behavior',
  tooMuchMocking: 'Tests are brittle, unclear, and test implementation details',
  
  advice: [
    'Mock external dependencies and side effects',
    'Use real implementations for business logic',
    'Prefer test doubles over complex mocks',
    'Focus on testing outcomes, not implementation',
    'If your test is mostly mocks, reconsider your architecture'
  ]
};