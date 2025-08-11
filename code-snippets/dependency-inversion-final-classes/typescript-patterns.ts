/**
 * TypeScript Implementation: Dependency Inversion with Modern Patterns
 * 
 * Key TypeScript features used:
 * - Readonly classes (similar to PHP final classes)
 * - Union types for flexible testing
 * - Branded types for type safety
 * - Discriminated unions for result types
 * - Template literal types for strong typing
 */

// Branded types for stronger type safety
type OrderId = number & { readonly __brand: 'OrderId' };
type CustomerId = number & { readonly __brand: 'CustomerId' };
type Money = number & { readonly __brand: 'Money' };

// Helper functions for branded types
const createOrderId = (id: number): OrderId => {
  if (id <= 0) throw new Error('Order ID must be positive');
  return id as OrderId;
};

const createCustomerId = (id: number): CustomerId => {
  if (id <= 0) throw new Error('Customer ID must be positive');
  return id as CustomerId;
};

const createMoney = (amount: number): Money => {
  if (amount < 0) throw new Error('Amount cannot be negative');
  return amount as Money;
};

// Enums for type safety
enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

enum CustomerType {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  VIP = 'vip',
}

// Result types using discriminated unions
type ValidationResult = 
  | { success: true; data: OrderData }
  | { success: false; errors: string[] };

type ProcessingResult = 
  | { success: true; orderId: OrderId }
  | { success: false; errors: string[] };

type PaymentResult = 
  | { success: true; transactionId: string }
  | { success: false; error: string };

// Data structures
interface OrderData {
  readonly customerId: CustomerId;
  readonly amount: Money;
  readonly paymentMethod: string;
  readonly customerEmail: string;
  readonly customerType: CustomerType;
}

interface Order extends OrderData {
  readonly id: OrderId;
  readonly status: OrderStatus;
  readonly createdAt: Date;
}

interface Payment {
  readonly amount: Money;
  readonly method: string;
}

// Abstract interfaces (contracts)
interface OrderValidator {
  validate(orderData: OrderData): ValidationResult;
}

interface TaxCalculator {
  calculateTax(amount: Money, customerType: CustomerType): Money;
}

interface OrderStorage {
  saveOrder(orderData: OrderData): Promise<OrderId>;
  updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<boolean>;
  findOrder(orderId: OrderId): Promise<Order | null>;
}

interface PaymentGateway {
  processPayment(payment: Payment): Promise<PaymentResult>;
}

interface NotificationService {
  sendOrderConfirmation(email: string, orderId: OrderId): Promise<boolean>;
}

/**
 * MAIN CLASS: Final-like class using readonly pattern
 * TypeScript doesn't have final classes, but readonly pattern achieves similar goals
 */
class OrderProcessor {
  constructor(
    private readonly validator: OrderValidator,
    private readonly taxCalculator: TaxCalculator,
    private readonly storage: OrderStorage,
    private readonly paymentGateway: PaymentGateway,
    private readonly notificationService: NotificationService
  ) {
    // Make the class immutable by freezing it
    Object.freeze(this);
  }

