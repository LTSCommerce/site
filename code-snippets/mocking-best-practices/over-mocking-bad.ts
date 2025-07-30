// BAD: Over-mocked test that's brittle and unclear
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../services/OrderService';
import { PaymentGateway } from '../services/PaymentGateway';
import { EmailService } from '../services/EmailService';
import { InventoryService } from '../services/InventoryService';
import { AuditLogger } from '../services/AuditLogger';

describe('OrderService - Over-Mocked (BAD)', () => {
  let orderService: OrderService;
  let mockPaymentGateway: any;
  let mockEmailService: any;
  let mockInventoryService: any;
  let mockAuditLogger: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mocking EVERYTHING - even simple data operations
    mockPaymentGateway = {
      processPayment: vi.fn(),
      validateCard: vi.fn(),
      calculateFees: vi.fn(),
      formatAmount: vi.fn(), // This shouldn't be mocked!
    };
    
    mockEmailService = {
      sendEmail: vi.fn(),
      formatTemplate: vi.fn(), // This shouldn't be mocked!
      validateEmail: vi.fn(),  // This shouldn't be mocked!
    };
    
    mockInventoryService = {
      checkStock: vi.fn(),
      reserveItems: vi.fn(),
      calculatePrice: vi.fn(), // This shouldn't be mocked!
      applyDiscount: vi.fn(),  // This shouldn't be mocked!
    };
    
    mockAuditLogger = {
      log: vi.fn(),
      formatMessage: vi.fn(), // This shouldn't be mocked!
    };
    
    orderService = new OrderService(
      mockPaymentGateway,
      mockEmailService,
      mockInventoryService,
      mockAuditLogger
    );
  });

  it('should process order successfully', async () => {
    // Arrange - SO MANY MOCK SETUPS!
    const orderData = { id: '123', items: [{ id: 'item1', quantity: 2 }] };
    
    mockInventoryService.checkStock.mockResolvedValue(true);
    mockInventoryService.reserveItems.mockResolvedValue({ success: true });
    mockInventoryService.calculatePrice.mockReturnValue(100);
    mockInventoryService.applyDiscount.mockReturnValue(90);
    
    mockPaymentGateway.processPayment.mockResolvedValue({ success: true });
    mockPaymentGateway.validateCard.mockReturnValue(true);
    mockPaymentGateway.calculateFees.mockReturnValue(2.50);
    mockPaymentGateway.formatAmount.mockReturnValue('$92.50');
    
    mockEmailService.sendEmail.mockResolvedValue(true);
    mockEmailService.formatTemplate.mockReturnValue('<html>...');
    mockEmailService.validateEmail.mockReturnValue(true);
    
    mockAuditLogger.log.mockReturnValue(undefined);
    mockAuditLogger.formatMessage.mockReturnValue('Order processed: 123');

    // Act
    const result = await orderService.processOrder(orderData);

    // Assert - Testing implementation details, not behavior!
    expect(mockInventoryService.checkStock).toHaveBeenCalledWith(['item1']);
    expect(mockInventoryService.calculatePrice).toHaveBeenCalledWith(orderData.items);
    expect(mockInventoryService.applyDiscount).toHaveBeenCalledWith(100, orderData);
    expect(mockPaymentGateway.formatAmount).toHaveBeenCalledWith(92.50);
    expect(mockEmailService.formatTemplate).toHaveBeenCalledWith('order_confirmation', expect.any(Object));
    expect(mockAuditLogger.formatMessage).toHaveBeenCalledWith('ORDER_PROCESSED', expect.any(Object));
    
    expect(result.success).toBe(true);
  });
});