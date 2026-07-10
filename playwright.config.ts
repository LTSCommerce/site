import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E config. Deliberately scoped to e2e/ - src/**\/*.test.tsx are Vitest
 * component tests and must never be picked up by Playwright's own test runner (they
 * use Vitest globals like describe/screen that don't exist in a Playwright test file,
 * which crashes with a bare "Cannot read properties of undefined" error).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env['CI']),
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI']
    ? [['json', { outputFile: 'var/qa/playwright.json' }], ['list']]
    : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env['CI'],
  },
});
