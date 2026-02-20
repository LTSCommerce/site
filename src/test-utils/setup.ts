/**
 * Vitest Test Setup
 *
 * Runs before all tests to configure the test environment:
 * - Imports @testing-library/jest-dom matchers (toBeInTheDocument, toHaveClass, etc.)
 * - Suppresses expected React warning noise in test output
 *
 * Automatically loaded by vitest.config.ts setupFiles
 */
import '@testing-library/jest-dom/vitest';
import { afterAll, beforeAll } from 'vitest';

// Suppress expected React warning noise from test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: useLayoutEffect'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
