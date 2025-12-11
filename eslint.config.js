import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Import our custom rules
import noHardcodedRoutes from './eslint-rules/no-hardcoded-routes.js';
import noStringLinkProps from './eslint-rules/no-string-link-props.js';
import useTypesNotStrings from './eslint-rules/use-types-not-strings.js';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
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
          'no-hardcoded-routes': noHardcodedRoutes,
          'no-string-link-props': noStringLinkProps,
          'use-types-not-strings': useTypesNotStrings,
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

      // Our custom type safety rules
      'custom/no-hardcoded-routes': 'error',
      'custom/no-string-link-props': 'error',
      'custom/use-types-not-strings': [
        'error', // LTS site enforces type safety strictly
        {
          patterns: [
            {
              match: /^(php|infrastructure|database|ai|typescript)$/,
              type: 'CATEGORIES',
              import: '@/data/categories',
            },
          ],
        },
      ],
    },
  }
);
