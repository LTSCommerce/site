# LTS Commerce Portfolio

Professional freelance PHP engineer and agentic-delivery-governance portfolio site, built as a
statically-generated React/TypeScript application.

## 🚀 Live Site

Deployed at **[ltscommerce.dev](https://ltscommerce.dev)**, fronted by a Cloudflare Worker
(`cloudflare-workers/lts-site-proxy/`) that sits in front of GitHub Pages.

## 🏗️ Architecture

- **Frontend**: React 18, TypeScript (strict mode), Tailwind CSS v4
- **Routing**: React Router v7, type-safe route constants in `src/routes.ts`
- **Rendering**: SSG — Vite SSR + a custom prerender script renders every route to static HTML
- **Build tool**: Vite 6
- **Syntax highlighting**: Highlight.js
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`) → GitHub Pages

### Project structure

```
├── src/                 # React/TypeScript source
│   ├── pages/           # Page components (Home, About, ArticleList, ArticleDetail, Contact, ...)
│   ├── components/      # Reusable React components
│   ├── data/            # Site data — articles.ts, categories.ts, projects.ts, snippets.ts (generated)
│   ├── types/           # TypeScript type definitions
│   ├── hooks/           # React hooks
│   └── routes.ts        # Type-safe route definitions
├── code-snippets/       # External code snippet files (auto-imported into articles)
├── scripts/             # Build utilities (snippet/sitemap/feed generation, prerender)
├── cloudflare-workers/  # Cloudflare Worker fronting the site (redirects, security headers)
├── dist/                # Built output (gitignored)
├── dist-server/         # SSR build output (gitignored)
├── public/              # Static assets copied verbatim into dist/
└── untracked/           # Local notes/scratch (gitignored)
```

Full architecture and content-authoring documentation lives in `CLAUDE.md`.

## 🛠️ Development

### Prerequisites

- Node.js 22+ and npm
- Git

### Local development

```bash
npm install              # Install dependencies
npm run build            # Full production build (snippets → tsc → vite → SSR → prerender → sitemap → feed)
npm run preview           # Serve the dist/ build locally (optional)
npm run dev               # Vite dev server with HMR (optional, not required for most tasks)
```

After a build, read the generated HTML directly from `dist/` to verify output — e.g.
`dist/articles/<slug>/index.html`.

### Code quality

**This project uses CI-only formatting — do not run local formatting commands.** Prettier and
ESLint run automatically in CI on every push to `main`; deployment is blocked if quality checks
fail. Reference-only scripts:

```bash
npm run format:check    # Check formatting (used by CI)
npm run lint:check      # Check linting (used by CI)
npm run type-check      # tsc --noEmit
npx ts-qa                # Full QA/CI pipeline (lint, type-check, tests, Playwright)
```

### Debugging

Take Playwright screenshots of live pages for layout debugging:

```bash
node scripts/screenshot.js
```

Output goes to `var/` (gitignored).

## 📝 Content management

Articles are TypeScript objects in `src/data/articles.ts` (single source of truth — no EJS
templates). Code blocks reference external files under `code-snippets/` via a
`{{SNIPPET:path}}` placeholder, auto-escaped and compiled into `src/data/snippets.ts` at build
time. See `CLAUDE.md` for the full authoring workflow.

## 🚀 Deployment

Push to `main` triggers CI: auto-format → TypeScript/ESLint quality gates → build → prerender →
deploy to GitHub Pages. The Cloudflare Worker in `cloudflare-workers/lts-site-proxy/` is deployed
separately and manually (`npm run deploy` from that directory) — it is not part of the GitHub
Actions pipeline.

## 📄 License

This is a personal portfolio project. Please respect the content and code structure.
