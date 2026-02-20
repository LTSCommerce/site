import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Vitest Configuration for React Component Tests
 *
 * This configuration sets up:
 * - React component testing with @testing-library/react
 * - happy-dom environment (faster than jsdom)
 * - Test globals (describe, it, expect without imports)
 * - Path aliases matching vite.config.ts
 * - Coverage reporting to var/coverage/
 * - JSON output for CI/LLM consumption
 *
 * Usage:
 * - npm run test             - Watch mode for development
 * - npm run test:run         - Single run for CI
 * - npm run test:coverage    - Generate coverage report
 * - npm run llm:test         - JSON output for machine parsing
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-utils/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'untracked'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'json', 'lcov'],
      reportsDirectory: 'var/coverage',
    },
    reporters: process.env.CI ? ['json', 'default'] : ['default'],
    outputFile: process.env.CI ? 'var/qa/vitest.json' : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
