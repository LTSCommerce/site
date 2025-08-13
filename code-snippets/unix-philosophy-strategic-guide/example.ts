// TypeScript: Unix Philosophy in Modern Node.js Applications

import { EventEmitter } from 'events';
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';

// Single Responsibility: Each service has one clear purpose
interface AuthenticationService {
  authenticate(credentials: UserCredentials): Promise<AuthResult>;
}

interface PaymentGateway {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

// Value Objects for type safety
type UserCredentials = {
  readonly email: string;
  readonly password: string;
};

type AuthResult = 
  | { success: true; user: User }
  | { success: false; error: string };

type PaymentResult = 
  | { success: true; transactionId: string }
  | { success: false; error: string };

// Implementation: Single Responsibility Principle
class UserAuthenticationService implements AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async authenticate(credentials: UserCredentials): Promise<AuthResult> {
    if (!this.validateCredentialsFormat(credentials)) {
      return { success: false, error: 'Invalid credentials format' };
    }

    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isValid = await this.passwordHasher.verify(
      credentials.password,
      user.hashedPassword
    );

    return isValid
      ? { success: true, user }
      : { success: false, error: 'Invalid password' };
  }

  private validateCredentialsFormat(credentials: UserCredentials): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(credentials.email) && credentials.password.length >= 8;
  }
}

// Composition: Building complex services from simple components
class PaymentProcessor {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly gateway: PaymentGateway,
    private readonly logger: Logger
  ) {}

  async processPayment(paymentData: {
    user: UserCredentials;
    amount: number;
    paymentMethod: string;
  }): Promise<PaymentResult> {
    // Authenticate user first
    const authResult = await this.authService.authenticate(paymentData.user);

    if (!authResult.success) {
      this.logger.error('Payment authentication failed', {
        email: paymentData.user.email,
        reason: authResult.error
      });
      
      return { success: false, error: 'Authentication failed' };
    }

    // Process payment
    try {
      const result = await this.gateway.processPayment({
        userId: authResult.user.id,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod
      });

      this.logger.info('Payment processed successfully', {
        userId: authResult.user.id,
        amount: paymentData.amount,
        transactionId: result.success ? result.transactionId : undefined
      });

      return result;
    } catch (error) {
      this.logger.error('Payment processing failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: authResult.user.id
      });
      
      return { success: false, error: 'Payment processing failed' };
    }
  }
}

// Text Streams and Pipeline Processing (Unix philosophy core)
class DataTransformPipeline {
  private readonly transforms: Transform[] = [];

  addTransform(transform: Transform): this {
    this.transforms.push(transform);
    return this;
  }

  async process(inputStream: NodeJS.ReadableStream): Promise<string> {
    const pipelineAsync = promisify(pipeline);
    
    // Build pipeline: input -> transform1 -> transform2 -> ... -> output
    const streams = [inputStream, ...this.transforms];
    
    let result = '';
    const collectTransform = new Transform({
      transform(chunk, _encoding, callback) {
        result += chunk.toString();
        callback();
      }
    });
    
    streams.push(collectTransform);
    
    await pipelineAsync(...streams);
    return result;
  }
}

// Example transforms following Unix philosophy
class CsvToJsonTransform extends Transform {
  private headers: string[] | null = null;

  _transform(chunk: Buffer, _encoding: string, callback: Function): void {
    const lines = chunk.toString().split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (!this.headers) {
        this.headers = line.split(',').map(h => h.trim());
        continue;
      }
      
      const values = line.split(',').map(v => v.trim());
      const record = Object.fromEntries(
        this.headers.map((header, index) => [header, values[index]])
      );
      
      this.push(JSON.stringify(record) + '\n');
    }
    
    callback();
  }
}

class JsonValidationTransform extends Transform {
  constructor(private readonly requiredFields: string[]) {
    super();
  }

  _transform(chunk: Buffer, _encoding: string, callback: Function): void {
    try {
      const record = JSON.parse(chunk.toString());
      
      for (const field of this.requiredFields) {
        if (!(field in record)) {
          return callback(new Error(`Missing required field: ${field}`));
        }
      }
      
      this.push(chunk); // Pass through if valid
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

// Microservices Communication Pattern
class ServiceOrchestrator extends EventEmitter {
  constructor(
    private readonly userService: UserServiceClient,
    private readonly paymentService: PaymentServiceClient,
    private readonly orderService: OrderServiceClient,
    private readonly notificationService: NotificationServiceClient
  ) {
    super();
  }

  async processOrder(orderData: {
    userId: string;
    items: OrderItem[];
    paymentMethod: string;
    total: number;
  }): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      // Each service call is independent and focused
      const user = await this.userService.getUser(orderData.userId);
      
      const paymentResult = await this.paymentService.processPayment({
        userId: user.id,
        amount: orderData.total,
        paymentMethod: orderData.paymentMethod
      });

      if (!paymentResult.success) {
        return { success: false, error: paymentResult.error };
      }

      const order = await this.orderService.createOrder({
        userId: user.id,
        items: orderData.items,
        paymentId: paymentResult.transactionId
      });

      // Fire and forget notification (Unix: do one thing well)
      setImmediate(() => {
        this.notificationService.sendOrderConfirmation(user, order)
          .catch(error => this.emit('notification-error', error));
      });

      return { success: true, orderId: order.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Order processing failed'
      };
    }
  }
}

// Resilient Service Pattern: Circuit Breaker
class ResilientPaymentService implements PaymentGateway {
  private failures = 0;
  private readonly maxFailures = 5;
  private readonly resetTimeout = 30000; // 30 seconds
  private lastFailureTime = 0;

  constructor(
    private readonly primaryService: PaymentGateway,
    private readonly fallbackService: PaymentGateway
  ) {}

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    if (this.isCircuitOpen()) {
      return this.fallbackService.processPayment(request);
    }

    try {
      const result = await this.primaryService.processPayment(request);
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      
      // For critical errors, fail fast
      if (error instanceof CriticalPaymentError) {
        throw error;
      }
      
      // Try fallback for recoverable errors
      return this.fallbackService.processPayment(request);
    }
  }

  private isCircuitOpen(): boolean {
    const now = Date.now();
    
    // Reset circuit if timeout has passed
    if (now - this.lastFailureTime > this.resetTimeout) {
      this.failures = 0;
      return false;
    }
    
    return this.failures >= this.maxFailures;
  }

  private recordSuccess(): void {
    this.failures = 0;
  }

  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
  }
}

// Usage Example: Building a complete system
async function buildECommerceSystem(): Promise<void> {
  // Create individual services (single responsibility)
  const logger = new ConsoleLogger();
  const userRepo = new MongoUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const authService = new UserAuthenticationService(userRepo, passwordHasher);
  
  const primaryGateway = new StripePaymentGateway();
  const fallbackGateway = new PayPalPaymentGateway();
  const resilientGateway = new ResilientPaymentService(primaryGateway, fallbackGateway);
  
  const paymentProcessor = new PaymentProcessor(authService, resilientGateway, logger);
  
  // Build data processing pipeline
  const pipeline = new DataTransformPipeline()
    .addTransform(new CsvToJsonTransform())
    .addTransform(new JsonValidationTransform(['id', 'name', 'price']));
  
  // Everything is composed from small, focused components
  console.log('E-commerce system built using Unix philosophy principles');
}