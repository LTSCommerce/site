import { test, expect } from '@playwright/test';

/**
 * Smoke tests against the real prerendered/SSG output (served via `npm run preview`,
 * see playwright.config.ts webServer). Different value from the Vitest component
 * tests: this exercises the actual built HTML, not an isolated component render.
 */
const ROUTES: Array<{ path: string; heading: string | RegExp }> = [
  { path: '/', heading: /long term support for your technology/i },
  { path: '/about', heading: /about me/i },
  { path: '/services', heading: /services/i },
  { path: '/articles', heading: /articles/i },
  { path: '/contact', heading: /hire me/i },
];

for (const { path, heading } of ROUTES) {
  test(`${path} renders with its expected heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole('heading', { level: 1 }).filter({ hasText: heading })
    ).toBeVisible();
  });
}

test('an unknown route renders the 404 page', async ({ page }) => {
  // vite preview SPA-falls-back to index.html for any unmatched path (HTTP 200) -
  // React Router's own catch-all route then renders NotFound client-side.
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
});
