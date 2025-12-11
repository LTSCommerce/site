import type { ReactNode } from 'react';

interface SectionProps {
  /**
   * Section content
   */
  children: ReactNode;

  /**
   * Vertical spacing variant
   * @default 'default'
   */
  spacing?: 'none' | 'small' | 'default' | 'large';

  /**
   * Background color
   * @default 'transparent'
   */
  background?: 'transparent' | 'white' | 'gray';
}

/**
 * Section Component
 *
 * Generic section wrapper for page sections.
 * Handles vertical spacing and optional background colors.
 *
 * Example:
 * ```tsx
 * <Section spacing="large" background="gray">
 *   <Container>
 *     <h2>Section Title</h2>
 *   </Container>
 * </Section>
 * ```
 */
export function Section({ children, spacing = 'default', background = 'transparent' }: SectionProps) {
  const spacingStyles = {
    none: { padding: '0' },
    small: { padding: 'var(--space-8) 0' },
    default: { padding: 'var(--space-12) 0' },
    large: { padding: 'var(--space-16) 0' },
  };

  const backgroundStyles = {
    transparent: { backgroundColor: 'transparent' },
    white: { backgroundColor: 'var(--color-background)' },
    gray: { backgroundColor: '#f5f5f5' },
  };

  return (
    <section
      style={{
        ...spacingStyles[spacing],
        ...backgroundStyles[background],
      }}
    >
      {children}
    </section>
  );
}
