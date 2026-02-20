/**
 * ESLint Rule: no-unescaped-quotes-in-meta
 *
 * Prevents unescaped double quotes in SEO metadata string props on the <Page>
 * component that could cause HTML attribute parsing errors when rendered in
 * meta tags.
 *
 * LTS Commerce passes SEO data as JSX string props to <Page>:
 *   <Page title="..." description="..." />
 *
 * JSX attribute strings use double quotes as delimiters. If the string value
 * itself contains double quotes, they must be escaped or the string must use
 * single quotes (JSX string props don't support single-quote delimiters in
 * the same way HTML does, so use HTML entity &quot; or restructure to avoid).
 *
 * More commonly, this catches strings written as single-quoted JS in JSX
 * expression containers that contain unescaped double quotes.
 *
 * BAD - unescaped double quotes in single-quoted string:
 * ```tsx
 * <Page
 *   title={'Expert "PHP" Developer'}
 *   description={'84% trust "almost right" solutions for complex systems'}
 * />
 * ```
 *
 * GOOD - use single quotes inside the string, or escape:
 * ```tsx
 * <Page
 *   title="Expert PHP Developer"
 *   description="84% trust reliable solutions for complex systems"
 * />
 * ```
 *
 * Adapted from EC site no-unescaped-quotes-in-meta for LTS inline-SEO pattern.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow unescaped double quotes in Page SEO prop strings to prevent HTML meta tag parsing errors',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      unescapedQuotesInMeta:
        'Unescaped double quotes in `{{prop}}` prop will cause HTML attribute parsing errors in meta tags.\n' +
        '   Use single quotes inside the string, or avoid quotes in SEO metadata.\n' +
        '   Current value contains unescaped ": {{value}}\n' +
        '\n' +
        'See: eslint-rules/no-unescaped-quotes-in-meta.md for guidance',
    },
    schema: [],
    fixable: null,
  },

  create(context) {
    const filename = context.getFilename();

    // Only check files in src/pages/
    if (!filename.includes('/src/pages/') && !filename.includes('\\src\\pages\\')) {
      return {};
    }

    // Only check .tsx files
    if (!filename.endsWith('.tsx')) {
      return {};
    }

    return {
      // Check <Page> JSX elements for unescaped quotes in title/description
      JSXOpeningElement(node) {
        // Only check elements named 'Page'
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'Page') {
          return;
        }

        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute') continue;

          const propName = attr.name.name;

          // Only check SEO-relevant props
          if (propName !== 'title' && propName !== 'description') continue;

          if (!attr.value) continue;

          // Case 1: JSX string literal attribute - e.g. title="value with "quotes""
          // JSX string attributes use double quotes as delimiters; inner double quotes
          // are technically invalid HTML but browsers may parse them unexpectedly
          if (attr.value.type === 'Literal' && typeof attr.value.value === 'string') {
            const value = attr.value.value;
            const raw = attr.value.raw || '';

            // If it's a single-quoted string containing unescaped double quotes
            if (raw.startsWith("'") && value.includes('"') && !raw.includes('\\"')) {
              context.report({
                node: attr.value,
                messageId: 'unescapedQuotesInMeta',
                data: {
                  prop: propName,
                  value: value.length > 60 ? value.substring(0, 60) + '...' : value,
                },
              });
            }
          }

          // Case 2: JSX expression container with string literal - e.g. title={'value "quoted"'}
          if (attr.value.type === 'JSXExpressionContainer') {
            const expr = attr.value.expression;

            if (expr.type === 'Literal' && typeof expr.value === 'string') {
              const value = expr.value;
              const raw = expr.raw || '';

              // Single-quoted string containing unescaped double quotes
              if (raw.startsWith("'") && value.includes('"') && !raw.includes('\\"')) {
                context.report({
                  node: expr,
                  messageId: 'unescapedQuotesInMeta',
                  data: {
                    prop: propName,
                    value: value.length > 60 ? value.substring(0, 60) + '...' : value,
                  },
                });
              }
            }
          }
        }
      },
    };
  },
};
