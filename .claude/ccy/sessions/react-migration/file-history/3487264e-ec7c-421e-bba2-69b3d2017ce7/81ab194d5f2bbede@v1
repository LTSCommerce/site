# Type Safety Philosophy

**Core Principle**: TypeScript should catch errors at compile time, not runtime. Strings should only be strings, never implicit references to data.

## The Problem: Magic Strings

Magic strings are the enemy of type safety. They look like strings, but they're really data references:

```tsx
// ❌ WRONG - Magic strings everywhere
const category = "php";
const color = "purple";
const status = "active";
const route = "/about";

if (category === "php") {  // Typo: "phpp" compiles but breaks at runtime
  setColor("purple");       // Typo: "purpel" compiles but breaks at runtime
}
```

**Problems**:
- Typos compile successfully, fail at runtime
- No autocomplete
- Refactoring is impossible (find/replace is error-prone)
- No way to know all valid values
- TypeScript can't help you

## The Solution: Typed Objects

Every piece of data should have a TypeScript representation:

```tsx
// ✅ CORRECT - Typed objects
const CATEGORIES = {
  php: { id: 'php', label: 'PHP', color: '#8B5CF6' },
  infrastructure: { id: 'infrastructure', label: 'Infrastructure', color: '#10B981' },
  database: { id: 'database', label: 'Database', color: '#3B82F6' },
  ai: { id: 'ai', label: 'AI', color: '#F97316' },
} as const;

type CategoryId = keyof typeof CATEGORIES;

const category: CategoryId = CATEGORIES.php.id;
if (category === CATEGORIES.php.id) {  // TypeScript autocomplete!
  const color = CATEGORIES[category].color;  // Type-safe access
}
```

**Benefits**:
- Typos caught at compile time
- Full autocomplete support
- Refactoring is safe (rename symbol)
- TypeScript knows all valid values
- Single source of truth

## Examples: Wrong vs Right

### Routes

```tsx
// ❌ WRONG - Magic string routes
<Link to="/about">About</Link>
<a href="/contact">Contact</a>

// ✅ CORRECT - Typed routes
import { ROUTES } from '@/routes';

<Link to={ROUTES.about.path}>About</Link>
<a href={ROUTES.contact.path}>Contact</a>
```

### Categories/Tags

```tsx
// ❌ WRONG - Magic string categories
const article = {
  category: "php",  // Typo: "phpp" compiles
  tags: ["performance", "database"],  // Typo: "databse" compiles
};

// ✅ CORRECT - Typed categories
const CATEGORIES = {
  php: { id: 'php' as const, label: 'PHP' },
  infrastructure: { id: 'infrastructure' as const, label: 'Infrastructure' },
} as const;

const TAGS = {
  performance: { id: 'performance' as const, label: 'Performance' },
  database: { id: 'database' as const, label: 'Database' },
} as const;

type CategoryId = typeof CATEGORIES[keyof typeof CATEGORIES]['id'];
type TagId = typeof TAGS[keyof typeof TAGS]['id'];

const article: {
  category: CategoryId;
  tags: TagId[];
} = {
  category: CATEGORIES.php.id,
  tags: [TAGS.performance.id, TAGS.database.id],
};
```

### Status/State

```tsx
// ❌ WRONG - Magic string status
const status = "loading";
if (status === "loading") { /* ... */ }

// ✅ CORRECT - Typed status
const Status = {
  Idle: 'idle' as const,
  Loading: 'loading' as const,
  Success: 'success' as const,
  Error: 'error' as const,
} as const;

type Status = typeof Status[keyof typeof Status];

const status: Status = Status.Loading;
if (status === Status.Loading) { /* ... */ }
```

### Colors

```tsx
// ❌ WRONG - Magic string colors
const categoryColor = "purple";
style={{ color: "purple" }}

// ✅ CORRECT - Typed colors (via category object)
const CATEGORIES = {
  php: { id: 'php' as const, label: 'PHP', color: '#8B5CF6' },
  // ...
} as const;

const categoryColor = CATEGORIES.php.color;
style={{ color: CATEGORIES.php.color }}
```

### Component Props

