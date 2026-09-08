/**
 * Icon - Closed-styling wrapper for lucide-react icon components.
 *
 * lucide-react icons only ever need className for size/hover-transform in this
 * codebase, so we expose that as a finite `size`/`growOnHover` state instead of
 * an open className. Uses createElement rather than JSX so the icon component
 * itself never appears as a JSX tag receiving className (see the closed-styling
 * doctrine: https://github.com/LongTermSupport/ts-qa-ci/blob/main/docs/closed-styling-doctrine.md).
 */
import { createElement } from 'react';
import type { LucideIcon } from 'lucide-react';

type IconSize = 'sm' | 'md';

export interface IconProps {
  icon: LucideIcon;
  /** sm = h-4 w-4 (inline with text/buttons), md = h-6 w-6 (feature card icons) */
  size?: IconSize;
  /** Adds the hover-scale transform used on feature card icons */
  growOnHover?: boolean;
  'aria-hidden'?: boolean;
}

const SIZE_CLASSES: Record<IconSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
};

export function Icon({
  icon,
  size = 'sm',
  growOnHover = false,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const className = growOnHover
    ? `${SIZE_CLASSES[size]} transition-transform group-hover:scale-110`
    : SIZE_CLASSES[size];

  return createElement(icon, { className, 'aria-hidden': ariaHidden });
}
