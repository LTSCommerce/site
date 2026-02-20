# Rule: no-window-location

**Namespace**: `custom/no-window-location`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

- `window.location.href = url` - assignment causes full page reload
- `window.location.assign(url)` - method call causes full page reload
- `window.location.replace(url)` - method call causes full page reload
- External `<a>` links without `target="_blank"`
- External `<a>` links with `target="_blank"` but without `rel="noopener noreferrer"`

## Why It Was Added

LTS Commerce is a React SPA. Using `window.location` for navigation causes a full
page reload (white flash) instead of smooth client-side navigation. This:

- Destroys the SPA user experience
- Loses React state
- Causes unnecessary network requests

Additionally, external links without `rel="noopener noreferrer"` are a security
vulnerability (tabnabbing) and performance issue.

## Violations and Correct Patterns

BAD - full page reload for internal navigation:
```ts
window.location.href = '/about';
window.location.assign(ROUTES.about.path);
```

GOOD - SPA navigation:
```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate(ROUTES.about.path);
```

GOOD - Link component:
```tsx
import { Link } from 'react-router-dom';
<Link to={ROUTES.about.path}>About</Link>
```

BAD - external link missing attributes:
```tsx
<a href="https://example.com">Link</a>
```

GOOD - external link with required attributes:
```tsx
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>
```

## Exception: mailto: and tel: URIs

`window.location.href = 'mailto:...'` would normally be flagged, but the rule
allows mailto: and tel: static string literals since these open the user's email/phone
app rather than navigating the browser.

However, with dynamic mailto: links (variables), the rule cannot statically verify
the value is a mailto: URI, so it will flag the assignment. In that case, use an
anchor element instead:

```ts
// BAD - dynamic variable, rule cannot verify it's a mailto URI
const mailtoLink = `mailto:${email}?body=${body}`;
window.location.href = mailtoLink; // flagged

// GOOD - use anchor element
const anchor = document.createElement('a');
anchor.href = mailtoLink;
anchor.click();
```

## Fix Guidance

1. For internal navigation: use `useNavigate()` from react-router-dom
2. For `<Link>` components: use `<Link to={ROUTES.page.path}>`
3. For external links: add `target="_blank" rel="noopener noreferrer"`
4. For mailto/tel dynamic URIs: create and click a temporary anchor element
