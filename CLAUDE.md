# LTS Commerce Site - Technical Documentation

## Overview

Professional freelance PHP engineer portfolio website showcasing expertise in modern PHP development, infrastructure automation, and high-performance web applications.

## Architecture

### Build System
- **Build Tool**: Vite 6.x with React plugin
- **Package Manager**: npm with lockfile for reproducible builds
- **Source Directory**: `src/` (React/TypeScript source)
- **Build Output**: `dist/` (optimised production files, SSG pre-rendered)
- **Deployment**: Automated via GitHub Actions

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v7
- **Rendering**: SSG (Static Site Generation) via Vite SSR + custom prerender script
- **Syntax Highlighting**: Highlight.js (PHP, TypeScript, JavaScript, Bash, YAML, SQL, JSON, Nginx)
- **Code Quality**: ESLint + Prettier + TypeScript strict mode
- **CI/CD**: GitHub Actions with automated deployment
- **Performance**: Pre-rendered static HTML, optimised assets, code splitting

### Site Structure
```
├── src/                 # React/TypeScript source
│   ├── pages/           # Page components (Home, About, ArticleList, ArticleDetail, Contact)
│   ├── components/      # Reusable React components
│   ├── data/            # Site data
│   │   ├── articles.ts  # ALL article content (single source of truth)
│   │   ├── categories.ts# Article categories with IDs and colours
│   │   └── snippets.ts  # Auto-generated code snippets (do not edit)
│   ├── types/           # TypeScript type definitions
│   ├── hooks/           # React hooks
│   ├── styles/          # Global CSS
│   └── routes.ts        # Type-safe route definitions
├── code-snippets/       # External code snippet files (auto-imported)
├── scripts/             # Build utilities
│   ├── generate-snippets.mjs  # Generates src/data/snippets.ts
│   └── prerender.mjs          # SSG prerender all routes
├── dist/                # Built files (gitignored)
├── dist-server/         # SSR build (gitignored)
├── public/              # Static assets copied to dist/
├── untracked/           # Local notes/scratch (gitignored)
└── .github/workflows/   # CI/CD configuration
```

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies
npm run build           # Full production build (snippets → tsc → vite → SSR → prerender)
# After build, pre-rendered HTML is in dist/ — read files directly to verify output
npm run preview         # Serve the dist/ build locally (optional)
npm run dev             # Vite dev server with HMR (optional, not required for most tasks)
```

**Note**: For testing changes, use `npm run build` and then read the generated HTML files directly from `dist/articles/<slug>/index.html`. The dev server (`npm run dev`) is optional.

### Code Quality & Formatting

**IMPORTANT: This project uses CI-only formatting. Do NOT run local formatting commands.**

All code formatting and quality checks are handled automatically by GitHub Actions CI/CD pipeline:

- **Auto-Formatting**: Prettier automatically formats code on push to main
- **Auto-Fixing**: PHP-CS-Fixer automatically fixes PHP code style issues
- **Quality Gates**: Deployment blocked if CI quality checks fail
- **Local Development**: Focus on functionality - CI handles formatting

Available scripts (for reference only):
```bash
npm run format:check    # Check formatting (used by CI)
npm run lint:check      # Check linting (used by CI)
npm run syntax-highlight # Process code syntax highlighting
```

**Manual Deployment Override**: Use GitHub Actions UI or `gh workflow run "Deploy static content to Pages"`

### Debugging & Screenshots

Take screenshots of live pages for debugging layout issues:

```bash
# Take screenshot of specific page
node scripts/screenshot.js
# Modify the URL in the script as needed
```

Screenshots are saved to `var/` directory which is gitignored. The screenshot script uses Playwright to capture high-quality screenshots for debugging visual issues.

**Script Configuration:**
- Default viewport: 1920x1080 (desktop)
- Waits for network idle before capturing
- Configurable clip area for focusing on specific sections
- Outputs PNG files to `var/` directory

### Deployment Process
1. **Push to main branch** triggers GitHub Actions CI/CD pipeline
2. **Auto-Format** - Prettier automatically formats all code and commits changes
3. **Quality Checks** - TypeScript + ESLint validation (deployment blocked if fails)
4. **Build** - Vite compiles React/TypeScript, generates optimised assets
5. **SSR Build** - Builds server-side rendering bundle for prerendering
6. **Prerender** - All routes rendered to static HTML files in `dist/`
7. **GitHub Pages** - Static files deployed, triggered only when CI succeeds
8. **Lighthouse** - Performance and SEO auditing (post-deployment)

## Content Management

### Articles
- **Location**: `src/data/articles.ts` — single file, all articles as TypeScript objects
- **Format**: TypeScript object with HTML string `content` field
- **Syntax Highlighting**: Highlight.js applied automatically at render time via `language-*` CSS classes
- **Categories**: PHP (purple), Infrastructure (green), Database (blue), AI (orange/amber), TypeScript (blue)
- **SEO**: Meta tags and structured data generated automatically from article metadata
- **Ordering**: Newest article first (top of the `SAMPLE_ARTICLES` array)

### Adding New Articles

**REACT/TYPESCRIPT SYSTEM**: Articles are TypeScript objects in `src/data/articles.ts`. There are no EJS files or `private_html/` for articles.

#### Step 1: Create code snippet files

All code blocks in articles **MUST** use the snippet system. Never embed inline code in the article `content` field.

Create a directory for your article's code snippets:
```
code-snippets/your-article-slug/
```

Add each code example as a separate file with the appropriate extension:
```
code-snippets/your-article-slug/
  ├── example-service.php
  ├── install-commands.sh
  ├── config-example.yaml
  ├── generated-model.ts
  └── database-query.sql
