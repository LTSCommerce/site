import React, { useEffect, useState } from 'react';

import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface TypewriterProps {
  text: string;
  as?: React.ElementType;
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

  // Restart when mode or text changes. Adjusting state during render (not in
  // an effect) means the stale text is never painted for the new props.
  const [runFor, setRunFor] = useState({ mode, text });
  if (runFor.mode !== mode || runFor.text !== text) {
    setRunFor({ mode, text });
    setDisplayedText(mode === 'delete' ? text : '');
    setStarted(false);
    setFinished(false);
  }

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

  // Handle typing animation. Completion fires in the same tick that types the
  // final character.
  useEffect(() => {
    if (!started || finished || mode !== 'type') {
      return;
    }

    const timeout = setTimeout(() => {
      const next = text.slice(0, displayedText.length + 1);
      setDisplayedText(next);
      if (next.length >= text.length) {
        setFinished(true);
        onComplete?.();
      }
    }, speed);

    return () => {
      clearTimeout(timeout);
    };
  }, [started, finished, displayedText, text, speed, mode, onComplete]);

  // Handle deletion animation. Completion fires in the same tick that removes
  // the final character.
  useEffect(() => {
    if (!started || finished || mode !== 'delete') {
      return;
    }

    const timeout = setTimeout(() => {
      const next = displayedText.slice(0, -1);
      setDisplayedText(next);
      if (next.length === 0) {
        setFinished(true);
        onComplete?.();
      }
    }, deleteSpeed);

    return () => {
      clearTimeout(timeout);
    };
  }, [started, finished, displayedText, deleteSpeed, mode, onComplete]);

  // Early return for phones or reduced motion preference -- render instantly (after all hooks)
  if (isPhone || prefersReducedMotion) {
    return <Tag>{text}</Tag>;
  }

  // Split text into characters and render with individual visibility control
  const chars = text.split('');
  const visibleLength = displayedText.length;

  return (
    <Tag>
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
