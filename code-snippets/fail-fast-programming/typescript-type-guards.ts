// ANTI-PATTERN: Type assertions and wishful thinking
interface User {
  id: number;
  name: string;
  permissions: string[];
}

interface OrderRequest {
  id: string;
  userId: number;
  itemId: string;
  quantity: number;
}

// Anti-pattern: Using 'any' and type assertions to bypass type safety
function processOrderUnsafe(data: any): { status: string; message?: string } {
  // Type assertion without validation - fingers crossed programming!
  const order = data as OrderRequest;
  const user = getUserById(order.userId) as User;
  
  // No runtime validation - assumes TypeScript types match reality
  if (user.permissions.includes('order_process')) {
    return { status: 'success' };
  }
  
  return { status: 'error', message: 'Permission denied' };
}

// FAIL-FAST APPROACH: Type guards and explicit validation
// Type guard functions that validate at runtime AND narrow types
function isValidOrderRequest(data: unknown): data is OrderRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).id === 'string' &&
    (data as any).id.length > 0 &&
    typeof (data as any).userId === 'number' &&
    (data as any).userId > 0 &&
    typeof (data as any).itemId === 'string' &&
    (data as any).itemId.length > 0 &&
    typeof (data as any).quantity === 'number' &&
    (data as any).quantity > 0
  );
}

function isValidUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).id === 'number' &&
    typeof (data as any).name === 'string' &&
    Array.isArray((data as any).permissions) &&
    (data as any).permissions.every((p: any) => typeof p === 'string')
  );
}

// Fail-fast implementation with type guards
function processOrderSafe(data: unknown): { status: 'success' | 'error'; message?: string } {
  // Guard clause: Validate input shape and types
  if (!isValidOrderRequest(data)) {
    throw new Error('Invalid order request: missing or malformed required fields');
  }
  
  // TypeScript now knows 'data' is OrderRequest - no casting needed!
  const order = data;
  
  // Guard clause: Validate user exists
  const userData = getUserById(order.userId);
  if (!userData) {
    throw new Error(`User ${order.userId} not found`);
  }
  
  // Guard clause: Validate user data structure
  if (!isValidUser(userData)) {
    throw new Error(`User ${order.userId} has invalid data structure`);
  }
  
  // TypeScript now knows userData is User
  const user = userData;
  
  // Guard clause: Validate permissions
  if (!user.permissions.includes('order_process')) {
    throw new Error(`User ${user.id} (${user.name}) lacks order_process permission`);
  }
  
  // All validations passed - safe to process
  return {
    status: 'success'
  };
}

// Advanced: Using discriminated unions for better type safety
type ProcessResult = 
  | { success: true; orderId: string; processedAt: Date }
  | { success: false; error: string; errorCode: 'INVALID_ORDER' | 'USER_NOT_FOUND' | 'PERMISSION_DENIED' | 'INSUFFICIENT_STOCK' };

function processOrderWithResult(data: unknown): ProcessResult {
  // Fail fast with specific error types
  if (!isValidOrderRequest(data)) {
    return {
      success: false,
      error: 'Order request is missing required fields or has invalid types',
      errorCode: 'INVALID_ORDER'
    };
  }
  
  const userData = getUserById(data.userId);
  if (!userData) {
    return {
      success: false,
      error: `User ${data.userId} not found`,
      errorCode: 'USER_NOT_FOUND'
    };
  }
  
  if (!isValidUser(userData)) {
    return {
      success: false,
      error: `User ${data.userId} has corrupted data`,
      errorCode: 'USER_NOT_FOUND'
    };
  }
  
  if (!userData.permissions.includes('order_process')) {
    return {
      success: false,
      error: `User ${userData.name} lacks order processing permission`,
      errorCode: 'PERMISSION_DENIED'
    };
  }
  
  // Success case - TypeScript enforces we return the correct shape
  return {
    success: true,
    orderId: data.id,
    processedAt: new Date()
  };
}

// Modern TypeScript 5.4: Enhanced type narrowing with assertion functions
function assertValidOrderRequest(data: unknown): asserts data is OrderRequest {
  if (!isValidOrderRequest(data)) {
    throw new Error('Invalid order request structure');
  }
}

function assertValidUser(data: unknown): asserts data is User {
  if (!isValidUser(data)) {
    throw new Error('Invalid user data structure');
  }
}

// Using assertion functions for fail-fast validation
function processOrderWithAssertions(data: unknown): { status: 'success'; orderId: string } {
  // These throw if validation fails - fail fast!
  assertValidOrderRequest(data);  // TypeScript knows data is OrderRequest after this
  
  const userData = getUserById(data.userId);
  if (!userData) {
    throw new Error(`User ${data.userId} not found`);
  }
  
  assertValidUser(userData);  // TypeScript knows userData is User after this
  
  if (!userData.permissions.includes('order_process')) {
    throw new Error(`User ${userData.name} lacks permission`);
  }
  
  // All assertions passed - guaranteed safe
  return {
    status: 'success',
    orderId: data.id
  };
}

// Dummy function for examples
function getUserById(id: number): unknown {
  // In real code, this would fetch from database/API
  return { id, name: 'John Doe', permissions: ['order_process'] };
}