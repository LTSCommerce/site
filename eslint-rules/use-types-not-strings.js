/**
 * ESLint Rule: use-types-not-strings
 *
 * Prevents using string literals where typed alternatives exist.
 * This is a configurable rule that can be extended per-project.
 *
 * ❌ Bad:  const status = "active";  (when Status.Active exists)
 * ✅ Good: const status = Status.Active;
 *
 * Why: Magic strings are untyped data references. Using typed constants:
 * - Catches typos at compile time
 * - Enables autocomplete
 * - Safe refactoring
 * - Self-documenting code
 *
 * Configuration (in eslint.config.js):
 * ```js
 * rules: {
 *   'custom/use-types-not-strings': ['error', {
 *     patterns: [
 *       { match: /^(active|pending|complete)$/, type: 'Status', import: '@/types/status' },
 *       { match: /^(php|infrastructure|database|ai)$/, type: 'CATEGORIES', import: '@/data/categories' }
 *     ]
 *   }]
 * }
 * ```
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow string literals where typed alternatives exist',
      category: 'Type Safety',
      recommended: true,
    },
    messages: {
      useTypedConstant:
        'String literal "{{value}}" should use typed constant {{type}} instead (import from {{importPath}})',
    },
    schema: [
      {
        type: 'object',
        properties: {
          patterns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                match: {
                  type: 'string', // Regex pattern as string
                },
                type: {
                  type: 'string', // Name of typed constant
                },
                import: {
                  type: 'string', // Import path
                },
              },
              required: ['match', 'type'],
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const patterns = (options.patterns || []).map((pattern) => ({
      ...pattern,
      match: new RegExp(pattern.match),
    }));

    // If no patterns configured, provide sensible defaults for skeleton
    if (patterns.length === 0) {
      // Skeleton has no magic strings by design, so no defaults
      // Sites will configure their own patterns
      return {};
    }

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;

        const value = node.value;

        // Check each pattern
        for (const pattern of patterns) {
          if (pattern.match.test(value)) {
            context.report({
              node,
              messageId: 'useTypedConstant',
              data: {
                value,
                type: pattern.type,
                importPath: pattern.import || '(project-defined)',
              },
            });
            break; // Report only first match
          }
        }
      },
    };
  },
};
