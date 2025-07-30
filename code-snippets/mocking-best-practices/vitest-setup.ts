// Vitest setup and configuration for clean mocking
import { vi, beforeEach, afterAll } from 'vitest';

// Global test setup - clean up mocks between tests
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Reset module mocks
  vi.resetModules();
});

afterAll(() => {
  // Restore real timers after all tests
  vi.useRealTimers();
  
  // Restore all mocks
  vi.restoreAllMocks();
});

// Helper function for creating typed mocks
export function createMockService<T>(implementation: Partial<T> = {}): T {
  return implementation as T;
}

// Example of when to use vi.spyOn vs vi.mock
export class TestHelpers {
  // Use vi.spyOn for temporary overrides in specific tests
  static spyOnMethod<T extends object, K extends keyof T>(
    object: T,
    method: K
  ) {
    return vi.spyOn(object, method);
  }

  // Use vi.mock for complete module replacement
  static mockModule(modulePath: string, factory?: () => any) {
    return vi.mock(modulePath, factory);
  }

  // Helper for mocking only external dependencies
  static mockExternalDependency<T>(
    dependency: T,
    overrides: Partial<T> = {}
  ): T {
    const baseMock = vi.fn() as any;
    return Object.assign(baseMock, overrides) as T;
  }
}