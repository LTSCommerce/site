import { useCallback, useEffect, useState, type ElementType } from 'react';

import { Typewriter } from './Typewriter';

export interface HighlightTypewriterProps {
  text: string;
  /**
   * The portion of text to highlight with a colour transition.
   *
   * - If omitted, renders the full text without highlight.
   * - Must be a substring of `text`.
   */
  highlightText?: string;
  /** Insert a line break immediately before the highlighted portion. */
  breakBeforeHighlight?: boolean;
  as?: ElementType;
  className?: string;
  trigger?: boolean;
  delay?: number;
  speed?: number;
  /**
   * Hex colour code for the highlighted portion after the typewriter animation completes.
   * Defaults to LTS brand blue (#0f4c81).
   */
  highlightColour?: string;
}

/**
 * HighlightTypewriter - Typewriter with smooth colour transition on a highlighted portion.
 *
 * After the typing animation completes, the `highlightText` portion transitions from white
 * to the specified `highlightColour`. Defaults to LTS brand blue (#0f4c81).
 *
 * Adapted from EC site's WhiteToRedTypewriter -- CSI category colour system removed,
 * replaced with a simple `highlightColour` string prop (hex code). Renamed to
 * HighlightTypewriter to avoid EC branding references.
 *
 * @param text - Full text to display (e.g. "Bespoke PHP Development")
 * @param highlightText - Portion to highlight (e.g. "PHP")
 * @param as - HTML element type (default: 'h2')
 * @param className - Additional CSS classes for the container element
 * @param trigger - Controls when animation starts (default: true)
 * @param delay - Delay before starting in ms (default: 0)
 * @param speed - Typing speed in ms per character (default: 50)
 * @param highlightColour - Hex colour for highlighted text after animation (default: '#0f4c81')
 *
 * @example
 * <HighlightTypewriter
 *   text="Bespoke PHP Development"
 *   highlightText="PHP"
 *   as="h1"
 *   className="text-5xl font-bold"
 *   highlightColour="#0f4c81"
 * />
 */
export function HighlightTypewriter({
  text,
  highlightText,
  breakBeforeHighlight = false,
  as: Tag = 'h2',
  className = '',
  trigger = true,
  delay = 0,
  speed = 50,
  highlightColour = '#0f4c81',
}: HighlightTypewriterProps) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Reset animation state when text changes
  useEffect(() => {
    setIsAnimationComplete(false);
  }, [text]);

  const handleComplete = useCallback(() => {
    setIsAnimationComplete(true);
  }, []);

  // No highlight: render entire text without highlight colour
  if (!highlightText) {
    return (
      <Tag className={className}>
        <Typewriter text={text} trigger={trigger} delay={delay} speed={speed} />
      </Tag>
    );
  }

  // Validate that highlightText is a substring of text
  if (!text.includes(highlightText)) {
    console.warn(
      `HighlightTypewriter: highlightText "${highlightText}" not found in text "${text}"`
    );
    return (
      <Tag className={className}>
        <Typewriter text={text} trigger={trigger} delay={delay} speed={speed} />
      </Tag>
    );
  }

  // Split text into prefix, highlighted portion, and suffix
  const highlightIndex = text.indexOf(highlightText);
  const prefix = text.substring(0, highlightIndex);
  const highlightPortion = highlightText;
  const suffix = text.substring(highlightIndex + highlightText.length);

  return (
    <Tag className={className}>
      {prefix}
      {breakBeforeHighlight && <br />}
      <span
        className="transition-colors duration-500"
        style={{
          color: isAnimationComplete ? highlightColour : '#ffffff',
        }}
      >
        <Typewriter
          text={highlightPortion}
          trigger={trigger}
          delay={delay}
          speed={speed}
          onComplete={handleComplete}
        />
      </span>
      {suffix}
    </Tag>
  );
}

export default HighlightTypewriter;
