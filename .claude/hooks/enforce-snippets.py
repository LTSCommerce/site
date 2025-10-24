#!/usr/bin/env python3
"""
PreToolUse hook to enforce snippets system in articles.

Articles must use the snippet injection system ({{SNIPPET:...}}) instead of
embedding code directly in <code> tags. Embedded code causes rendering failures
due to unescaped HTML characters.

This hook blocks Write and Edit operations on article files that contain
embedded code in <code> tags.
"""

import json
import os
import re
import sys


def is_article_file(file_path: str) -> bool:
    """Check if the file path is an article EJS template."""
    # Normalize path to handle both absolute and relative paths
    normalized = file_path.replace(os.path.sep, '/')

    # Check if it's an article file
    return (
        'private_html/articles/' in normalized and
        normalized.endswith('.ejs')
    )


def has_embedded_code(content: str) -> tuple[bool, list[str]]:
    """
    Check if content has embedded code in <code> tags instead of snippet references.

    Returns:
        Tuple of (has_embedded_code, list of violations)
    """
    violations = []

    # Pattern to find <code> tags with content
    # This looks for <code> tags that contain actual code lines (more than just whitespace)
    # but NOT snippet placeholders
    code_pattern = re.compile(
        r'<code[^>]*>(.*?)</code>',
        re.DOTALL | re.IGNORECASE
    )

    for match in code_pattern.finditer(content):
        code_content = match.group(1).strip()

        # Skip if empty
        if not code_content:
            continue

        # Allow snippet references
        if code_content.startswith('{{SNIPPET:'):
            continue

        # Allow single-line inline code (like `<code>some_variable</code>`)
        # These are typically less than 50 chars and don't contain newlines
        if '\n' not in code_content and len(code_content) < 50:
            continue

        # This looks like embedded code - get a preview
        preview = code_content[:100].replace('\n', '\\n')
        if len(code_content) > 100:
            preview += '...'

        violations.append(f"Embedded code found: {preview}")

    return len(violations) > 0, violations


def main() -> int:
    """Main hook logic."""
    try:
        # Read hook payload from stdin
        payload = json.loads(sys.stdin.read())

        tool = payload.get('tool')

        # Only check Write and Edit tool invocations
        if tool not in ('Write', 'Edit'):
            return 0

        parameters = payload.get('parameters', {})
        file_path = parameters.get('file_path', '')

        # Only check article files
        if not is_article_file(file_path):
            return 0

        # Get the content being written
        content = ''
        if tool == 'Write':
            content = parameters.get('content', '')
        elif tool == 'Edit':
            # For Edit, we need to check the new_string
            content = parameters.get('new_string', '')

        # Check for embedded code
        has_violations, violations = has_embedded_code(content)

        if has_violations:
            error_msg = {
                'error': 'Embedded code detected in article',
                'file': file_path,
                'reason': 'Articles must use the snippet injection system',
                'violations': violations,
                'solution': [
                    '1. Create a code snippet file in code-snippets/article-slug/',
                    '2. Move the code to the snippet file',
                    '3. Use {{SNIPPET:article-slug/filename.ext}} in the article',
                    '4. CRITICAL: Put closing </code></pre> tags on a new line'
                ],
                'documentation': 'See private_html/articles/CLAUDE.md for details'
            }
            print(json.dumps(error_msg, indent=2), file=sys.stderr)
            return 1  # Block the operation

        return 0  # Allow the operation

    except Exception as e:
        # Log error but don't block (fail open for safety)
        print(f"Hook error: {e}", file=sys.stderr)
        return 0


if __name__ == '__main__':
    sys.exit(main())
