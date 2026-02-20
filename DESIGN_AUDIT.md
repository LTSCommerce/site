# LTS Commerce React Site - Design Audit Report

**Date:** 2026-01-23
**Auditor:** Claude Sonnet 4.5
**Scope:** All components in `/workspace/src/components/` and `/workspace/src/pages/`

---

## Executive Summary

This audit identifies **23 design issues** across the React site, ranging from critical accessibility problems to inconsistent styling. The most severe issue is the Navigation component using undefined CSS classes (`text-primary-600`, `bg-primary-600`) which likely render as white/transparent text on white backgrounds.

### Issue Severity Breakdown
- **Critical:** 3 issues (broken navigation, missing theme config, inconsistent brand colors)
- **High:** 8 issues (accessibility, inconsistent spacing, missing hover states)
- **Medium:** 7 issues (styling inconsistencies, hard-coded colors)
- **Low:** 5 issues (minor typography, DRY violations)

---

## Critical Issues

### 1. Navigation Component - Undefined Color Classes
**Severity:** CRITICAL
**File:** `/workspace/src/components/layout/Navigation.tsx`
**Lines:** 53-54, 60

**Problem:**
```tsx
// Lines 53-54
? 'text-primary-600'
: 'text-gray-700 hover:text-primary-600'

// Line 60
<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
```

The Navigation component references `text-primary-600` and `bg-primary-600` Tailwind classes, but these are **NOT defined** anywhere. The CSS theme in `global.css` defines CSS variables like `--color-primary` but doesn't create corresponding Tailwind utility classes.

**Impact:** Navigation links likely render with default/white text color, making them invisible on white backgrounds.

**Suggested Fix:**
1. Create a proper Tailwind config file with primary color palette
2. OR use the CSS variables directly: `className="text-[var(--color-primary)]"`
3. OR use hard-coded color values: `className="text-[#0f4c81]"`

---

### 2. Missing Tailwind Configuration File
**Severity:** CRITICAL
**File:** `/workspace/tailwind.config.js` (missing)

**Problem:**
The project uses Tailwind CSS v4.x but has **no `tailwind.config.js` or `tailwind.config.ts` file** in the workspace root. The only config found is in `node_modules/` or `untracked/` directories.

