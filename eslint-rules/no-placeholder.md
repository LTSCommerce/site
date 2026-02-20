# Rule: no-placeholder

**Namespace**: `custom/no-placeholder`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

Any string literal or template literal containing the uppercase word `PLACEHOLDER`. This includes:

- SEO metadata: `title="PLACEHOLDER | LTSCommerce"`
- UI text: `const label = "PLACEHOLDER label"`
- Template literals: `` `PLACEHOLDER ${var}` ``

Lowercase `placeholder` is allowed (e.g., HTML `<input placeholder="Enter name">` attributes).

## Why It Was Added

PLACEHOLDER text indicates incomplete work that has not been replaced with real content.
It should never ship to production because:

- SEO suffers: search engines index the placeholder text
- User experience breaks: visible "PLACEHOLDER" in the UI
- Professional credibility is damaged

This rule enforces the discipline of replacing placeholder content before committing.

## Violations and Correct Patterns

BAD:
```tsx
<Page
  title="PLACEHOLDER | LTSCommerce"
  description="PLACEHOLDER description that meets the minimum character requirement for SEO"
/>
```

GOOD:
```tsx
<Page
  title="About Joseph - Bespoke PHP Developer | LTSCommerce"
  description="Over 20 years building complex PHP systems. Expert in legacy modernisation and infrastructure automation."
/>
```

BAD:
```ts
const heroTitle = "PLACEHOLDER hero heading";
```

GOOD:
```ts
const heroTitle = "LTSCommerce: Bespoke PHP Development for Complex Systems";
```

## Fix Guidance

Replace the PLACEHOLDER text with real, meaningful content appropriate to the context.

For SEO metadata violations, also check `validate-seo-metadata` for character length requirements.
