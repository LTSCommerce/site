// GOOD: Minimal mocking focused on external dependencies and side effects
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../services/OrderService';
import { PaymentGateway } from '../services/PaymentGateway';
import { EmailService } from '../services/EmailService';
import { InventoryService } from '../services/InventoryService';
import { AuditLogger } from '../services/AuditLogger';

describe('OrderService - Minimal Mocking (GOOD)', () => {
  let orderService: OrderService;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process order successfully', async () => {
    // Mock only external dependencies and side effects
    const mockPaymentGateway = {
      processPayment: vi.fn().mockResolvedValue({ success: true, transactionId: 'tx123' }),
      validateCard: vi.fn().mockReturnValue(true),
      calculateFees: vi.fn().mockReturnValue(2.50),
      // formatAmount: NOT MOCKED - it's a pure function
    } as Partial<PaymentGateway> as PaymentGateway;

    const mockEmailService = {
      sendEmail: vi.fn().mockResolvedValue(true), // External service - mock it
      // formatTemplate: NOT MOCKED - it's internal logic we want to test
      // validateEmail: NOT MOCKED - it's a pure function
    } as Partial<EmailService> as EmailService;

    const mockInventoryService = {
      checkStock: vi.fn().mockResolvedValue(true),     // External system - mock it
      reserveItems: vi.fn().mockResolvedValue({ success: true }), // Side effect - mock it
      // calculatePrice: NOT MOCKED - business logic we want to test
      // applyDiscount: NOT MOCKED - business logic we want to test
    } as Partial<InventoryService> as InventoryService;

    const mockAuditLogger = {
      log: vi.fn(), // External logging - mock the side effect only
      // formatMessage: NOT MOCKED - formatting logic we want to test
    } as Partial<AuditLogger> as AuditLogger;

    orderService = new OrderService(
      mockPaymentGateway,
      mockEmailService,
      mockInventoryService,
      mockAuditLogger
    );

    // Arrange
    const orderData = {
      id: '123',
      customerEmail: 'customer@example.com',
      items: [{ id: 'item1', quantity: 2, price: 50 }]
    };

    // Act
    const result = await orderService.processOrder(orderData);

    // Assert - Focus on outcomes, not implementation details
    expect(result.success).toBe(true);
    expect(result.orderId).toBe('123');
    expect(result.totalAmount).toBeGreaterThan(0); // Tests real calculation logic
    
    // Verify only critical side effects
    expect(mockPaymentGateway.processPayment).toHaveBeenCalledOnce();
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      'customer@example.com',
      expect.stringContaining('Order Confirmation')
    );
    expect(mockInventoryService.reserveItems).toHaveBeenCalledOnce();
    expect(mockAuditLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('Order processed: 123')
    );
  });

  it('should handle payment failure gracefully', async () => {
    // Only mock the failing external dependency
    const mockPaymentGateway = {
      processPayment: vi.fn().mockRejectedValue(new Error('Payment failed')),
      validateCard: vi.fn().mockReturnValue(true),
      calculateFees: vi.fn().mockReturnValue(2.50),
    } as Partial<PaymentGateway> as PaymentGateway;

    // Use real implementations for everything else
    const realEmailService = new EmailService();
    const realInventoryService = new InventoryService();
    const realAuditLogger = new AuditLogger();

    orderService = new OrderService(
      mockPaymentGateway,
      realEmailService,
      realInventoryService,
      realAuditLogger
    );

    const orderData = {
      id: '456',
      customerEmail: 'customer@example.com',
      items: [{ id: 'item1', quantity: 1, price: 25 }]
    };

    // Act & Assert
    await expect(orderService.processOrder(orderData)).rejects.toThrow('Payment failed');
    
    // Verify payment was attempted
    expect(mockPaymentGateway.processPayment).toHaveBeenCalledOnce();
  });
});