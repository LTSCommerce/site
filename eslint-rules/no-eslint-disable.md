# Rule: no-eslint-disable

**Namespace**: `custom/no-eslint-disable`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

Any comment that suppresses ESLint or TypeScript error reporting:

- `/* eslint-disable rule-name */`
- `// eslint-disable-line rule-name`
- `// eslint-disable-next-line rule-name`
- `/* @ts-ignore */`

Note: `@ts-expect-error` is NOT banned. It is valid TypeScript that documents an expected
type error and will fail if the error no longer exists, making it self-maintaining.

## Why It Was Added

Suppression comments hide problems instead of fixing them. They rot over time:

- The original reason is forgotten
- The suppressed violation remains
- Future developers can't tell if the suppression is still needed
- Code quality degrades silently

The discipline is: **fix the problem, don't hide it**.

## Violations and Correct Patterns

BAD:
```tsx
// eslint-disable-next-line custom/use-types-not-strings
const category = 'php';
```

GOOD:
```tsx
// Use the typed constant
const category = CATEGORIES.php.id;
```

BAD:
```ts
/* eslint-disable custom/no-hardcoded-routes */
const url = '/about';
```

GOOD:
```ts
const url = ROUTES.about.path;
```

## When Suppression Is Genuinely Needed

Rare cases exist where a rule cannot be followed for a legitimate reason.
The correct approach is a **file-level override in `eslint.config.js`**, not an inline comment:

```js
// eslint.config.js
{
  // Explain exactly why this file needs the override
  files: ['**/src/data/categories.ts'],
  rules: {
    'custom/use-types-not-strings': 'off',
  },
},
```

This makes the exception visible, documented, and reviewable.

## Fix Guidance

1. Remove the suppression comment
2. Fix the underlying violation the comment was hiding
3. If the violation is genuinely unavoidable, add a file-level override to `eslint.config.js`
   with a comment documenting exactly why