This means:
- No custom color palette is defined
- Classes like `primary-600`, `primary-700` don't exist
- The brand color (#0f4c81) is only available as a CSS variable

**Impact:**
- Inconsistent styling across components
- Some components use undefined classes
- Unable to leverage Tailwind's type safety for colors

**Suggested Fix:**
Create `/workspace/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f1f8',
          100: '#d1e3f1',
          200: '#a3c7e3',
          300: '#75abd5',
          400: '#478fc7',
          500: '#1973b9',  // Lighter variant
          600: '#0f4c81',  // Brand primary
          700: '#0a3459',  // Darker variant
          800: '#072335',
          900: '#04131c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

### 3. Inconsistent Brand Color Usage
**Severity:** CRITICAL
**Files:** Multiple components

**Problem:**
The primary brand color (#0f4c81) is used inconsistently across components:

1. **Hard-coded hex values** (3 instances):
   - `/workspace/src/components/content/Hero.tsx:31`
   - `/workspace/src/pages/Home.tsx:98`
   - `/workspace/src/pages/Home.tsx:120`

   ```tsx
   className="bg-[#0f4c81] hover:bg-[#1e6ba5]"
   ```

2. **Generic Tailwind blue classes** (2 instances):
   - `/workspace/src/pages/About.tsx:199` - uses `bg-blue-600` instead of primary
   - `/workspace/src/pages/Contact.tsx:204, 212` - uses `text-blue-600` for links

3. **Undefined custom classes** (3 instances):
   - `/workspace/src/components/layout/Navigation.tsx` - uses `text-primary-600`

4. **Gradient with non-brand colors**:
   - `/workspace/src/pages/About.tsx:192` - uses `from-blue-50 to-indigo-50 border-blue-200`

**Impact:**
- Users see different shades of blue across the site
- Brand identity is diluted
- Makes future theme changes difficult

**Suggested Fix:**
After creating Tailwind config:
1. Replace all `bg-[#0f4c81]` with `bg-primary-600`
2. Replace all `hover:bg-[#1e6ba5]` with `hover:bg-primary-500`
3. Replace `bg-blue-600` with `bg-primary-600`
4. Replace `text-blue-600` with `text-primary-600`
5. Update gradient to use primary colors: `from-primary-50 to-primary-100 border-primary-200`

---

## High Priority Issues

### 4. ArticleList Filter Buttons - Poor Contrast (Active State)
**Severity:** HIGH
**File:** `/workspace/src/pages/ArticleList.tsx`
**Lines:** 56-66

**Problem:**
```tsx
const filterButtonStyle = (isActive: boolean) => ({
  backgroundColor: isActive ? '#1f2937' : '#ffffff',
  color: isActive ? '#ffffff' : '#374151',
  // ...
});
```

Active filter buttons use `#1f2937` (dark gray) background, which:
1. Doesn't match the brand color (#0f4c81)
2. Looks like a generic dark button, not "selected"
3. Inconsistent with rest of site's primary color usage

**Impact:** Users may not clearly understand which filter is active.

**Suggested Fix:**
```tsx
const filterButtonStyle = (isActive: boolean) => ({
  backgroundColor: isActive ? '#0f4c81' : '#ffffff',
  color: isActive ? '#ffffff' : '#374151',
  borderColor: isActive ? '#0f4c81' : '#d1d5db',
  fontWeight: isActive ? '600' : '500',
});
```

---

### 5. ArticleList - Inline Styles Instead of Tailwind/Components
**Severity:** HIGH
**File:** `/workspace/src/pages/ArticleList.tsx`
**Lines:** 39-88

**Problem:**
The entire ArticleList page uses inline JavaScript style objects instead of Tailwind classes or styled components:

```tsx
const headerStyle = { marginBottom: '2rem' };
const filtersContainerStyle = { display: 'flex', flexDirection: 'column' as const, gap: '1.5rem' };
// ... 8 more style objects
```

**Impact:**
1. **Inconsistent approach** - every other component uses Tailwind classes
2. **Larger bundle size** - inline styles are included in JS bundle
3. **No hover states** - buttons only change via JS function, not CSS
4. **Harder to maintain** - styles scattered in component logic
5. **No responsive design** - uses fixed values, not breakpoint-aware classes
6. **Accessibility** - harder to ensure proper focus states

**Suggested Fix:**
Refactor to use Tailwind classes like other components:

```tsx
// BEFORE
<div style={filtersContainerStyle}>

// AFTER
<div className="flex flex-col gap-6 mb-8">
```

```tsx
// BEFORE
<button style={filterButtonStyle(selectedCategory === 'all')}>

// AFTER
<button className={`
  px-4 py-2 rounded-md border text-sm font-medium transition-all
  ${selectedCategory === 'all'
    ? 'bg-primary-600 text-white border-primary-600'
    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-600 hover:text-primary-600'
  }
`}>
```

---

### 6. Missing Focus States on Interactive Elements
**Severity:** HIGH
**Files:** Multiple components

**Problem:**
Many interactive elements lack visible focus states for keyboard navigation:

1. **ArticleList filter buttons** - No focus ring/outline
2. **Contact form fields** - Using Flowbite defaults (need verification)
3. **Navigation links** - No focus indicator beyond browser default
4. **Hero CTA buttons** - No focus ring

**Impact:**
- Fails WCAG 2.1 Level AA accessibility requirements
- Poor experience for keyboard users
- Difficult to navigate with screen readers

**Suggested Fix:**
Add focus states to all interactive elements:

```tsx
// Navigation links
className="... focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"

// Buttons
className="... focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"

// Form inputs (if not using Flowbite defaults)
className="... focus:border-primary-500 focus:ring-primary-500"
```

---

### 7. Inconsistent Heading Spacing
**Severity:** HIGH
**Files:** Multiple pages

**Problem:**
Headings have inconsistent spacing across pages:

1. **Home.tsx (line 33):** `<h2 className="text-center mb-16">`
2. **Home.tsx (line 89):** `<h2 className="text-center mb-16">`
3. **Home.tsx (line 109):** `<h2 className="text-center mb-12">`
4. **About.tsx (line 33):** `<h2 className="text-3xl font-bold mb-4">`
5. **About.tsx (line 62):** `<h2 className="text-3xl font-bold mb-4">`
6. **ArticleDetail.tsx (line 92):** `<h1 className="mt-4 mb-4">` (uses global.css)

**Impact:**
- Visual inconsistency makes site look unpolished
- No clear typographic hierarchy
- Different pages "feel" different

**Suggested Fix:**
Define consistent heading styles in Tailwind config or use consistent classes:

```tsx
// H1 - Page titles
className="text-4xl font-bold mb-6"

// H2 - Section headings
className="text-3xl font-bold mb-8"

// H3 - Subsection headings
className="text-2xl font-semibold mb-4"
```

Apply these consistently across all pages.

---

### 8. Contact Page - Inconsistent Link Colors
**Severity:** HIGH
**File:** `/workspace/src/pages/Contact.tsx`
**Lines:** 204, 212

**Problem:**
```tsx
// LinkedIn link (line 204)
className="text-blue-600 hover:text-blue-800 transition-colors"

// GitHub link (line 212)
className="text-blue-600 hover:text-blue-800 transition-colors"
```

These use generic Tailwind `blue-600` instead of the brand primary color.

**Impact:**
- Links are a different blue than primary brand color
- Inconsistent with rest of site
- "Generic" feel rather than branded

**Suggested Fix:**
```tsx
className="text-primary-600 hover:text-primary-700 transition-colors"
```

---

### 9. About Page - Non-Brand Gradient
**Severity:** HIGH
**File:** `/workspace/src/pages/About.tsx`
**Line:** 192

**Problem:**
```tsx
<div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-lg border border-blue-200">
```

Uses generic blue/indigo gradient instead of brand colors.

**Impact:**
- Looks generic, not on-brand
- Indigo is not part of the brand palette
- Inconsistent with professional, minimal design system

**Suggested Fix:**
```tsx
<div className="text-center bg-gradient-to-r from-primary-50 to-primary-100 p-12 rounded-lg border border-primary-200">
```

---

### 10. Hero Component - No Responsive Typography
**Severity:** HIGH
**File:** `/workspace/src/components/content/Hero.tsx`
**Line:** 24

**Problem:**
```tsx
<h1 className="mb-8">{title}</h1>
```

The h1 only has `mb-8` - no responsive font sizing. Relies entirely on global.css definition (`font-size: 2.618rem`), which doesn't scale for mobile.

**Impact:**
- Hero titles likely too large on mobile (42px = 2.618rem)
- Poor mobile UX
- Breaks responsive design principle

**Suggested Fix:**
```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8">{title}</h1>
```

Or define responsive typography in Tailwind config.

---

### 11. Missing Hover States on Article Cards
**Severity:** HIGH
**File:** `/workspace/src/components/article/ArticleCard.tsx`
**Line:** 42

**Problem:**
```tsx
<Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
```

Only shadow changes on hover. No indication that the title is clickable, no color change, no transform.

**Impact:**
- Users may not realize cards are clickable
- Poor affordance (visual indication of interactivity)
- Less engaging UX

**Suggested Fix:**
```tsx
<Link to={articleRoute.path} className={`block h-full group ${className || ''}`}>
  <Card className="hover:shadow-lg hover:border-primary-200 transition-all duration-200 h-full flex flex-col">
    {/* ... */}
    <h3 className="text-2xl font-semibold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
      {article.title}
    </h3>
    {/* ... */}
  </Card>
</Link>
```

---

## Medium Priority Issues

### 12. Footer - Emojis in Professional Context
**Severity:** MEDIUM
**File:** `/workspace/src/components/layout/Footer.tsx`
**Lines:** 27-28, 77

**Problem:**
```tsx
const socialLinks: Array<{ label: string; url: ExternalLink }> = [
  { label: '⚡ GitHub', url: 'https://github.com/LongTermSupport' },
  { label: '💼 LinkedIn', url: 'https://linkedin.com/in/joseph-edmonds' },
];

// Line 77
Built with 🤓 TypeScript & ⚛️ React
```

**Impact:**
- Emojis clash with "professional, minimal design" stated in requirements
- May not render consistently across systems/browsers
- Looks informal for B2B/enterprise freelance services

**Suggested Fix:**
Remove emojis:
```tsx
const socialLinks = [
  { label: 'GitHub', url: '...' },
  { label: 'LinkedIn', url: '...' },
];

// Footer
Built with TypeScript & React
```

Or use icon libraries (React Icons) for consistent rendering.

---

### 13. CategoryBadge - Inline Styles Override Tailwind
**Severity:** MEDIUM
**File:** `/workspace/src/components/content/CategoryBadge.tsx`
**Lines:** 23-32

**Problem:**
```tsx
<Badge
  size={size}
  style={{
    backgroundColor: variant === 'filled' ? category.color : 'transparent',
    borderColor: variant === 'outlined' ? category.color : undefined,
    color: variant === 'outlined' ? category.color : '#ffffff',
    borderWidth: variant === 'outlined' ? '2px' : undefined,
  }}
  title={category.description}
>
```

Uses inline styles instead of Tailwind classes or CSS variables.

**Impact:**
- Can't leverage Tailwind's hover/focus utilities
- Harder to apply transitions
- Inconsistent with rest of codebase
- Inline styles have specificity issues

**Suggested Fix:**
Create category-specific CSS classes or use CSS variables:

```tsx
<Badge
  size={size}
  className={`
    ${variant === 'filled' ? 'bg-category text-white' : 'bg-transparent border-2 border-category text-category'}
  `}
  style={{
    '--category-color': category.color,
  } as React.CSSProperties}
>
```

With CSS:
```css
.bg-category { background-color: var(--category-color); }
.border-category { border-color: var(--category-color); }
.text-category { color: var(--category-color); }
```

---

### 14. Home Page - Expertise Cards Missing Active/Hover Feedback
**Severity:** MEDIUM
**File:** `/workspace/src/pages/Home.tsx`
**Lines:** 35, 43, 51, 59, 67, 75

**Problem:**
```tsx
<article className="p-8 border border-gray-200 rounded-md hover:shadow-md transition-shadow">
```

Only shadow changes on hover. Cards look interactive but have minimal visual feedback.

**Impact:**
- Unclear if cards are clickable or just informational
- Less engaging than they could be
- Inconsistent with article cards that have more elaborate hover states

**Suggested Fix:**
If cards are NOT links (just informational):
```tsx
<article className="p-8 border border-gray-200 rounded-md bg-white">
```

If cards SHOULD be links (e.g., to relevant articles or service pages):
```tsx
<Link to={serviceUrl}>
  <article className="p-8 border border-gray-200 rounded-md hover:border-primary-300 hover:shadow-md transition-all group">
    <h3 className="mb-4 group-hover:text-primary-600 transition-colors">{title}</h3>
    <p>{description}</p>
  </article>
</Link>
```

---

### 15. ArticleCard - Hard-Coded Font Sizes
**Severity:** MEDIUM
**File:** `/workspace/src/components/article/ArticleCard.tsx`
**Lines:** 47, 49, 53

**Problem:**
```tsx
<h3 className="text-2xl font-semibold mb-3 text-gray-900">{article.title}</h3>
<p className="text-base leading-relaxed text-gray-600 mb-4 flex-grow">
<div className="flex gap-4 text-sm text-gray-500 mt-auto">
```

Uses arbitrary size classes instead of semantic typography from global.css golden ratio system.

**Impact:**
- Doesn't follow the mathematical typography system (φ = 1.618)
- Inconsistent with article detail pages
- Harder to maintain typographic hierarchy

**Suggested Fix:**
Either:
1. Use h3/p tags and rely on global.css
2. OR document that cards have their own sizing (distinct from article content)
3. OR create consistent card typography utilities

---

### 16. Contact Form - Missing Error States
**Severity:** MEDIUM
**File:** `/workspace/src/pages/Contact.tsx`
**Lines:** 57-164

**Problem:**
Form has required fields but no visual error states:
```tsx
<TextInput id="name" name="name" type="text" required />
```

No error messages, no red borders, no validation feedback.

**Impact:**
- Poor UX when validation fails
- Users don't know what's wrong
- Doesn't meet accessibility guidelines for form errors

**Suggested Fix:**
Add form validation state and error messages:

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

// Validate before opening email
const handleSendEmail = () => {
  const newErrors: Record<string, string> = {};

  if (!formData.get('name')) {
    newErrors.name = 'Name is required';
  }
  if (!formData.get('email')) {
    newErrors.email = 'Email is required';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // ... proceed with mailto
};

// In render
<TextInput
  id="name"
  name="name"
  color={errors.name ? 'failure' : undefined}
  helperText={errors.name}
  required
/>
```

---

### 17. Page Component - Side Effects in Render
**Severity:** MEDIUM
**File:** `/workspace/src/components/layout/Page.tsx`
**Lines:** 29-40

**Problem:**
```tsx
export function Page({ title, description, ... }: PageProps) {
  // Update document title
  if (title) {
    document.title = title;
  }

  // Update meta description
  if (description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }

  return (
    // ...
  );
}
```

Direct DOM manipulation in render function violates React best practices.

**Impact:**
- Can cause issues with React 18+ concurrent rendering
- May run multiple times unnecessarily
- Not idiomatic React

**Suggested Fix:**
Use `useEffect`:

```tsx
import { useEffect } from 'react';

export function Page({ title, description, ... }: PageProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  useEffect(() => {
    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [description]);

  return (
    // ...
  );
}
```

Or better yet, use React Helmet or similar library.

---

### 18. Prose Component - Unused/Redundant
**Severity:** MEDIUM
**File:** `/workspace/src/components/content/Prose.tsx`

**Problem:**
The Prose component defines styles in a `<style>` tag and uses CSS variables like `var(--space-6)` and `var(--font-mono)` that aren't defined anywhere. It's also not used by any component - all prose styling comes from global.css.

**Impact:**
- Dead code in codebase
- Confusing for developers (which prose styles are active?)
- CSS variables reference non-existent values

**Suggested Fix:**
1. Delete the component if it's unused
2. OR update it to use actual CSS variables from global.css
3. OR consolidate with ArticleContent component

---

## Low Priority Issues

### 19. DRY Violation - Duplicate formatDate Functions
**Severity:** LOW
**Files:**
- `/workspace/src/components/article/ArticleCard.tsx:28-35`
- `/workspace/src/pages/ArticleDetail.tsx:21-28`

**Problem:**
Same `formatDate` function defined twice:

```tsx
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
```

**Impact:**
- Code duplication
- If date format changes, must update 2 places
- Violates DRY principle

**Suggested Fix:**
Create `/workspace/src/utils/dates.ts`:

```tsx
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
```

Import in both components.

---

### 20. ArticleDetail - Share Functions Should Be Extracted
**Severity:** LOW
**File:** `/workspace/src/pages/ArticleDetail.tsx`
**Lines:** 32-63

**Problem:**
Four sharing functions defined inline in component:
- `getShareUrl()`
- `getPageTitle()`
- `getRedditShareUrl()`
- `getHNShareUrl()`
- `getLobstersShareUrl()`

**Impact:**
- Bloats component file
- Not reusable if sharing is needed elsewhere
- Harder to test in isolation

**Suggested Fix:**
Extract to `/workspace/src/utils/sharing.ts`

---

### 21. Hero Subtitle - Inconsistent Text Size
**Severity:** LOW
**File:** `/workspace/src/components/content/Hero.tsx`
**Line:** 26

**Problem:**
```tsx
{subtitle && <p className="text-lg max-w-2xl mb-12">{subtitle}</p>}
```

Uses `text-lg` but global.css defines body text at 1rem (16px). `text-lg` is 1.125rem (18px).

**Impact:**
- Minor inconsistency with typographic scale
- Subtitle is only 12.5% larger than body text (small difference)

**Suggested Fix:**
Use `text-xl` (1.25rem = 20px) for more distinction:
```tsx
<p className="text-xl max-w-2xl mb-12">{subtitle}</p>
```

Or keep as-is if 18px is intentional.

---

### 22. Section Component - Missing Background Color Support
**Severity:** LOW
**File:** `/workspace/src/components/layout/Section.tsx`

**Problem:**
Section component only handles spacing, but many pages manually add `className="bg-gray-50"`:

```tsx
// Home.tsx line 87
<Section spacing="xl" className="bg-gray-50">

// Contact.tsx line 51
<Section spacing="xl" className="bg-gray-50">

// About.tsx line 27
<Section spacing="xl" className="bg-gray-50">
```

**Impact:**
- Inconsistent API (some sections control bg, others don't)
- Could be more ergonomic

**Suggested Fix:**
Add `variant` prop to Section:

```tsx
interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'muted';
  className?: string;
}

export function Section({ children, spacing = 'lg', variant = 'default', className }: SectionProps) {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  const variantClasses = {
    default: '',
    muted: 'bg-gray-50',
  };

  return (
    <section className={`${spacingClasses[spacing]} ${variantClasses[variant]} ${className || ''}`}>
      {children}
    </section>
  );
}
```

Usage:
```tsx
<Section spacing="xl" variant="muted">
```

---

### 23. Container Component - Inconsistent Usage
**Severity:** LOW
**File:** `/workspace/src/components/layout/Container.tsx`

**Problem:**
Container is used inconsistently:
- Some pages wrap entire content in one Container
- Others use multiple Containers per Section
- Some sections don't use Container at all (rely on Section padding)

**Impact:**
- Inconsistent max-widths across pages
- Some content stretches too wide
- Harder to maintain consistent layouts

**Suggested Fix:**
Establish and document a pattern:

**Pattern A (Recommended):**
```tsx
<Section>
  <Container>
    {/* content */}
  </Container>
</Section>
```

**Pattern B (Full-bleed sections):**
```tsx
<Section className="bg-gray-50">
  {/* Full-width background */}
  <Container>
    {/* Constrained content */}
  </Container>
</Section>
```

Update all pages to follow one pattern consistently.

---

## Summary of Recommendations

### Immediate Actions (Critical)
1. **Create `tailwind.config.ts`** with primary color palette
2. **Fix Navigation component** - replace `text-primary-600` with working classes
3. **Standardize brand color usage** - remove hard-coded hex values and generic blue classes

### High Priority Actions
4. Fix ArticleList filter button colors (use primary, not gray)
5. Refactor ArticleList to use Tailwind classes instead of inline styles
6. Add focus states to all interactive elements (accessibility)
7. Standardize heading spacing across all pages
8. Add hover feedback to Article Cards (color change on title)

### Medium Priority Actions
9. Remove emojis from Footer (professional design)
10. Refactor CategoryBadge to avoid inline styles
11. Add form validation error states to Contact page
12. Fix Page component to use useEffect instead of render-time DOM manipulation

### Low Priority Actions
13. Extract duplicate formatDate function to utils
14. Extract sharing functions to utils
15. Add variant prop to Section component for backgrounds
16. Establish and document Container/Section usage pattern
17. Delete or fix unused Prose component

---

## Testing Recommendations

After implementing fixes:

1. **Visual Regression Testing**
   - Take screenshots of all pages before/after
   - Compare for unintended changes

2. **Accessibility Audit**
   - Run Lighthouse accessibility tests
   - Test keyboard navigation
   - Verify WCAG 2.1 Level AA compliance

3. **Color Contrast Testing**
   - Verify all text meets WCAG contrast ratios
   - Test with color blindness simulators

4. **Responsive Testing**
   - Test on mobile (375px), tablet (768px), desktop (1440px)
   - Verify typography scales properly

5. **Cross-Browser Testing**
   - Chrome, Firefox, Safari
   - Verify Tailwind v4 compatibility

---

## Files Requiring Changes

**Critical Priority:**
- [ ] `/workspace/tailwind.config.ts` (create)
- [ ] `/workspace/src/components/layout/Navigation.tsx`
- [ ] `/workspace/src/components/content/Hero.tsx`
- [ ] `/workspace/src/pages/Home.tsx`
- [ ] `/workspace/src/pages/About.tsx`
- [ ] `/workspace/src/pages/Contact.tsx`

**High Priority:**
- [ ] `/workspace/src/pages/ArticleList.tsx`
- [ ] `/workspace/src/components/article/ArticleCard.tsx`
- [ ] `/workspace/src/components/layout/Page.tsx`

**Medium Priority:**
- [ ] `/workspace/src/components/layout/Footer.tsx`
- [ ] `/workspace/src/components/content/CategoryBadge.tsx`

**Low Priority:**
- [ ] `/workspace/src/components/content/Prose.tsx` (delete or fix)
- [ ] `/workspace/src/utils/dates.ts` (create)
- [ ] `/workspace/src/utils/sharing.ts` (create)
- [ ] `/workspace/src/components/layout/Section.tsx`
- [ ] `/workspace/src/components/layout/Container.tsx`

---

**End of Report**
