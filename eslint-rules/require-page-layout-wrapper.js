/**
 * ESLint Rule: require-page-layout-wrapper
 *
 * Ensures all page components in src/pages/ import and use the <Page> wrapper.
 *
 * The <Page> component provides:
 * - Navigation header (sticky, with active states)
 * - Main content wrapper
 * - Footer
 * - Document title and meta description updates
 *
 * Without <Page>, a page will have no navigation or footer.
 *
 * GOOD:
 * ```tsx
 * import { Page } from '../components/layout/Page';
 * // or: import { Page } from '@/components/layout/Page';
 *
 * export function About() {
 *   return (
 *     <Page title="About - LTSCommerce" description="...">
 *       <Section>...</Section>
 *     </Page>
 *   );
 * }
 * ```
 *
 * BAD - no Page import:
 * ```tsx
 * export function About() {
 *   return <div>Content without navigation or footer</div>;
 * }
 * ```
 *
 * BAD - Page imported but not used in JSX:
 * ```tsx
 * import { Page } from '../components/layout/Page';
 * export function About() {
 *   return <div>Raw div instead of Page</div>;
 * }
 * ```
 *
 * Adapted from EC site require-page-layout-wrapper for LTS Page component.
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require page components to use the <Page> layout wrapper',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingPageImport:
        'Page component must import Page from @/components/layout/Page\n' +
        "   Add: import { Page } from '@/components/layout/Page';\n" +
        '   Then wrap your page content in <Page title="..." description="...">...</Page>\n' +
        '   Page provides Navigation, main content wrapper, and Footer automatically.\n' +
        '\n' +
        'See: eslint-rules/require-page-layout-wrapper.md for guidance',
      missingPageWrapper:
        'Page component must wrap content in <Page> element.\n' +
        '   Page is imported but not used in JSX return statement.\n' +
        '   Wrap your JSX: <Page title="..." description="...">...</Page>\n' +
        '   Page provides Navigation, main content wrapper, and Footer automatically.\n' +
        '\n' +
        'See: eslint-rules/require-page-layout-wrapper.md for guidance',
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

    let hasPageImport = false;
    let hasPageInJSX = false;

    return {
      // Track Page import from layout
      ImportDeclaration(node) {
        const source = node.source.value;

        // Accept both alias and relative paths to Page component
        const isPageLayoutImport =
          source === '@/components/layout/Page' ||
          source === '../components/layout/Page' ||
          source === '../../components/layout/Page' ||
          source.endsWith('/components/layout/Page');

        if (isPageLayoutImport) {
          // Check for named import of 'Page'
          const namedImport = node.specifiers.find(
            (spec) =>
              spec.type === 'ImportSpecifier' &&
              spec.imported &&
              spec.imported.name === 'Page'
          );

          if (namedImport) {
            hasPageImport = true;
          }
        }
      },

      // Track Page usage in JSX
      JSXElement(node) {
        if (node.openingElement && node.openingElement.name) {
          const elementName = node.openingElement.name;

          if (elementName.type === 'JSXIdentifier' && elementName.name === 'Page') {
            hasPageInJSX = true;
          }
        }
      },

      // At end of file, enforce Page usage
      'Program:exit'(node) {
        if (!hasPageImport) {
          context.report({
            node,
            messageId: 'missingPageImport',
          });
          return;
        }

        if (!hasPageInJSX) {
          context.report({
            node,
            messageId: 'missingPageWrapper',
          });
        }
      },
    };
  },
};
