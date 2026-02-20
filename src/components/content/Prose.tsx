import type { ReactNode } from 'react';

interface ProseProps {
  /**
   * Prose content (typically HTML or markdown-rendered content)
   */
  children: ReactNode;
}

/**
 * Prose Component
 *
 * Styled wrapper for text-heavy content (articles, blog posts, documentation).
 * Provides typography styles similar to Tailwind's prose plugin.
 *
 * Example:
 * ```tsx
 * <Prose>
 *   <h1>Article Title</h1>
 *   <p>This is a paragraph with proper spacing...</p>
 *   <ul>
 *     <li>List item</li>
 *   </ul>
 * </Prose>
 * ```
 */
export function Prose({ children }: ProseProps) {
  return (
    <div
      style={{
        maxWidth: '65ch',
        lineHeight: '1.75',
      }}
      // Inline styles for prose elements
      // In production, use CSS or Tailwind prose plugin
      className="prose"
    >
      <style>{`
        .prose h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: var(--space-6);
          line-height: 1.2;
        }

        .prose h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: var(--space-12);
          margin-bottom: var(--space-4);
          line-height: 1.3;
        }

        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: var(--space-8);
          margin-bottom: var(--space-3);
        }

        .prose p {
          margin-bottom: var(--space-4);
        }

        .prose ul,
        .prose ol {
          margin-bottom: var(--space-4);
          padding-left: var(--space-6);
        }

        .prose li {
          margin-bottom: var(--space-2);
        }

        .prose code {
          font-family: var(--font-mono);
          background-color: #f5f5f5;
          padding: 0.125rem 0.25rem;
          border-radius: 3px;
          font-size: 0.875em;
        }

        .prose pre {
          background-color: #1e1e1e;
          color: #d4d4d4;
          padding: var(--space-4);
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: var(--space-4);
        }

        .prose pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }

        .prose a {
          color: var(--color-primary);
          text-decoration: underline;
        }

        .prose a:hover {
          text-decoration: none;
        }

        .prose blockquote {
          border-left: 4px solid var(--color-primary);
          padding-left: var(--space-4);
          margin: var(--space-6) 0;
          font-style: italic;
          color: #666;
        }
      `}</style>
      {children}
    </div>
  );
}
