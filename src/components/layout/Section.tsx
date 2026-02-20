/**
 * Section Component
 *
 * Vertical spacing wrapper for page sections.
 * Minimal, clean design with Tailwind CSS.
 */

import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Section({ children, spacing = 'lg', className }: SectionProps) {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  return <section className={`${spacingClasses[spacing]} ${className || ''}`}>{children}</section>;
}