```tsx
// ❌ WRONG - String prop types
interface ButtonProps {
  variant: string;  // What are valid values?
  size: string;     // No autocomplete
}

<Button variant="primary" size="large" />  // Typo: "pirmary" compiles

// ✅ CORRECT - Union types
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
}

<Button variant="primary" size="large" />  // Typo caught by TypeScript
```

## ESLint Enforcement

We enforce this with custom ESLint rules:

### 1. no-hardcoded-routes

Prevents hardcoded route strings:

```tsx
// ❌ Blocked by ESLint
<Link to="/about" />
<a href="/contact" />

// ✅ Required pattern
<Link to={ROUTES.about.path} />
<a href={ROUTES.contact.path} />
```

### 2. no-string-link-props

Prevents string types in link props:

```tsx
// ❌ Blocked by ESLint
interface NavItemProps {
  link: string;  // ESLint error
}

// ✅ Required pattern
import type { RouteEntry } from '@/types/routing';

interface NavItemProps {
  link: RouteEntry;  // Type-safe
}
```

### 3. use-types-not-strings

Prevents magic strings where typed alternatives exist:

```tsx
// ❌ Blocked by ESLint (when CATEGORIES exists)
const category = "php";

// ✅ Required pattern
const category = CATEGORIES.php.id;
```

## Migration Strategy

When adding type safety to existing code:

1. **Identify magic strings**: Look for repeated string literals
2. **Create typed object**: Define const object with `as const`
3. **Extract type**: Use `typeof` to create type from object
4. **Replace usages**: Replace all magic strings with object references
5. **Enable ESLint rule**: Turn on enforcement to prevent regression

Example:

```tsx
// Step 1: Identify (found 10 uses of "active", "pending", "complete")

// Step 2: Create typed object
const TaskStatus = {
  Active: 'active' as const,
  Pending: 'pending' as const,
  Complete: 'complete' as const,
} as const;

// Step 3: Extract type
type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// Step 4: Replace usages
const status: TaskStatus = TaskStatus.Active;

// Step 5: ESLint prevents new magic strings
```

## Common Patterns

### Read-only constant objects

```tsx
export const CATEGORIES = {
  php: { id: 'php', label: 'PHP', color: '#8B5CF6' },
  infrastructure: { id: 'infrastructure', label: 'Infrastructure', color: '#10B981' },
} as const;
```

**Why `as const`**:
- Makes object deeply read-only
- Literal types instead of widened types
- Enables better type inference

### Type extraction from const objects

```tsx
// Extract keys
type CategoryKey = keyof typeof CATEGORIES;  // 'php' | 'infrastructure'

// Extract value type
type Category = typeof CATEGORIES[CategoryKey];  // { id: 'php', ... } | { id: 'infrastructure', ... }

// Extract specific property type
type CategoryId = typeof CATEGORIES[CategoryKey]['id'];  // 'php' | 'infrastructure'
```

### Satisfies operator (TypeScript 4.9+)

```tsx
// Ensure structure while preserving literal types
export const ROUTES = {
  home: { path: '/', label: 'Home' },
  about: { path: '/about', label: 'About' },
} as const satisfies Record<string, RouteEntry>;
```

## Anti-Patterns to Avoid

### ❌ String enums

```tsx
// String enums are still magic strings with extra steps
enum Status {
  Active = "active",  // Can still typo in usage
  Pending = "pending",
}
```

**Instead use const objects** - better autocomplete, easier to work with.

### ❌ Type-only definitions

```tsx
// Type exists but no runtime object
type Category = "php" | "infrastructure";

const cat: Category = "php";  // Still a magic string!
```

**Instead create const object first**, then extract type from it.

### ❌ Separate data and types

```tsx
// Data and types drift apart
const categories = ["php", "infrastructure"];
type Category = "php" | "infrastructure";  // Must maintain in sync
```

**Instead use single const object** - data and types stay in sync automatically.

## Summary

**Rule**: If a string represents data, it should be a typed object reference, not a string literal.

**Benefits**:
- Compile-time safety
- Autocomplete everywhere
- Safe refactoring
- Single source of truth
- Self-documenting code

**Enforcement**:
- Custom ESLint rules
- TypeScript strict mode
- Code review

**Result**: Runtime errors become compile-time errors. If it compiles, it works.

---

**Next**: See `eslint-rules/` for implementation of custom rules that enforce this philosophy.
