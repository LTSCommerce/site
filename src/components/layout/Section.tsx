/**
 * Section Component
 *
 * Vertical spacing wrapper for page sections.
 * Minimal, clean design with Tailwind CSS.
 */

import type { ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  /** Background treatment. Default: transparent. */
  tone?: 'default' | 'white' | 'dark' | 'muted';
}

export function Section({ children, spacing = 'lg', tone = 'default' }: SectionProps) {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  const toneClasses = {
    default: '',
    white: 'bg-white',
    dark: 'bg-[#0A0A0A]',
    muted: 'bg-gray-50',
  };

  return (
    <section className={`${spacingClasses[spacing]} ${toneClasses[tone]}`.trim()}>
      {children}
    </section>
  );
}
