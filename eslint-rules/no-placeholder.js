/**
 * ESLint Rule: no-placeholder
 *
 * Blocks the use of "PLACEHOLDER" string in code to prevent incomplete/unfinished
 * content from making it to production.
 *
 * PLACEHOLDER text indicates incomplete work and should never ship to production:
 * - SEO metadata (titles, descriptions)
 * - UI text and labels
 * - Error messages
 * - Any user-facing content
 *
 * GOOD:
 * const title = "LTSCommerce - Bespoke PHP Development";
 * const description = "Expert PHP development and infrastructure solutions";
 *
 * BAD:
 * const title = "PLACEHOLDER | LTSCommerce";
 * const description = "PLACEHOLDER description that meets minimum character requirement";
 *
 * Adapted from EC site rule. Lowercase "placeholder" is allowed (e.g. HTML input
 * placeholder attributes) - only uppercase PLACEHOLDER is blocked.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent PLACEHOLDER text from appearing in code',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      placeholderFound:
        'PLACEHOLDER text found in string literal.\n' +
        '   This indicates incomplete/unfinished content that should not ship to production.\n' +
        '   Replace with actual content:\n' +
        '      - SEO: Write proper title/description\n' +
        '      - UI: Write actual label/text\n' +
        '      - Messages: Write clear error/success message\n' +
        '\n' +
        '   Found: "{{ value }}"\n' +
        '\n' +
        'See: eslint-rules/no-placeholder.md for fix guidance',
    },
    schema: [],
  },

  create(context) {
    return {
      // Check all string literals in the code
      Literal(node) {
        // Only check string literals
        if (typeof node.value !== 'string') {
          return;
        }

        // Check if the string contains "PLACEHOLDER" (case-sensitive - only uppercase is incomplete content)
        // Lowercase "placeholder" is legitimate technical terminology (e.g., HTML placeholder attribute)
        if (node.value.includes('PLACEHOLDER')) {
          context.report({
            node,
            messageId: 'placeholderFound',
            data: {
              value: node.value.length > 100 ? node.value.substring(0, 100) + '...' : node.value,
            },
          });
        }
      },

      // Also check template literals: `PLACEHOLDER ${var}`
      TemplateLiteral(node) {
        // Check template literal quasis (the string parts)
        for (const quasi of node.quasis) {
          // Check if the string contains "PLACEHOLDER" (case-sensitive - only uppercase is incomplete content)
          if (quasi.value.raw.includes('PLACEHOLDER')) {
            context.report({
              node: quasi,
              messageId: 'placeholderFound',
              data: {
                value:
                  quasi.value.raw.length > 100
                    ? quasi.value.raw.substring(0, 100) + '...'
                    : quasi.value.raw,
              },
            });
          }
        }
      },
    };
  },
};
