// Project-specific ESLint additions. This file is merged AFTER ts-qa-ci's
// Tier A core config, never replaces it - any attempt to override a Tier A
// rule's severity here is rejected unless a matching entry exists in
// tier-a-exemptions.json (see resolveEslintConfig.ts).
//
// Migrated from the former root eslint.config.js (Plan 011 Task 4.2/4.3).
// custom/no-placeholder and custom/no-eslint-disable were dropped - both are
// now covered by ts-qa-ci's Tier A ts-qa/no-placeholder and
// ts-qa/no-eslint-disable, so the local duplicates were retired rather than
// double-registered. Everything else here is genuinely project-specific
// (route/SEO/category-system rules) and stays local per the ec-site-lift
// sign-off's lift/keep-private boundary.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

import noHardcodedRoutes from '../eslint-rules/no-hardcoded-routes.js';
import noStringLinkProps from '../eslint-rules/no-string-link-props.js';
import useTypesNotStrings from '../eslint-rules/use-types-not-strings.js';
import noWindowLocation from '../eslint-rules/no-window-location.js';
import requirePageSeoExport from '../eslint-rules/require-page-seo-export.js';
import validateSeoMetadata from '../eslint-rules/validate-seo-metadata.js';
import requirePageLayoutWrapper from '../eslint-rules/require-page-layout-wrapper.js';
import noUnescapedQuotesInMeta from '../eslint-rules/no-unescaped-quotes-in-meta.js';
import noChildrenOnPropOnlyComponents from '../eslint-rules/no-children-on-prop-only-components.js';

// import.meta.dirname here is tsQaConfig/, not the project root - resolve
// tsconfigRootDir explicitly rather than relying on this file's own location.
const projectRoot = new URL('..', import.meta.url).pathname;

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dist-server',
      'node_modules',
      'code-snippets',
      'untracked',
      'ARCHIVE',
      'var',
      'tailwind.config.ts',
      'vitest.config.ts',
      'scripts/',
      '.claude/',
      'cloudflare-workers/',
      // ts-qa-ci's own scaffolded config (hookPre.ts/hookPost.ts, this file) - not
      // part of the app's tsconfig.json/tsconfig.node.json project graph, so the
      // strictTypeChecked tier below can't type-check it (parserOptions.project
      // requires every linted file to belong to a listed project).
      'tsQaConfig/',
    ],
  },

  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.json'],
        tsconfigRootDir: projectRoot,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      custom: {
        rules: {
          'no-hardcoded-routes': noHardcodedRoutes,
          'no-string-link-props': noStringLinkProps,
          'use-types-not-strings': useTypesNotStrings,
          'no-window-location': noWindowLocation,
          'require-page-seo-export': requirePageSeoExport,
          'validate-seo-metadata': validateSeoMetadata,
          'require-page-layout-wrapper': requirePageLayoutWrapper,
          'no-unescaped-quotes-in-meta': noUnescapedQuotesInMeta,
          'no-children-on-prop-only-components': noChildrenOnPropOnlyComponents,
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Downgraded from the recommended 'error'. This rule shipped new in
      // eslint-plugin-react-hooks 6/7 (this repo was on 5.x until Plan 011 Task 4.1's
      // dependency bump pulled it in as a side effect of chasing current-stable
      // floors). Every instance found so far (Carousel/Typewriter/BlurText/etc.) is a
      // genuine "synchronize local state with an external system" effect (embla
      // carousel, animation timers, the copyright-year clock) - textbook useEffect
      // usage per React's own docs, not a bug. Redesigning each component's effect
      // pattern to satisfy the new rule is real application-behavior work, tracked
      // as CDD/animation-component follow-up (Plan 011 Task 4.6), not done blind
      // here. Kept at 'warn' rather than 'off' so it stays visible.
      'react-hooks/set-state-in-effect': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      'custom/no-hardcoded-routes': 'error',
      'custom/no-string-link-props': 'error',
      'custom/use-types-not-strings': [
        'error',
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

      'custom/no-window-location': 'error',
      'custom/require-page-seo-export': 'error',
      'custom/validate-seo-metadata': 'error',
      'custom/require-page-layout-wrapper': 'error',
      'custom/no-unescaped-quotes-in-meta': 'error',
      'custom/no-children-on-prop-only-components': [
        'error',
        {
          components: [],
        },
      ],
    },
  },

  {
    files: ['**/src/data/categories.ts'],
    rules: {
      'custom/use-types-not-strings': 'off',
    },
  },
  {
    files: ['**/src/data/articles.ts'],
    rules: {
      'custom/use-types-not-strings': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['**/src/components/article/ArticleContent.tsx'],
    rules: {
      'custom/use-types-not-strings': 'off',
    },
  },
  {
    files: ['**/src/pages/Contact.tsx'],
    rules: {
      'custom/use-types-not-strings': 'off',
    },
  },
  {
    files: ['**/src/components/ui/ThreeColumnFeatures.tsx'],
    rules: {
      'custom/no-string-link-props': 'off',
    },
  },
  {
    files: ['**/src/test-utils/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/src/entry-server.tsx'],
    rules: {
      'custom/no-string-link-props': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // main.tsx is Vite's client-only browser entry point (src/entry-server.tsx is the
    // separate SSR entry) - it structurally never executes during SSR/SSG, so its
    // module-top-level `document.getElementById('root')` is not an SSR-hydration risk.
    // See tsQaConfig/tier-a-exemptions.json for the matching justified exemption.
    files: ['**/src/main.tsx'],
    rules: {
      'ts-qa/ssr-safe-hooks': 'off',
    },
  }
);
