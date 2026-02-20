# Rule: validate-seo-metadata

**Namespace**: `custom/validate-seo-metadata`
**Severity**: `error`
**Added**: Plan 008

## What It Catches

Static string literal `title` and `description` props on `<Page>` components in
`src/pages/` files that violate SEO character length constraints:

- `title` less than 30 characters
- `title` more than 70 characters
- `description` less than 120 characters
- `description` more than 170 characters

Only validates static string literals. Dynamic values (variables, expressions)
are not checked since they cannot be evaluated at lint time.

## Why It Was Added

Search engines have character limits for titles and descriptions:
- Google truncates titles at approximately 60 characters
- Google truncates descriptions at approximately 160 characters
- Too-short titles/descriptions provide insufficient context for ranking

This rule enforces correct lengths at lint time, preventing bad SEO from shipping
to production.

## Character Limits Explained

| Field | Minimum | Maximum | Why |
|-------|---------|---------|-----|
| title | 30 | 70 | Short titles lack context; long titles get truncated by Google |
| description | 120 | 170 | Short descriptions are padded by Google; long ones are truncated |

**Target**: title 40-60 chars, description 140-160 chars for optimal display.

## Violations and Correct Patterns

BAD - title too short (19 chars):
```tsx
<Page title="About - LTSCommerce" />
```

GOOD - descriptive title (50 chars):
```tsx
<Page title="About Joseph - Bespoke PHP Developer | LTSCommerce" />
```

BAD - description too short (45 chars):
```tsx
<Page description="Expert PHP developer for hire" />
```

GOOD - full description (155 chars):
```tsx
<Page description="Over 20 years building complex PHP systems. Specialising in legacy modernisation, infrastructure automation, and large-scale backend architecture." />
```

BAD - description too long (185 chars):
```tsx
<Page description="In-depth technical articles on PHP development, infrastructure automation, database patterns, AI integration, and TypeScript from an expert practitioner with over 20 years of hands-on backend experience." />
```

GOOD - concise description (162 chars):
```tsx
<Page description="In-depth technical articles on PHP, infrastructure, databases, AI, and TypeScript. Expert insights from 20+ years of hands-on backend development." />
```

## Fix Guidance

1. Count the characters in your title and description
2. Adjust to fall within the 30-70 / 120-170 ranges
3. Aim for the optimal target range: title 40-60, description 140-160
4. Include the brand name in the title: "Page Name - LTSCommerce"
5. Include specific expertise, differentiators, or value in the description
