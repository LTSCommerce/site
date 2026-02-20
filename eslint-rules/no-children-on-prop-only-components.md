# Rule: no-children-on-prop-only-components

**Namespace**: `custom/no-children-on-prop-only-components`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

JSX elements that pass children to components configured as prop-only (i.e.,
components whose TypeScript interfaces define `children?: never`).

The component list is configured in `eslint.config.js` and starts empty.
It should be populated as components with `children?: never` are added during
Plan 007 (Component Library).

## Why It Was Added

Some components are designed exclusively for props-based content - they have
no children rendering logic. When children are passed to these components:

1. TypeScript catches it at compile time via `children?: never`
2. This rule catches it at lint time (faster feedback)
3. The runtime behaviour is undefined/broken

This is important for a growing component library where new prop-only components
are regularly added.

## Configuration

Add component names to the `components` array in `eslint.config.js` as they
gain `children?: never` in their TypeScript interfaces:

```js
// eslint.config.js
'custom/no-children-on-prop-only-components': [
  'error',
  {
    components: [
      'SkillBadge',    // eslint-rules: children?: never
      'StatCard',      // eslint-rules: children?: never
      'TechTag',       // eslint-rules: children?: never
    ],
  },
],
```

## Violations and Correct Patterns

Assuming `SkillBadge` is configured as prop-only:

BAD:
```tsx
<SkillBadge>PHP</SkillBadge>
<StatCard>20+ years</StatCard>
```

GOOD:
```tsx
<SkillBadge label="PHP" level="expert" />
<StatCard value="20+" label="Years Experience" />
```

## Adding New Components

When creating a component with `children?: never` in its TypeScript interface:

1. Add the component name to the `components` array in `eslint.config.js`
2. This ensures misuse is caught at lint time, not just at TypeScript compile time

## Fix Guidance

Remove children from the JSX element and pass the content as explicit props instead.
Check the component's TypeScript interface to see which props it accepts.
