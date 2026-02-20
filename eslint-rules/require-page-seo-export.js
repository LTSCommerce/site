/**
 * ESLint Rule: require-page-seo-export
 *
 * Ensures all page components pass both `title` and `description` props to
 * the <Page> wrapper component.
 *
 * LTS Commerce uses inline SEO props on <Page> rather than separate -meta.ts
 * files. This rule enforces that both required SEO props are present.
 *
 * GOOD:
 * ```tsx
 * export function About() {
 *   return (
 *     <Page
 *       title="About - LTSCommerce"
 *       description="Expert PHP developer specializing in complex systems"
 *     >
 *       ...
 *     </Page>
 *   );
 * }
 * ```
 *
 * BAD - missing description prop:
 * ```tsx
 * export function About() {
 *   return (
 *     <Page title="About - LTSCommerce">
 *       ...
 *     </Page>
 *   );
 * }
 * ```
 *
 * BAD - missing both props:
 * ```tsx
 * export function About() {
 *   return (
 *     <Page>
 *       ...
 *     </Page>
 *   );
 * }
 * ```
 *
 * Adapted from EC site require-page-seo-export for LTS inline-SEO pattern.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require page components to pass title and description to <Page> component',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingTitleProp:
        'Page component is missing required `title` prop on <Page>.\n' +
        '   Every page must have a title for SEO and browser tab display.\n' +
        '   Add: <Page title="Page Name - LTSCommerce" description="...">\n' +
        '\n' +
        'See: eslint-rules/require-page-seo-export.md for guidance',
      missingDescriptionProp:
        'Page component is missing required `description` prop on <Page>.\n' +
        '   Every page must have a description for SEO meta tags.\n' +
        '   Add: <Page title="..." description="Descriptive text for search engines">\n' +
        '\n' +
        'See: eslint-rules/require-page-seo-export.md for guidance',
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
      // Check every <Page> JSX element for required props
      JSXOpeningElement(node) {
        // Only check elements named 'Page'
        if (node.name.type !== 'JSXIdentifier' || node.name.name !== 'Page') {
          return;
        }

        const attrs = node.attributes;

        const hasTitle = attrs.some(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name.name === 'title' &&
            attr.value != null
        );

        const hasDescription = attrs.some(
          (attr) =>
            attr.type === 'JSXAttribute' &&
            attr.name.name === 'description' &&
            attr.value != null
        );

        if (!hasTitle) {
          context.report({
            node,
            messageId: 'missingTitleProp',
          });
        }

        if (!hasDescription) {
          context.report({
            node,
            messageId: 'missingDescriptionProp',
          });
        }
      },
    };
  },
};
