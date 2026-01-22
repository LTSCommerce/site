/**
 * ArticleContent Component
 *
 * Renders article HTML content with automatic syntax highlighting.
 * Uses Highlight.js to highlight code blocks after mount.
 */

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';

// Import only the languages we need to keep bundle size down
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import php from 'highlight.js/lib/languages/php';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import nginx from 'highlight.js/lib/languages/nginx';
import python from 'highlight.js/lib/languages/python';

// Import Highlight.js theme
import 'highlight.js/styles/github-dark.css';

/* eslint-disable custom/use-types-not-strings -- Highlight.js language identifiers, not category references */
// Language name constants (for Highlight.js, not our category system)
const LANG_JS = 'javascript';
const LANG_TS = 'typescript';
const LANG_PHP = 'php';
const LANG_BASH = 'bash';
const LANG_CSS = 'css';
const LANG_SQL = 'sql';
const LANG_YAML = 'yaml';
const LANG_JSON = 'json';
const LANG_NGINX = 'nginx';
const LANG_PYTHON = 'python';

// Register languages with Highlight.js
hljs.registerLanguage(LANG_JS, javascript);
hljs.registerLanguage(LANG_TS, typescript);
hljs.registerLanguage(LANG_PHP, php);
hljs.registerLanguage(LANG_BASH, bash);
hljs.registerLanguage(LANG_CSS, css);
hljs.registerLanguage(LANG_SQL, sql);
hljs.registerLanguage(LANG_YAML, yaml);
hljs.registerLanguage(LANG_JSON, json);
hljs.registerLanguage(LANG_NGINX, nginx);
hljs.registerLanguage(LANG_PYTHON, python);
/* eslint-enable custom/use-types-not-strings */

interface ArticleContentProps {
  /** HTML content to render */
  content: string;
}

/**
 * ArticleContent - Renders HTML content with syntax highlighting
 *
 * @example
 * ```tsx
 * <ArticleContent content={article.content} />
 * ```
 */
export function ArticleContent({ content }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Find all code blocks and apply syntax highlighting
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
