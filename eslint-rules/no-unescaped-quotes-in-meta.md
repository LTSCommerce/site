# Rule: no-unescaped-quotes-in-meta

**Namespace**: `custom/no-unescaped-quotes-in-meta`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

Unescaped double quotes inside single-quoted string literals used as `title` or
`description` props on the `<Page>` component in `src/pages/` files.

These strings are rendered into HTML `<meta>` attribute values. Double quotes inside
single-quoted strings will break the HTML attribute when rendered:

```html
<!-- The double quotes in the value break the attribute -->
<meta name="description" content="84% trust "almost right" solutions">
```

## Why It Was Added

HTML meta tag attributes use double quotes as delimiters. If the attribute value
contains unescaped double quotes, browsers and search engines may misparse the HTML,
truncating the meta content at the first unescaped double quote.

This causes silent SEO damage: the description appears correct in source but is
truncated in search results.

## Violations and Correct Patterns

BAD - single-quoted string with double quotes inside:
```tsx
<Page
  title={'Expert "PHP" Developer | LTSCommerce'}
  description={'84% trust "expert" solutions for complex systems'}
/>
```

The string `'Expert "PHP" Developer'` contains unescaped double quotes that will
break the HTML meta attribute.

GOOD - use single quotes inside the string instead:
```tsx
<Page
  title="Expert PHP Developer | LTSCommerce"
  description="84% trust expert solutions for complex systems"
/>
```

GOOD - avoid quotes in SEO metadata altogether:
```tsx
<Page
  title="Expert PHP Developer | LTSCommerce"
  description="Trusted solutions for complex backend PHP systems"
/>
```

## Fix Guidance

The simplest fix for SEO metadata is to avoid quotes entirely - they are rarely
needed in titles or descriptions. If a quote is necessary:

1. Use single quotes in the string: `"84% trust 'expert' solutions"`
2. Or escape the double quotes: `'84% trust \\"expert\\" solutions'`
3. Or rephrase to avoid quotes entirely (recommended for SEO metadata)
