import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Import our custom rules
import noHardcodedRoutes from './eslint-rules/no-hardcoded-routes.js';
import noStringLinkProps from './eslint-rules/no-string-link-props.js';
import useTypesNotStrings from './eslint-rules/use-types-not-strings.js';

// Category A: High-value rules (adopted from EC site)
import noPlaceholder from './eslint-rules/no-placeholder.js';
import noEslintDisable from './eslint-rules/no-eslint-disable.js';
import noWindowLocation from './eslint-rules/no-window-location.js';
import requirePageSeoExport from './eslint-rules/require-page-seo-export.js';
import validateSeoMetadata from './eslint-rules/validate-seo-metadata.js';

// Category B: Adapted rules (modified for LTS context)
import requirePageLayoutWrapper from './eslint-rules/require-page-layout-wrapper.js';
import noUnescapedQuotesInMeta from './eslint-rules/no-unescaped-quotes-in-meta.js';
import noChildrenOnPropOnlyComponents from './eslint-rules/no-children-on-prop-only-components.js';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'code-snippets', 'untracked', 'ARCHIVE', 'var', 'tailwind.config.ts'] },

  // Main config: applies to all TypeScript and TSX files
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      // Register our custom rules under 'custom' namespace
      custom: {
        rules: {
          // Existing rules (Plan 001)
          'no-hardcoded-routes': noHardcodedRoutes,
          'no-string-link-props': noStringLinkProps,
          'use-types-not-strings': useTypesNotStrings,

          // Category A: High-value rules (Plan 008)
          'no-placeholder': noPlaceholder,
          'no-eslint-disable': noEslintDisable,
          'no-window-location': noWindowLocation,
          'require-page-seo-export': requirePageSeoExport,
          'validate-seo-metadata': validateSeoMetadata,

          // Category B: Adapted rules (Plan 008)
          'require-page-layout-wrapper': requirePageLayoutWrapper,
          'no-unescaped-quotes-in-meta': noUnescapedQuotesInMeta,
          'no-children-on-prop-only-components': noChildrenOnPropOnlyComponents,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript strict rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off', // React components don't need explicit returns
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Our custom type safety rules (Plan 001)
      'custom/no-hardcoded-routes': 'error',
      'custom/no-string-link-props': 'error',
      'custom/use-types-not-strings': [
        'error', // LTS site enforces type safety strictly
        {
          patterns: [
            {
              match: '^(php|infrastructure|database|ai|typescript)$',
              type: 'CATEGORIES',
              import: '@/data/categories',
            },
          ],
        },
      ],

      // Plan 008: Category A - High-value rules
      'custom/no-placeholder': 'error',
      'custom/no-eslint-disable': 'error',
      'custom/no-window-location': 'error',
      'custom/require-page-seo-export': 'error',
      'custom/validate-seo-metadata': 'error',

      // Plan 008: Category B - Adapted rules
      'custom/require-page-layout-wrapper': 'error',
      'custom/no-unescaped-quotes-in-meta': 'error',
      'custom/no-children-on-prop-only-components': [
        'error',
        {
          // Populate this list as components gain `children?: never` in their
          // TypeScript interfaces (Plan 007: Component Library)
          components: [],
        },
      ],
    },
  },

  // File-level overrides - must come AFTER the main config to take precedence.
  // ESLint flat config merges in order: later entries win.
  // Each override documents exactly why it is needed.
  {
    // categories.ts defines the CATEGORIES constant itself - the use-types-not-strings rule
    // cannot apply here because this IS the source of truth, not a consumer of it.
    files: ['**/src/data/categories.ts'],
    rules: {
      'custom/use-types-not-strings': 'off',
    },
  },
  {
    // articles.ts holds raw article data including HTML content strings that trigger
    // false positives from use-types-not-strings (category-like words appear in article
    // body HTML for display purposes, not as CATEGORIES references).
    // no-useless-escape covers escape sequences inside template literal article content.
    files: ['**/src/data/articles.ts'],
    rules: {
      'custom/use-types-not-strings': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    // ArticleContent.tsx uses Highlight.js language identifier strings ('javascript', 'php', etc.)
    // These are Highlight.js API values, not our CATEGORIES references. They look like category
    // strings but serve a completely different purpose (syntax highlighting language names).
    files: ['**/src/components/article/ArticleContent.tsx'],
    rules: {
      'custom/use-types-not-strings': 'off',
    },
  },
  {
    // Contact.tsx form select options use string values like "infrastructure", "php", etc.
    // These are HTML form option values sent in the contact form submission body, not
    // references to the CATEGORIES data structure. The use-types-not-strings rule would
    // require importing CATEGORIES just to populate <option value> strings, which is
    // unnecessary coupling between a contact form and the article category system.
    files: ['**/src/pages/Contact.tsx'],
    rules: {
      'custom/use-types-not-strings': 'off',
    },
  }
);
