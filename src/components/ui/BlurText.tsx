import React, { CSSProperties } from 'react';

import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface BlurTextProps {
  children: React.ReactNode;
  trigger?: boolean;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'p' | 'span';
}

/**
 * BlurText component - Animates content with blur and fade-in effects.
 *
 * Disabled on phones (<768px) and when prefers-reduced-motion is set -- renders instantly.
 *
 * Performance optimisations:
 * - Uses CSS transitions for GPU acceleration
 * - Includes will-change hint for browser optimisation
 * - Removes will-change after animation completes to free resources
 * - Phones and reduced-motion users get instant content display (no blur filters)
 *
 * Lifted from EC site BlurText.tsx -- only import path changed.
 *
 * @param children - Content to animate
 * @param trigger - Controls when animation starts (default: true)
 * @param delay - Delay before animation in ms (default: 0)
 * @param duration - Animation duration in ms (default: 600)
 * @param className - Additional CSS classes
 * @param as - HTML element type (default: 'div')
 */
export function BlurText({
  children,
  trigger = true,
  delay = 0,
  duration = 600,
  className = '',
  as: Tag = 'div',
}: BlurTextProps) {
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Mobile detection: phones (<768px) get instant text, tablets (768px+) get animation
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isPhone = useMediaQuery('(max-width: 767px)');

  React.useEffect(() => {
    if (trigger && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [trigger, hasAnimated]);

  const baseStyle: CSSProperties = {
    filter: hasAnimated ? 'blur(0px)' : 'blur(10px)',
    opacity: hasAnimated ? 1 : 0,
    transition: `filter ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
    willChange: hasAnimated ? 'auto' : 'filter, opacity',
  };

  // Remove will-change after animation completes to free resources
  React.useEffect(() => {
    if (!hasAnimated) {
      return;
    }

    const timer = setTimeout(
      () => {
        setHasAnimated(true);
      },
      duration + delay + 100
    );

    return () => {
      clearTimeout(timer);
    };
  }, [hasAnimated, duration, delay]);

  // Early return for phones or reduced motion preference -- render instantly (after all hooks)
  if (isPhone || prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={className} style={baseStyle}>
      {children}
    </Tag>
  );
}

export default BlurText;