```

**Write raw code in snippet files** — no HTML encoding needed. The build system (`scripts/generate-snippets.mjs`) automatically HTML-escapes all snippet content and generates `src/data/snippets.ts`.

#### Step 2: Add the article object to src/data/articles.ts

Insert a new object at the **top** of the `SAMPLE_ARTICLES` array (before the first existing entry):

```typescript
{
  id: 'your-article-slug',           // URL: /articles/your-article-slug
  title: 'Your Article Title',
  description: 'SEO description and excerpt (1-2 sentences)',
  date: 'YYYY-MM-DD',
  category: CATEGORIES.php.id,       // php | infrastructure | database | ai | typescript
  readingTime: 10,                   // Estimated minutes
  author: 'Joseph Edmonds',
  tags: [],
  subreddit: 'PHP',
  content: `<div class="intro">
    <p class="lead">Opening lead paragraph.</p>
</div>

<section>
    <h2>Section Title</h2>
    <p>Content...</p>

    <pre><code class="language-php">{{SNIPPET:your-article-slug/example-service.php}}</code></pre>

    <p>More content...</p>

    <pre><code class="language-bash">{{SNIPPET:your-article-slug/install-commands.sh}}</code></pre>
</section>
`,
},
```

#### Code Block Reference Format

Reference snippets using the `{{SNIPPET:path}}` placeholder inside `<pre><code>` tags:

```html
<pre><code class="language-php">{{SNIPPET:your-article-slug/filename.php}}</code></pre>
```

The path is relative to the `code-snippets/` directory.

#### Supported Code Block Languages

- `language-php` — PHP code
- `language-typescript` — TypeScript/JavaScript
- `language-javascript` — Plain JavaScript
- `language-bash` — Shell commands
- `language-sql` — SQL queries
- `language-yaml` — YAML config
- `language-json` — JSON
- `language-nginx` — Nginx config

#### Template Literal Escaping (for non-code content)

The `content` field is a JavaScript template literal. The prose/HTML content around snippet references still needs:
- Backslashes doubled in any inline text: `App\Service` → `App\\Service`
- **Avoid** backtick characters or `${...}` in prose (they conflict with the template literal delimiter)

Code inside snippet files does NOT need any escaping — the build system handles it.

#### Step 3: Build and verify

```bash
npm run build
# Check: dist/articles/your-article-slug/index.html exists and renders correctly
```

Read the generated HTML in `dist/articles/your-article-slug/index.html` to verify code blocks render with correct syntax highlighting and proper escaping.

#### Step 4: Deploy

```bash
git add code-snippets/your-article-slug/ src/data/articles.ts
git commit -m "Add article: Your Article Title"
git push origin main
```

#### Legacy Note

Some older articles still use inline HTML-encoded code directly in the `content` field. New articles must always use the snippet system. If editing an older article's code blocks, migrate them to snippets at the same time.

## React Component System

### Page Components

Pages live in `src/pages/`:
- `Home.tsx` — Landing page
- `About.tsx` — About page
- `ArticleList.tsx` — Article listing with category filtering
- `ArticleDetail.tsx` — Individual article renderer (uses `content` HTML via dangerouslySetInnerHTML)
- `Contact.tsx` — Contact form

### Adding New Pages

1. Create `src/pages/MyPage.tsx` as a React component
2. Add a route in `src/routes.ts` using the `ROUTES` const pattern
3. Register in `src/App.tsx`
4. The prerender script auto-discovers routes from `ROUTES` — new routes are prerendered automatically

### Build Process

```
1. npm run build runs:
   ├── scripts/generate-snippets.mjs
   │   └── Reads code-snippets/ files → generates src/data/snippets.ts
   ├── tsc
   │   └── TypeScript type-checking (fails build on type errors)
   ├── vite build
   │   └── Bundles React app → dist/
   ├── vite build --ssr
   │   └── Builds SSR bundle → dist-server/
   └── scripts/prerender.mjs
       └── Renders all ROUTES to static HTML → dist/**
```

## Configuration Files

- `package.json` - Dependencies and npm scripts
- `vite.config.ts` - Build configuration (Vite + React plugin)
- `tsconfig.json` - TypeScript compiler options (strict mode enabled)
- `tailwind.config.ts` - Tailwind CSS configuration
- `eslint.config.js` - ESLint flat config with TypeScript and React rules
- `.github/workflows/ci.yml` - Main CI/CD pipeline with quality gates
- `.github/workflows/static.yml` - GitHub Pages deployment (triggered by CI success)
- `lighthouserc.js` - Performance auditing

## Performance Features

- **Asset Optimization**: CSS/JS minification and bundling
- **Image Optimization**: Optimized images with proper formats
- **Lighthouse Scoring**: Automated performance monitoring
- **Semantic HTML**: Proper accessibility and SEO structure
- **Mobile-First**: Responsive design with touch-friendly navigation

## Security & Best Practices

- **Content Security**: No external dependencies in critical path
- **Modern JavaScript**: ES2022+ features with fallbacks
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: WCAG 2.1 compliant markup and navigation
- **SEO Optimization**: Structured data, meta tags, semantic HTML

## Documentation Standards

### Code Examples in Documentation

#### When to Link vs When to Show Code

**Link to actual code when:**
- Referencing complete interface definitions (use `See [path/to/file.ts](../path/to/file.ts)`)
- Showing real implementation patterns that exist in the codebase
- Pointing to complex examples that would clutter documentation
- Referencing configuration files or complete class definitions

**Use dummy examples when:**
- Illustrating concepts or patterns generically
- Showing before/after transformations
- Demonstrating anti-patterns to avoid
- Teaching implementation approaches

#### Interface and Type Definitions

**NEVER replicate actual interfaces in documentation.** Always link to the source file:

```typescript
// ❌ WRONG - Replicating actual interface
export interface ILLMDataDTO {
  toLLMData(): Record<string, string>
  // ... other methods
}

// ✅ CORRECT - Link to actual interface
// See [src/core/interfaces/ILLMDataDTO.ts](../src/core/interfaces/ILLMDataDTO.ts) for the complete interface.
```

#### Dummy Code Naming Conventions

All dummy examples must use clear naming conventions:

**Dummy Services:** `MyService`, `ExampleService`, `SampleDataService`
**Dummy DTOs:** `MyDataDTO`, `ExampleDTO`, `SampleDTO`
**Dummy Interfaces:** `IMyService`, `IExampleApi`
**Dummy Types:** `TMyConfig`, `TExampleResponse`
**Dummy Variables:** `exampleData`, `sampleResponse`, `mockApiResult`
**Dummy Constants:** `EXAMPLE_FIELD`, `SAMPLE_KEY`, `DUMMY_VALUE`

#### Magic String Prevention

**Never use actual production keys/constants in examples:**

```typescript
// ❌ WRONG - Using actual production constants
result.addData('PROJECT_COUNT', '5')  // PROJECT_COUNT might be real

// ✅ CORRECT - Clearly dummy examples
result.addData('EXAMPLE_FIELD', 'sample-value')
result.addData(ExampleKeys.SAMPLE_FIELD, 'dummy-data')
```

#### Code Synchronization Rules

**For code snippets that reference real files:**
1. Always include a comment indicating the source file
2. Use `// Snippet from [filename]` to indicate partial code
3. Keep snippets under 20 lines - link to full file for complete examples
4. Update snippets when referenced files change significantly

**For complete dummy examples:**
1. Make them self-contained and runnable conceptually
2. Use consistent dummy naming throughout the same document
3. Ensure examples follow current coding standards and patterns

### Documentation Maintenance

#### Cross-Reference Integrity

All documentation must maintain mutual coherence:

**Link Verification:** All relative links must point to existing files
**Consistency Checking:** Ensure terminology and patterns match across all docs
**Version Alignment:** Keep examples aligned with current implementation patterns

#### Contradiction Detection

Before publishing documentation changes:

1. **Scan for conflicting information** across all docs
2. **Identify authoritative sources** for disputed information
3. **Resolve contradictions** by updating outdated information
4. **Add cross-references** to prevent future inconsistencies

#### Content Hierarchy

Documentation should follow clear information prioritization:

1. **Core concepts first** - fundamental principles and architecture
2. **Common use cases** - 80% of developer needs
3. **Edge cases and advanced topics** - specialized scenarios
4. **Troubleshooting** - problem resolution patterns

## Content Policy

**No Bullshit Rule**: All content must be factual and verifiable. No fabricated client case studies, made-up performance metrics, or fictional project examples. Use generic examples or theoretical scenarios instead of claiming specific real-world implementations that didn't happen.

---

---

*Last Updated: 2026-02-22*
*Version: 4.0 - React/TypeScript SSG*

## Recent Updates (v4.0)

### React Migration
- **Full React/TypeScript rewrite**: All pages converted from EJS/Vanilla JS to React 18 + TypeScript
- **SSG Prerendering**: All routes pre-rendered to static HTML via Vite SSR + custom prerender script
- **Tailwind CSS**: Styling via Tailwind v4 replacing custom CSS
- **Type-safe routing**: All routes defined in `src/routes.ts` as typed constants
- **Article system**: All articles now TypeScript objects in `src/data/articles.ts`

### Build System
- **Three-stage build**: Snippet generation → Vite client + SSR build → prerender
- **TypeScript strict**: Full strict mode type checking as a build gate
- **ESLint flat config**: Modern ESLint v9 flat config with TypeScript and React rules