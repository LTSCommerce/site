# Rule: require-page-layout-wrapper

**Namespace**: `custom/require-page-layout-wrapper`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

Page files in `src/pages/` that either:
1. Do not import `Page` from `@/components/layout/Page` (or relative equivalent)
2. Import `Page` but don't use `<Page>` in their JSX return

## Why It Was Added

The `Page` layout component provides the entire page structure:
- Sticky navigation header with active state tracking
- Main content wrapper with flex layout
- Footer

Without `<Page>`, a page component will render raw content with no navigation or
footer, breaking the site's visual structure. This rule enforces the wrapper is
never forgotten at lint time.

## LTS Page Pattern

Every page in `src/pages/` must use `<Page>` as the outermost wrapper:

```tsx
import { Page } from '@/components/layout/Page';
// or: import { Page } from '../components/layout/Page';

export function About() {
  return (
    <Page
      title="About Joseph - Bespoke PHP Developer | LTSCommerce"
      description="..."
    >
      <Section>...</Section>
      <Container>...</Container>
    </Page>
  );
}
```

## Violations

BAD - no Page import:
```tsx
export function About() {
  return (
    <div>
      <h1>About</h1>
    </div>
  );
}
```

BAD - Page imported but not used:
```tsx
import { Page } from '@/components/layout/Page';

export function About() {
  return (
    <main>
      <h1>About</h1>
    </main>
  );
}
```

## Fix Guidance

1. Add `import { Page } from '@/components/layout/Page';`
2. Wrap the entire component return in `<Page title="..." description="...">`
3. See `require-page-seo-export.md` for required title/description props
