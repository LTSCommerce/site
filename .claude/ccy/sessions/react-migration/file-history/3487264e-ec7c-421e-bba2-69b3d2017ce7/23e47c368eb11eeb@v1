import type { ReactNode } from 'react';

interface ContainerProps {
  /**
   * Container content
   */
  children: ReactNode;

  /**
   * Maximum width variant
   * @default 'default'
   */
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
}

/**
 * Container Component
 *
 * Responsive container with max-width and horizontal padding.
 * Centers content and provides consistent spacing.
 *
 * Example:
 * ```tsx
 * <Container maxWidth="narrow">
 *   <h1>Centered Content</h1>
 * </Container>
 * ```
 */
export function Container({ children, maxWidth = 'default' }: ContainerProps) {
  const maxWidthStyles = {
    narrow: { maxWidth: '768px' },
    default: { maxWidth: '1200px' },
    wide: { maxWidth: '1400px' },
    full: { maxWidth: '100%' },
  };

  return (
    <div
      style={{
        width: '100%',
        margin: '0 auto',
        padding: '0 var(--space-4)',
        ...maxWidthStyles[maxWidth],
      }}
    >
      {children}
    </div>
  );
}
