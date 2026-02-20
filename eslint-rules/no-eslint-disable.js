/**
 * ESLint Rule: no-eslint-disable
 *
 * Bans all ESLint suppression comments and TypeScript @ts-ignore.
 *
 * This rule bans:
 * - eslint-disable
 * - eslint-disable-line
 * - eslint-disable-next-line
 * - @ts-ignore
 *
 * Philosophy: Fix the problem, don't hide it.
 *
 * If a suppression is genuinely required (very rare), use a targeted override
 * in eslint.config.js for that file pattern, with a comment explaining why.
 *
 * Adapted from EC site rule for LTS Commerce.
 */

export default {
  meta: {
    type: 'problem',
    messages: {
      noDisable:
        'ESLint suppression comments are banned. Fix the violation instead of hiding it.\n' +
        '\n' +
        'If suppression is genuinely needed, add a file-level override in eslint.config.js\n' +
        'with a comment explaining why the rule cannot be followed.\n' +
        '\n' +
        'See: eslint-rules/no-eslint-disable.md for guidance',
      noTsIgnore:
        'TypeScript @ts-ignore is banned. Fix the type error or use a proper type assertion.\n' +
        '\n' +
        'See: eslint-rules/no-eslint-disable.md for guidance',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      Program() {
        const comments = sourceCode.getAllComments();

        for (const comment of comments) {
          const text = comment.value.trim();

          // Check for eslint-disable patterns (any variant)
          if (/eslint-disable/.test(text)) {
            context.report({
              loc: comment.loc,
              messageId: 'noDisable',
            });
          }

          // Check for @ts-ignore (but not @ts-expect-error which is valid TypeScript)
          if (/@ts-ignore/.test(text)) {
            context.report({
              loc: comment.loc,
              messageId: 'noTsIgnore',
            });
          }
        }
      },
    };
  },
};
