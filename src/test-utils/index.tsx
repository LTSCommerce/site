/**
 * Test Utilities for React Component Testing
 *
 * Provides a custom render function that wraps components with necessary providers:
 * - MemoryRouter for React Router components (Link, useLocation, useNavigate)
 *   Uses MemoryRouter instead of BrowserRouter to avoid touching window.location/
 *   window.history, preventing test pollution between test cases.
 *
 * Usage:
 * ```typescript
 * import { render, screen } from '@/test-utils';
 *
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 *
 * // Test a specific route:
 * test('renders on /about', () => {
 *   render(<MyComponent />, { initialEntries: ['/about'] });
 * });
 * ```
 */
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

/**
 * Custom render function that wraps components with MemoryRouter and other providers.
 *
 * @param ui - The React component to render
 * @param options - Optional render options, including initialEntries for route-specific testing
 * @returns All @testing-library/react render utilities
 */
function customRender(
  ui: ReactElement,
  { initialEntries = ['/'], ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    ),
    ...options,
  });
}

// Re-export everything from @testing-library/react so tests can import from one place
export * from '@testing-library/react';

// Override the default render with our custom version that includes providers
export { customRender as render };
