import React, { useEffect, useState } from 'react';

import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface TypewriterProps {
  text: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  delay?: number;
  speed?: number;
  mode?: 'type' | 'delete';
  deleteSpeed?: number;
  onComplete?: () => void;
}

/**
 * Typewriter component - Character-by-character typing animation.
 *
 * Disabled on phones (<768px) and when prefers-reduced-motion is set -- renders text instantly.
 *
 * Lifted from EC site typewriter.tsx -- only import path changed.
 *
 * @param text - The full text to animate
 * @param as - HTML element type (default: 'span')
 * @param className - Additional CSS classes
 * @param trigger - Controls when animation starts (default: true)
 * @param delay - Delay before starting in ms (default: 0)
 * @param speed - Typing speed in ms per character (default: 30)
 * @param mode - 'type' adds characters, 'delete' removes them (default: 'type')
 * @param deleteSpeed - Deletion speed in ms per character (default: 30)
 * @param onComplete - Callback fired when animation completes
 */
export function Typewriter({
  text,
  as: Tag = 'span',
  className = '',
  trigger = true,
  delay = 0,
  speed = 30,
  mode = 'type',
  deleteSpeed = 30,
  onComplete,
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState(mode === 'delete' ? text : '');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  // Mobile detection: phones (<768px) get instant text, tablets (768px+) get animation
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isPhone = useMediaQuery('(max-width: 767px)');

  // Reset state when mode or text changes
  useEffect(() => {
    setDisplayedText(mode === 'delete' ? text : '');
    setStarted(false);
    setFinished(false);
  }, [mode, text]);

  // Handle initial delay and start
  useEffect(() => {
    if (!trigger || started) {
      return;
    }

    const timeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [trigger, delay, started]);

  // Handle typing animation
  useEffect(() => {
    if (!started || mode !== 'type') {
      return;
    }

    if (displayedText.length >= text.length) {
      if (!finished) {
        setFinished(true);
        onComplete?.();
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => {
      clearTimeout(timeout);
    };
  }, [started, displayedText, text, speed, mode, finished, onComplete]);

  // Handle deletion animation
  useEffect(() => {
    if (!started || mode !== 'delete') {
      return;
    }

    if (displayedText.length === 0) {
      if (!finished) {
        setFinished(true);
        onComplete?.();
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(displayedText.slice(0, -1));
    }, deleteSpeed);

    return () => {
      clearTimeout(timeout);
    };
  }, [started, displayedText, deleteSpeed, mode, finished, onComplete]);

  // Early return for phones or reduced motion preference -- render instantly (after all hooks)
  if (isPhone || prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  // Split text into characters and render with individual visibility control
  const chars = text.split('');
  const visibleLength = displayedText.length;

  return (
    <Tag className={className}>
      {chars.map((char, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleLength ? 1 : 0,
            transition: 'opacity 0.05s',
          }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
}

export default Typewriter;
