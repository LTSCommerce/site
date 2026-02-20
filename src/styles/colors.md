# LTS Commerce Brand Guidelines

## Color Palette

### Primary Brand Colors

The LTS Commerce palette is built around a deep, professional blue that conveys trust, technical expertise, and stability. The design maintains the site's mathematical precision while adding purposeful color.

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary** | `#0F4C81` | `15, 76, 129` | Primary brand color, CTAs, links, primary buttons |
| **Primary Light** | `#1E6BA5` | `30, 107, 165` | Hover states, gradients, accents |
| **Primary Dark** | `#0A3459` | `10, 52, 89` | Active states, emphasis, footer backgrounds |

### Neutral Colors (Monochrome Foundation)

Built on the existing mathematical design system using pure neutrals.

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Black** | `#000000` | `0, 0, 0` | Primary text, strong emphasis |
| **Gray 900** | `#171717` | `23, 23, 23` | Headings, wordmark text |
| **Gray 800** | `#262626` | `38, 38, 38` | Secondary headings |
| **Gray 700** | `#404040` | `64, 64, 64` | Tertiary text |
| **Gray 600** | `#525252` | `82, 82, 82` | Body text |
| **Gray 500** | `#737373` | `115, 115, 115` | Muted text, placeholders |
| **Gray 400** | `#A3A3A3` | `163, 163, 163` | Disabled text, subtle borders |
| **Gray 300** | `#D4D4D4` | `212, 212, 212` | Borders, dividers |
| **Gray 200** | `#E5E5E5` | `229, 229, 229` | Light borders, hover backgrounds |
| **Gray 100** | `#F5F5F5` | `245, 245, 245` | Background secondary |
| **Gray 50** | `#FAFAFA` | `250, 250, 250` | Background tertiary |
| **White** | `#FFFFFF` | `255, 255, 255` | Primary background |

### Semantic Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Success** | `#059669` | `5, 150, 105` | Success messages, positive indicators |
| **Warning** | `#D97706` | `217, 119, 6` | Warning messages, caution indicators |
| **Error** | `#DC2626` | `220, 38, 38` | Error messages, destructive actions |
| **Info** | `#0284C7` | `2, 132, 199` | Informational messages |

### Category Colors (For Articles)

| Category | Hex | Background Hex | Usage |
|----------|-----|----------------|-------|
| **PHP** | `#7C3AED` | `#F3E8FF` | PHP articles and content |
| **Infrastructure** | `#059669` | `#ECFDF5` | DevOps, infrastructure content |
| **Database** | `#2563EB` | `#EFF6FF` | Database articles |
| **AI** | `#EA580C` | `#FFF7ED` | AI/ML integration content |
| **TypeScript** | `#0891B2` | `#ECFEFF` | TypeScript content |

---

## Typography

### Font Families

#### Headings: Inter

Inter is a highly legible, variable font designed specifically for computer screens. It features a tall x-height for improved readability at small sizes and subtle optical corrections.

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Body Text: System Font Stack

For optimal performance and native feel, body text uses the system font stack:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

#### Code: JetBrains Mono

For code blocks and inline code, JetBrains Mono provides excellent legibility with programming-specific ligatures.

```css
font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
```

**Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale (Golden Ratio Based)

The typography system is based on the golden ratio (phi = 1.618) for mathematical harmony:

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| h1 | `2.618rem` (42px) | 600 | 1.2 |
| h2 | `1.618rem` (26px) | 600 | 1.3 |
| h3 | `1.272rem` (20px) | 600 | 1.4 |
| h4 | `1rem` (16px) | 600 | 1.5 |
| Body | `1rem` (16px) | 400 | 1.618 |
| Small | `0.875rem` (14px) | 400 | 1.5 |
| Caption | `0.75rem` (12px) | 400 | 1.4 |

---

## CSS Custom Properties

Add these to your CSS for consistent brand application:

```css
:root {
  /* Primary Brand */
  --color-primary: #0F4C81;
  --color-primary-light: #1E6BA5;
  --color-primary-dark: #0A3459;

  /* Neutrals */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-200: #E5E5E5;
  --color-gray-300: #D4D4D4;
  --color-gray-400: #A3A3A3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;

  /* Semantic */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #0284C7;

  /* Category */
  --color-php: #7C3AED;
  --color-php-bg: #F3E8FF;
  --color-infrastructure: #059669;
  --color-infrastructure-bg: #ECFDF5;
  --color-database: #2563EB;
  --color-database-bg: #EFF6FF;
  --color-ai: #EA580C;
  --color-ai-bg: #FFF7ED;
  --color-typescript: #0891B2;
  --color-typescript-bg: #ECFEFF;

  /* Typography */
  --font-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;

  /* Golden Ratio */
  --phi: 1.618;
}
```

---

## Tailwind Configuration

For Tailwind CSS projects, extend the default theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          light: '#1E6BA5',
          dark: '#0A3459',
        },
        // Article categories
        php: { DEFAULT: '#7C3AED', bg: '#F3E8FF' },
        infrastructure: { DEFAULT: '#059669', bg: '#ECFDF5' },
        database: { DEFAULT: '#2563EB', bg: '#EFF6FF' },
        ai: { DEFAULT: '#EA580C', bg: '#FFF7ED' },
        typescript: { DEFAULT: '#0891B2', bg: '#ECFEFF' },
      },
      fontFamily: {
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', 'monospace'],
      },
    },
  },
}
```

---

## Logo Files

| File | Description | Use Case |
|------|-------------|----------|
| `/public/logo.svg` | Full color logo with wordmark | Primary logo for headers, light backgrounds |
| `/public/logo-mark.svg` | Logo mark only (icon) | Favicons, small spaces, app icons |
| `/public/logo-mono-light.svg` | White monochrome logo | Dark backgrounds, overlays |
| `/public/logo-mono-dark.svg` | Black monochrome logo | Light backgrounds when color not appropriate |

### Logo Usage Guidelines

1. **Minimum size**: The full logo should be at least 120px wide
2. **Clear space**: Maintain padding equal to the height of the center dot on all sides
3. **Background contrast**: Ensure sufficient contrast - use monochrome versions when needed
4. **No modifications**: Do not rotate, stretch, or alter the logo proportions

---

## Design Principles

1. **Mathematical Precision**: All spacing follows the 8px grid system; typography follows the golden ratio
2. **Professional Restraint**: Color is used purposefully, not decoratively
3. **High Contrast**: Ensure WCAG AA compliance minimum (4.5:1 for text)
4. **Performance First**: System fonts for body text, minimal custom font weights
5. **Swiss Minimalism**: Clean lines, generous whitespace, clear hierarchy

---

*Last Updated: January 2026*
