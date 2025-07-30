// Alternatives to mocking: Better architectural patterns

// 1. DEPENDENCY INJECTION - Makes testing easier without mocks
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

interface NotificationService {
  send(message: string): Promise<void>;
}

class OrderService {
  constructor(
    private paymentProcessor: PaymentProcessor,
    private notificationService: NotificationService
  ) {}

  async processOrder(order: Order): Promise<OrderResult> {
    // Business logic here - easy to test with real implementations
    const total = this.calculateTotal(order);
    const payment = await this.paymentProcessor.process(total);
    
    if (payment.success) {
      await this.notificationService.send(`Order ${order.id} confirmed`);
    }
    
    return { success: payment.success, orderId: order.id };
  }

  // Pure function - no mocking needed!
  private calculateTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}

// 2. TEST DOUBLES - Simple fake implementations
class FakePaymentProcessor implements PaymentProcessor {
  private shouldSucceed: boolean = true;

  async process(amount: number): Promise<PaymentResult> {
    // Deterministic behavior for testing
    if (amount <= 0) {
      return { success: false, error: 'Invalid amount' };
    }
    
    if (!this.shouldSucceed) {
      return { success: false, error: 'Payment declined' };
    }

    return { success: true, transactionId: `fake-tx-${Date.now()}` };
  }

  // Test helper methods
  setFailureMode(): void {
    this.shouldSucceed = false;
  }

  setSuccessMode(): void {
    this.shouldSucceed = true;
  }
}

class FakeNotificationService implements NotificationService {
  public sentMessages: string[] = [];

  async send(message: string): Promise<void> {
    // Capture behavior for verification without mocking
    this.sentMessages.push(message);
  }

  // Test helper methods
  getLastMessage(): string | undefined {
    return this.sentMessages[this.sentMessages.length - 1];
  }

  clear(): void {
    this.sentMessages = [];
  }
}

// 3. BUILDER PATTERN - Easy test data creation
class OrderBuilder {
  private order: Order = {
    id: '123',
    items: [],
    customerId: 'customer1'
  };

  withId(id: string): OrderBuilder {
    this.order.id = id;
    return this;
  }

  withItem(id: string, price: number, quantity: number = 1): OrderBuilder {
    this.order.items.push({ id, price, quantity });
    return this;
  }

  withCustomer(customerId: string): OrderBuilder {
    this.order.customerId = customerId;
    return this;
  }

  build(): Order {
    return { ...this.order };
  }
}

// 4. TESTING WITH REAL IMPLEMENTATIONS - No mocks needed!
describe('OrderService with Real Dependencies', () => {
  let orderService: OrderService;
  let fakePaymentProcessor: FakePaymentProcessor;
  let fakeNotificationService: FakeNotificationService;

  beforeEach(() => {
    fakePaymentProcessor = new FakePaymentProcessor();
    fakeNotificationService = new FakeNotificationService();
    orderService = new OrderService(fakePaymentProcessor, fakeNotificationService);
  });

  it('processes successful orders without mocks', async () => {
    // Arrange - use builder pattern for clean test data
    const order = new OrderBuilder()
      .withId('order-123')
      .withItem('item1', 50.00, 2)
      .withItem('item2', 25.00, 1)
      .withCustomer('customer-456')
      .build();

    // Act
    const result = await orderService.processOrder(order);

    // Assert - verify outcomes, not implementation details
    expect(result.success).toBe(true);
    expect(result.orderId).toBe('order-123');
    
    // Verify side effects through test double
    expect(fakeNotificationService.getLastMessage()).toBe('Order order-123 confirmed');
  });

  it('handles payment failures gracefully', async () => {
    // Arrange
    fakePaymentProcessor.setFailureMode();
    const order = new OrderBuilder()
      .withId('order-456')
      .withItem('item1', 100.00)
      .build();

    // Act
    const result = await orderService.processOrder(order);

    // Assert
    expect(result.success).toBe(false);
    expect(fakeNotificationService.sentMessages).toHaveLength(0); // No confirmation sent
  });
});

// 5. FUNCTIONAL APPROACH - Pure functions need no mocking
export const OrderCalculator = {
  calculateSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  applyDiscount(subtotal: number, discountPercent: number): number {
    return subtotal * (1 - discountPercent / 100);
  },

  calculateTax(amount: number, taxRate: number): number {
    return amount * (taxRate / 100);
  },

  calculateTotal(items: OrderItem[], discountPercent: number = 0, taxRate: number = 10): number {
    const subtotal = this.calculateSubtotal(items);
    const discounted = this.applyDiscount(subtotal, discountPercent);
    const tax = this.calculateTax(discounted, taxRate);
    return discounted + tax;
  }
};

// Testing pure functions - no mocks needed!
describe('OrderCalculator', () => {
  it('calculates totals correctly', () => {
    const items = [
      { id: 'item1', price: 100, quantity: 2 },
      { id: 'item2', price: 50, quantity: 1 }
    ];

    const total = OrderCalculator.calculateTotal(items, 10, 8.5); // 10% discount, 8.5% tax

    expect(total).toBeCloseTo(244.25, 2); // (200 + 50) * 0.9 * 1.085
  });
});