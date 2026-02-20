/**
 * ESLint Rule: validate-seo-metadata
 *
 * Validates SEO metadata character lengths on <Page> component props
 * in src/pages/ files.
 *
 * LTS Commerce passes SEO data inline as props to <Page>:
 *   <Page title="..." description="...">
 *
 * This rule enforces character limits that match search engine constraints:
 * - title: 30-70 characters (Google truncates at ~60)
 * - description: 120-170 characters (Google truncates at ~160)
 *
 * Only validates static string literals - dynamic/computed values are skipped
 * since they cannot be checked at lint time.
 *
 * GOOD:
 * ```tsx
 * <Page
 *   title="About - LTSCommerce"
 *   description="Expert PHP developer with 20+ years building complex, high-performance systems. Specialising in legacy modernisation and infrastructure."
 * >
 * ```
 *
 * BAD - title too short:
 * ```tsx
 * <Page title="About" description="..." />  // Only 5 chars, min 30
 * ```
 *
 * BAD - description too long:
 * ```tsx
 * <Page title="..." description="This description is far too long and goes well beyond the 170 character limit that search engines use, causing it to be cut off in search results." />
 * ```
 *
 * Adapted from EC site validate-seo-metadata for LTS inline-SEO pattern.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate SEO metadata character lengths on <Page> component props',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      titleTooShort:
        'SEO title too short ({{actual}} chars, minimum 30 required).\n' +
        '   Current: "{{value}}"\n' +
        '   Make it descriptive and include the brand: "Page Name - LTSCommerce"\n' +
        '\n' +
        'See: eslint-rules/validate-seo-metadata.md for guidance',
      titleTooLong:
        'SEO title too long ({{actual}} chars, maximum 70 allowed).\n' +
        '   Current: "{{value}}"\n' +
        '   Google truncates at ~60 chars. Shorten while keeping key info.\n' +
        '\n' +
        'See: eslint-rules/validate-seo-metadata.md for guidance',
      descriptionTooShort:
        'SEO description too short ({{actual}} chars, minimum 120 required).\n' +
        '   Current: "{{value}}"\n' +
        '   Expand with benefits, expertise, or differentiators (aim for 140-160 chars).\n' +
        '\n' +
        'See: eslint-rules/validate-seo-metadata.md for guidance',
      descriptionTooLong:
        'SEO description too long ({{actual}} chars, maximum 170 allowed).\n' +
        '   Current: "{{value}}"\n' +
        '   Google truncates at ~160 chars. Be more concise.\n' +
        '\n' +
        'See: eslint-rules/validate-seo-metadata.md for guidance',
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

    // Skip test files
    if (filename.endsWith('.test.tsx') || filename.endsWith('.test.ts')) {
      return {};
    }

    // Only check .tsx files (page components)
    if (!filename.endsWith('.tsx')) {
      return {};
    }

    return {
      // Check <Page> JSX elements for title and description prop values
      JSXOpeningElement(node) {
        // Only check elements named 'Page'
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'Page') {
          return;
        }

        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute') continue;
          if (!attr.value) continue;

          // Only validate static string literals (skip expressions/variables)
          if (attr.value.type !== 'Literal') continue;
          if (typeof attr.value.value !== 'string') continue;

          const value = attr.value.value;
          const len = value.length;
          const propName = attr.name.name;

          if (propName === 'title') {
            if (len < 30) {
              context.report({
                node: attr.value,
                messageId: 'titleTooShort',
                data: {
                  actual: len,
                  value: len > 80 ? value.substring(0, 80) + '...' : value,
                },
              });
            } else if (len > 70) {
              context.report({
                node: attr.value,
                messageId: 'titleTooLong',
                data: {
                  actual: len,
                  value: len > 80 ? value.substring(0, 80) + '...' : value,
                },
              });
            }
          }

          if (propName === 'description') {
            if (len < 120) {
              context.report({
                node: attr.value,
                messageId: 'descriptionTooShort',
                data: {
                  actual: len,
                  value: len > 80 ? value.substring(0, 80) + '...' : value,
                },
              });
            } else if (len > 170) {
              context.report({
                node: attr.value,
                messageId: 'descriptionTooLong',
                data: {
                  actual: len,
                  value: len > 80 ? value.substring(0, 80) + '...' : value,
                },
              });
            }
          }
        }
      },
    };
  },
};