  async processOrder(orderData: OrderData): Promise<ProcessingResult> {
    // Validation
    const validationResult = this.validator.validate(orderData);
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    // Calculate tax
    const tax = this.taxCalculator.calculateTax(
      orderData.amount,
      orderData.customerType
    );
    const totalAmount = createMoney(orderData.amount + tax);

    try {
      // Save order
      const orderId = await this.storage.saveOrder(orderData);

      // Process payment
      const payment: Payment = {
        amount: totalAmount,
        method: orderData.paymentMethod,
      };

      const paymentResult = await this.paymentGateway.processPayment(payment);

      if (paymentResult.success) {
        await this.storage.updateOrderStatus(orderId, OrderStatus.PAID);
        await this.notificationService.sendOrderConfirmation(
          orderData.customerEmail,
          orderId
        );
        return { success: true, orderId };
      } else {
        await this.storage.updateOrderStatus(orderId, OrderStatus.FAILED);
        return { 
          success: false, 
          errors: [`Payment failed: ${paymentResult.error}`] 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        errors: [`Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      };
    }
  }
}

/**
 * Concrete Implementations
 */

// Readonly class for tax calculation
class StandardTaxCalculator implements TaxCalculator {
  private readonly taxRates = {
    [CustomerType.STANDARD]: 0.08,
    [CustomerType.PREMIUM]: 0.05,
    [CustomerType.VIP]: 0.03,
  } as const;

  constructor() {
    Object.freeze(this);
  }

  calculateTax(amount: Money, customerType: CustomerType): Money {
    const rate = this.taxRates[customerType];
    return createMoney(amount * rate);
  }
}

class BasicOrderValidator implements OrderValidator {
  constructor() {
    Object.freeze(this);
  }

  validate(orderData: OrderData): ValidationResult {
    const errors: string[] = [];

    if (orderData.customerId <= 0) {
      errors.push('Invalid customer ID');
    }

    if (orderData.amount <= 0) {
      errors.push('Amount must be positive');
    }

    if (!orderData.paymentMethod.trim()) {
      errors.push('Payment method required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.customerEmail)) {
      errors.push('Invalid email address');
    }

    return errors.length === 0
      ? { success: true, data: orderData }
      : { success: false, errors };
  }
}

/**
 * In-memory implementation for testing
 */
class InMemoryOrderStorage implements OrderStorage {
  private orders = new Map<OrderId, Order>();
  private nextId = 1;

  constructor() {
    Object.freeze(this);
  }

  async saveOrder(orderData: OrderData): Promise<OrderId> {
    const orderId = createOrderId(this.nextId++);
    const order: Order = {
      ...orderData,
      id: orderId,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
    };

    this.orders.set(orderId, order);
    return orderId;
  }

  async updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) return false;

    this.orders.set(orderId, { ...order, status });
    return true;
  }

  async findOrder(orderId: OrderId): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  getOrderCount(): number {
    return this.orders.size;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }
}

/**
 * External service implementations
 */
class StripePaymentGateway implements PaymentGateway {
  constructor(private readonly apiKey: string) {
    Object.freeze(this);
  }

  async processPayment(payment: Payment): Promise<PaymentResult> {
    // Simulate API call
    try {
      // In real implementation, this would call Stripe API
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        return {
          success: true,
          transactionId: `txn_${Date.now()}`,
        };
      } else {
        return {
          success: false,
          error: 'Card declined',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing error',
      };
    }
  }
}

class EmailNotificationService implements NotificationService {
  constructor(private readonly smtpConfig: { host: string; port: number }) {
    Object.freeze(this);
  }

  async sendOrderConfirmation(email: string, orderId: OrderId): Promise<boolean> {
    // Simulate email sending
    try {
      console.log(`Sending confirmation to ${email} for order ${orderId}`);
      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }
}

/**
 * TESTING PATTERNS: Union types for flexible testing
 */

// Union types allow mixing real and mock objects
type TestableOrderStorage = InMemoryOrderStorage | jest.Mocked<OrderStorage>;
type TestablePaymentGateway = StripePaymentGateway | jest.Mocked<PaymentGateway>;

/**
 * Test helper functions
 */
function createTestOrderData(): OrderData {
  return {
    customerId: createCustomerId(123),
    amount: createMoney(100.0),
    paymentMethod: 'credit_card',
    customerEmail: 'test@example.com',
    customerType: CustomerType.STANDARD,
  };
}

function createOrderProcessor(
  overrides: Partial<{
    validator: OrderValidator;
    taxCalculator: TaxCalculator;
    storage: OrderStorage;
    paymentGateway: PaymentGateway;
    notificationService: NotificationService;
  }> = {}
): OrderProcessor {
  const defaults = {
    validator: new BasicOrderValidator(),
    taxCalculator: new StandardTaxCalculator(),
    storage: new InMemoryOrderStorage(),
    paymentGateway: new StripePaymentGateway('test_key'),
    notificationService: new EmailNotificationService({ host: 'localhost', port: 587 }),
  };

  return new OrderProcessor(
    overrides.validator || defaults.validator,
    overrides.taxCalculator || defaults.taxCalculator,
    overrides.storage || defaults.storage,
    overrides.paymentGateway || defaults.paymentGateway,
    overrides.notificationService || defaults.notificationService
  );
}

/**
 * Example test cases showing pragmatic testing approach
 */

// Detroit School: Use real objects when possible
async function testWithRealObjects() {
  const storage = new InMemoryOrderStorage();
  const processor = createOrderProcessor({ storage });
  
  const orderData = createTestOrderData();
  const result = await processor.processOrder(orderData);

  if (result.success) {
    console.log('✓ Order processed successfully');
    console.log('✓ Order count:', storage.getOrderCount());
    
    const savedOrder = await storage.findOrder(result.orderId);
    console.log('✓ Order status:', savedOrder?.status);
  } else {
    console.log('✗ Order processing failed:', result.errors);
  }
}

// London School: Mock for interaction testing
async function testWithMocks() {
  const mockPaymentGateway: jest.Mocked<PaymentGateway> = {
    processPayment: jest.fn(),
  };

  const mockNotificationService: jest.Mocked<NotificationService> = {
    sendOrderConfirmation: jest.fn(),
  };

  mockPaymentGateway.processPayment.mockResolvedValue({
    success: true,
    transactionId: 'test_txn_123',
  });

  mockNotificationService.sendOrderConfirmation.mockResolvedValue(true);

  const processor = createOrderProcessor({
    paymentGateway: mockPaymentGateway,
    notificationService: mockNotificationService,
  });

  const orderData = createTestOrderData();
  const result = await processor.processOrder(orderData);

  if (result.success) {
    console.log('✓ Mocked order processed successfully');
    console.log('✓ Payment gateway called:', mockPaymentGateway.processPayment.mock.calls.length);
    console.log('✓ Notification sent:', mockNotificationService.sendOrderConfirmation.mock.calls.length);
  }
}

// Hybrid Approach: Mix real and mock objects
async function testHybridApproach() {
  const realStorage = new InMemoryOrderStorage();
  const mockPaymentGateway: jest.Mocked<PaymentGateway> = {
    processPayment: jest.fn().mockResolvedValue({
      success: true,
      transactionId: 'hybrid_txn_456',
    }),
  };

  const processor = createOrderProcessor({
    storage: realStorage,      // Real - fast and deterministic
    paymentGateway: mockPaymentGateway, // Mock - external service
  });

  const orderData = createTestOrderData();
  const result = await processor.processOrder(orderData);

  if (result.success) {
    console.log('✓ Hybrid test passed');
    console.log('✓ Real storage used, order count:', realStorage.getOrderCount());
    console.log('✓ Mock payment gateway called');
    
    const savedOrder = await realStorage.findOrder(result.orderId);
    console.log('✓ Real order status:', savedOrder?.status);
  }
}

/**
 * Advanced TypeScript patterns for dependency inversion
 */

// Generic factory pattern for creating processors with different configurations
type ProcessorConfig<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K];
};

function createConfigurableProcessor<TConfig extends {
  validator?: OrderValidator;
  taxCalculator?: TaxCalculator;
  storage?: OrderStorage;
  paymentGateway?: PaymentGateway;
  notificationService?: NotificationService;
}>(config: TConfig): OrderProcessor {
  return new OrderProcessor(
    config.validator || new BasicOrderValidator(),
    config.taxCalculator || new StandardTaxCalculator(),
    config.storage || new InMemoryOrderStorage(),
    config.paymentGateway || new StripePaymentGateway('default_key'),
    config.notificationService || new EmailNotificationService({ host: 'localhost', port: 587 })
  );
}

// Template literal types for strongly typed configurations
type Environment = 'development' | 'testing' | 'production';
type ServiceConfig<T extends Environment> = T extends 'testing'
  ? { useInMemoryStorage: true; mockExternalServices: true }
  : T extends 'development'
  ? { useInMemoryStorage: false; mockExternalServices: false; debugMode: true }
  : { useInMemoryStorage: false; mockExternalServices: false; optimizeForProduction: true };

function createEnvironmentSpecificProcessor<T extends Environment>(
  env: T,
  config: ServiceConfig<T>
): OrderProcessor {
  // Type-safe configuration based on environment
  if (env === 'testing') {
    return createConfigurableProcessor({
      storage: new InMemoryOrderStorage(),
      // Mock other services in testing
    });
  }
  
  // Production or development configuration
  return createConfigurableProcessor({
    // Real implementations
  });
}

export {
  OrderProcessor,
  StandardTaxCalculator,
  BasicOrderValidator,
  InMemoryOrderStorage,
  StripePaymentGateway,
  EmailNotificationService,
  createTestOrderData,
  createOrderProcessor,
  createConfigurableProcessor,
  testWithRealObjects,
  testWithMocks,
  testHybridApproach,
};

export type {
  OrderId,
  CustomerId,
  Money,
  OrderData,
  Order,
  ValidationResult,
  ProcessingResult,
  PaymentResult,
  OrderValidator,
  TaxCalculator,
  OrderStorage,
  PaymentGateway,
  NotificationService,
  TestableOrderStorage,
  TestablePaymentGateway,
};