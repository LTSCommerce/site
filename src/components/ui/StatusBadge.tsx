import { Typewriter } from './Typewriter';

export interface StatusBadgeProps {
  /** The text to display in the badge */
  text: string;
  /**
   * Visual variant controlling the dot colour.
   * - 'primary': LTS brand blue
   * - 'secondary': muted blue-grey
   * - 'success': green
   */
  variant?: 'primary' | 'secondary' | 'success';
  /** Whether the status dot should pulse with animation (default: true) */
  pulsing?: boolean;
  /** Whether to enable typewriter animation on the text (default: false) */
  typewriter?: boolean;
  /** Delay before typewriter starts in ms (default: 0) */
  typewriterDelay?: number;
  /** Typing speed in ms per character (default: 30) */
  typewriterSpeed?: number;
  /**
   * Whether the badge is visible on mobile.
   * EC site hides it on mobile (hidden md:inline-flex).
   * LTS makes it visible on all viewports by default.
   * Set to false to restore mobile-hidden behaviour.
   */
  showOnMobile?: boolean;
}

/**
 * Returns Tailwind dot colour class for the given variant.
 */
function getDotColourClass(variant: 'primary' | 'secondary' | 'success'): string {
  switch (variant) {
    case 'secondary':
      return 'bg-blue-400';
    case 'success':
      return 'bg-green-400';
    case 'primary':
    default:
      return 'bg-[#0f4c81]';
  }
}

/**
 * StatusBadge - Terminal-style status indicator badge.
 *
 * Displays a pulsing dot, a ">" prompt, and text in a mono font.
 * Optional typewriter animation on the text.
 *
 * Adapted from EC site's StatusBadge -- CSI category colour system removed,
 * replaced with a simple `variant` prop. The `children?: never` pattern is kept
 * for documentation intent but not ESLint-enforced in LTS. Badge is visible
 * on mobile by default (EC hid it via `hidden md:inline-flex`).
 *
 * @example
 * <StatusBadge text="Core Expertise" variant="primary" pulsing={true} />
 * <StatusBadge text="Available Now" typewriter={true} typewriterDelay={500} />
 */
export function StatusBadge({
  text,
  variant = 'primary',
  pulsing = true,
  typewriter = false,
  typewriterDelay = 0,
  typewriterSpeed = 30,
  showOnMobile = true,
}: StatusBadgeProps) {
  const dotColourClass = getDotColourClass(variant);
  const pulseClass = pulsing ? 'animate-pulse' : '';
  const visibilityClass = showOnMobile ? 'inline-flex' : 'hidden md:inline-flex';

  return (
    <div
      className={`mb-6 items-center gap-3 rounded-sm border border-gray-700 bg-gray-900 px-3 py-1.5 shadow-[0_0_15px_rgba(15,76,129,0.15)] ${visibilityClass}`}
    >
      <span className={`block h-2 w-2 rounded-full ${dotColourClass} ${pulseClass}`} />
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0f4c81]">
        <span className="text-gray-500">&gt;</span>{' '}
        {typewriter ? (
          <>
            <Typewriter text={text} delay={typewriterDelay} speed={typewriterSpeed} />
            <span className="ml-0.5 animate-pulse font-bold text-[#0f4c81]">_</span>
          </>
        ) : (
          text
        )}
      </span>
    </div>
  );
}

export default StatusBadge;
