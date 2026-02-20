/**
 * Test Utilities for React Component Testing
 *
 * Provides a custom render function that wraps components with necessary providers:
 * - BrowserRouter for React Router components (Link, useLocation, useNavigate)
 *
 * Usage:
 * ```typescript
 * import { render, screen } from '@/test-utils';
 *
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 * ```
 */
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Wraps all test components with required application providers.
 * Add additional providers here (ThemeProvider, QueryClient, etc.) as needed.
 */
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

/**
 * Custom render function that wraps components with BrowserRouter and other providers.
 *
 * @param ui - The React component to render
 * @param options - Optional render options (excluding wrapper, which is provided automatically)
 * @returns All @testing-library/react render utilities
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from @testing-library/react so tests can import from one place
export * from '@testing-library/react';

// Override the default render with our custom version that includes providers
export { customRender as render };
