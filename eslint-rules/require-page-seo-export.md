# Rule: require-page-seo-export

**Namespace**: `custom/require-page-seo-export`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

Page files in `src/pages/` that use a `<Page>` component without both required SEO props:
- Missing `title` prop
- Missing `description` prop

## Why It Was Added

Every page on LTS Commerce needs proper SEO metadata for:
- Browser tab display (title)
- Search engine indexing (title + description)
- Social sharing previews

Without both props, pages get no SEO metadata, harming search visibility.

This rule enforces that SEO is never forgotten at lint time rather than discovered
after deployment when search rankings have already suffered.

## LTS SEO Pattern

LTS Commerce passes SEO data inline as props to the `<Page>` layout component.
This differs from the EC site pattern of separate `-meta.ts` files.

GOOD:
```tsx
import { Page } from '@/components/layout/Page';

export function About() {
  return (
    <Page
      title="About Joseph - Bespoke PHP Developer | LTSCommerce"
      description="Over 20 years building complex PHP systems. Expert in legacy modernisation, infrastructure automation, and large-scale backend architecture."
    >
      <Section>...</Section>
    </Page>
  );
}
```

BAD - missing description:
```tsx
export function About() {
  return (
    <Page title="About - LTSCommerce">
      <Section>...</Section>
    </Page>
  );
}
```

BAD - missing both props:
```tsx
export function About() {
  return (
    <Page>
      <Section>...</Section>
    </Page>
  );
}
```

## Fix Guidance

Add both `title` and `description` props to the `<Page>` component.

For character length requirements, see `validate-seo-metadata.md`.

Title format: `"Page Name - LTSCommerce"` or `"Page Name | LTSCommerce"`
Description: 120-170 characters describing the page content and value proposition.
