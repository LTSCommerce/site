# Getting Started with React Site Skeleton

Quick guide for creating a new site using this skeleton.

## Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)
- Basic React and TypeScript knowledge

## Step 1: Clone and Install

```bash
# Clone the skeleton
git clone https://github.com/LongTermSupport/react-site-skeleton.git my-new-site
cd my-new-site

# Remove skeleton git history
rm -rf .git
git init

# Install dependencies
npm install
```

## Step 2: Update Project Info

**package.json**:
```json
{
  "name": "my-new-site",
  "version": "0.1.0",
  "description": "My awesome site",
  "author": "Your Name"
}
```

**index.html**:
- Update `<title>` tag
- Update meta description
- Replace favicon

## Step 3: Test the Skeleton

```bash
# Run development server
npm run dev

# In another terminal, run type checking
npm run type-check

# Run linting
npm run lint
```

Open [http://localhost:5173](http://localhost:5173) and verify the skeleton works.

## Step 4: Define Your Routes

Edit `src/routes.ts` with your site's pages:

```typescript
export const ROUTES = {
  home: { path: '/', label: 'Home' },
  about: { path: '/about', label: 'About' },
  services: { path: '/services', label: 'Services' },  // NEW
  portfolio: { path: '/portfolio', label: 'Portfolio' },  // NEW
  contact: { path: '/contact', label: 'Contact' },
} as const satisfies Record<string, RouteEntry>;
```

TypeScript autocomplete now includes your new routes!

## Step 5: Create Your Data Objects

If your site has categories, tags, or other enumerated data:

**1. Create the data file** (e.g., `src/data/categories.ts`):

```typescript
export const CATEGORIES = {
  web: { id: 'web' as const, label: 'Web Development', color: '#3B82F6' },
  mobile: { id: 'mobile' as const, label: 'Mobile Apps', color: '#10B981' },
  design: { id: 'design' as const, label: 'Design', color: '#8B5CF6' },
} as const;

export type CategoryId = typeof CATEGORIES[keyof typeof CATEGORIES]['id'];
```

**2. Configure ESLint** to enforce usage (`eslint.config.js`):

```javascript
'custom/use-types-not-strings': ['error', {
  patterns: [
    {
      match: /^(web|mobile|design)$/,
      type: 'CATEGORIES',
      import: '@/data/categories'
    }
  ]
}]
```

**3. Use typed objects everywhere**:

```typescript
import { CATEGORIES } from '@/data/categories';

const category = CATEGORIES.web.id;  // Type-safe!
const color = CATEGORIES[category].color;
```

## Step 6: Build Your Components

Start with layout components (Header, Footer, Navigation):

**src/components/layout/Header.tsx**:

```typescript
import { ROUTES } from '@/routes';

export function Header() {
  return (
    <header>
      <nav>
        <a href={ROUTES.home.path}>{ROUTES.home.label}</a>
        <a href={ROUTES.about.path}>{ROUTES.about.label}</a>
        <a href={ROUTES.services.path}>{ROUTES.services.label}</a>
        <a href={ROUTES.contact.path}>{ROUTES.contact.label}</a>
      </nav>
    </header>
  );
}
```

**Remember**: Props must use typed objects, never magic strings!

```typescript
// ❌ WRONG
interface NavItemProps {
  label: string;
  link: string;  // Magic string!
}

// ✅ CORRECT
import type { RouteEntry } from '@/types/routing';

interface NavItemProps {
  label: string;
  link: RouteEntry;  // Type-safe!
}
```

## Step 7: Create Your Pages

Replace skeleton example pages with your content:

**src/pages/Services.tsx**:

```typescript
import { Page } from '@/components/layout/Page';
import { Hero } from '@/components/content/Hero';
import { Container } from '@/components/layout/Container';
import { ROUTES } from '@/routes';

export function Services() {
  return (
    <Page title="Services">
      <Hero
        title="Our Services"
        subtitle="Professional web development and design"
        cta={{ text: 'Contact Us', link: ROUTES.contact }}
      />
      <Container>
        <h2>What We Do</h2>
        {/* Your content */}
      </Container>
    </Page>
  );
}
```

## Step 8: Set Up Routing

Update `src/main.tsx` with your routes:

```typescript
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Portfolio } from './pages/Portfolio';
import { Contact } from './pages/Contact';

function App() {
  const path = window.location.pathname;

  // Simple client-side routing
  if (path === ROUTES.about.path) return <About />;
  if (path === ROUTES.services.path) return <Services />;
  if (path === ROUTES.portfolio.path) return <Portfolio />;
  if (path === ROUTES.contact.path) return <Contact />;

  return <Home />;
}
```

Or install React Router:

```bash
npm install react-router-dom
```

## Step 9: Add Styling

Choose your styling approach:

**Option A: Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Option B: CSS Modules**
Already supported by Vite - just create `Component.module.css` files.

**Option C: Styled Components**
```bash
npm install styled-components
npm install -D @types/styled-components
```

Update `src/styles/global.css` with your design system.

## Step 10: Customize Claude Code

**Agents**: Add project-specific agents to `.claude/agents/`
- Design system expert
- API integration specialist
- SEO specialist

**Skills**: Add project-specific skills to `.claude/skills/`
- Component generation
- Page creation
- Testing workflows

**Hooks**: Add validation hooks to `.claude/hooks/`
- Prevent accidental git force-push
- Enforce British/American English consistency
- Run tests before commits

## Step 11: Quality Assurance

Run all QA checks:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Preview production build
npm run preview
```

Fix any type errors or linting issues before your first commit.

## Step 12: First Commit

```bash
git add .
git commit -m "Initial site setup from skeleton"
```

## Next Steps

### Add More Components

Build your component library in `src/components/`:
- UI components (Button, Card, Modal, etc.)
- Form components (Input, Select, TextArea)
- Content components (ArticleList, Gallery, Testimonials)

### Configure for Your Stack

- Add testing (Jest, Vitest, Playwright)
- Add backend integration (REST API, GraphQL)
- Add state management (Zustand, Redux, Context)
- Add animation libraries (Framer Motion, React Spring)

### Set Up CI/CD

- GitHub Actions for automated testing
- Netlify/Vercel for deployment
- Lighthouse CI for performance monitoring

## Common Patterns

### Type-Safe Form Handling

```typescript
const FORM_FIELDS = {
  name: { id: 'name' as const, label: 'Name', type: 'text' },
  email: { id: 'email' as const, label: 'Email', type: 'email' },
} as const;

type FormFieldId = typeof FORM_FIELDS[keyof typeof FORM_FIELDS]['id'];

function ContactForm() {
  const [formData, setFormData] = useState<Record<FormFieldId, string>>({
    name: '',
    email: '',
  });

  // Type-safe field access
  const handleChange = (field: FormFieldId, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
}
```

### Type-Safe API Responses

```typescript
const API_ENDPOINTS = {
  users: { path: '/api/users' as const, method: 'GET' as const },
  createUser: { path: '/api/users' as const, method: 'POST' as const },
} as const;

async function fetchUsers() {
  const endpoint = API_ENDPOINTS.users;
  const response = await fetch(endpoint.path, { method: endpoint.method });
  return response.json();
}
```

### Type-Safe Event Handlers

```typescript
const EVENTS = {
  click: 'click' as const,
  submit: 'submit' as const,
  change: 'change' as const,
} as const;

type EventType = typeof EVENTS[keyof typeof EVENTS];

function trackEvent(event: EventType, data: Record<string, unknown>) {
  console.log(`Event: ${event}`, data);
}
```

## Troubleshooting

### TypeScript Errors

**Problem**: Type inference not working
**Solution**: Ensure you're using `as const` and `satisfies` correctly

**Problem**: ESLint rule false positives
**Solution**: Adjust rule configuration in `eslint.config.js`

### Build Issues

**Problem**: Import path errors
**Solution**: Check `tsconfig.json` path mappings match Vite config

**Problem**: CSS not loading
**Solution**: Import CSS in component files, not just global.css

### Development Server

**Problem**: Hot reload not working
**Solution**: Check file is in `src/` directory and has correct extension

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)

## Getting Help

- Review `CLAUDE/TypeSafety.md` for type safety patterns
- Check `CLAUDE/PlanWorkflow.md` for project planning
- Use Claude Code agents: `@typescript-specialist` or `@component-builder`
- Create issues on the skeleton repository

---

**Remember**: The skeleton provides the **approach**, you provide the **design**. Each site should have bespoke components that fit its unique needs, but all sites share the robust type-safety infrastructure.
