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

**Keeping `ts-qa-ci` current**: this project pulls `@longtermsupport/ts-qa-ci` directly from `github:LongTermSupport/ts-qa-ci#<commit>` in `package.json` (it isn't published to npm yet), so `npm outdated` never flags it. Periodically check for a newer commit and bump the pin:

```bash
git ls-remote https://github.com/LongTermSupport/ts-qa-ci.git HEAD
npm install @longtermsupport/ts-qa-ci@github:LongTermSupport/ts-qa-ci#<new-commit-sha>
```

Then run `npx ts-qa` to confirm the new pin still works before committing the `package.json`/`package-lock.json` bump.

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

### Article Source Material From Other Projects

**[CONTRIBUTING-PROJECTS.md](CONTRIBUTING-PROJECTS.md)** defines how another
(often private) project hands off raw source material for an article: a
`CLAUDE/Plan/` plan folder plus a sanitised `reference/` pack (architecture,
design rationale, code snippets, alternatives considered, lessons learned,
candidate framings), pushed from that project's own checkout of this repo.
Read it before acting on any plan whose `PLAN.md` describes itself as
donated/scoped-only material for a future writer rather than a
ready-to-write outline — the depth and sanitisation rules there apply before
the normal article process below does.

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
  register: 'formal',              // REQUIRED — defines prose register for AI tooling
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

#### Step 3b: Editorial review (MANDATORY before commit)

Run the `article-reviewer` agent on the new article before committing. It catches fourth-wall breaks, conversational leakage, redundant sections, and factual red flags.

```
Agent(article-reviewer): review article 'your-article-slug' before publication
```

The reviewer returns `READY TO PUBLISH`, `NEEDS FIXES`, or `MAJOR REWORK`. Do not proceed to Step 3c until the verdict is `READY TO PUBLISH`. Fix all CRITICAL findings; resolve or consciously accept MODERATE ones.

#### Step 3c: Voice pass (MANDATORY before commit)

Run the `voice-pass` agent on the new article. It checks and directly rewrites prose (including code comments) against `untracked/JOSEPH-VOICE.md` — a measured, evidence-based reference for how Joseph actually writes, derived from ~58,000 words of his own pre-LLM manuscript. This is a separate concern from `article-reviewer`'s structural/factual check: it exists because generated prose defaults to a generic register (stacked short declaratives, em dashes, no hedging, corporate buzzwords) that reads as AI-written even when the content is accurate.

```
Agent(voice-pass): run a voice pass on article 'your-article-slug'
```

`untracked/JOSEPH-VOICE.md` is deliberately gitignored but must be present locally for this step to run — if it's missing, the agent will stop and say so rather than guessing at a voice from general knowledge. The pass can be **run more than once**: apply the first pass, re-read the result, and re-run the agent if it still flags issues or recommends another round. Stop once it reports the article reads clean.

**Register note (settled 2026-09-02)**: `formal` register permits natural contractions and first-person for opinion/admission/recommendation, per the measured evidence in `untracked/JOSEPH-VOICE.md` — this supersedes the older house-style convention that banned both. `content-editor` and `article-reviewer` are aligned with this.

#### Step 3d: Hero image (optional)

An article can carry a full-width `heroImage` (see `ArticleHeroImage` in `src/types/article.ts`), rendered at the very top of the page behind the translucent site nav. Not every article needs one. To add one, use the `article-image` skill rather than sourcing/processing an image by hand:

```
Skill(article-image): the-ouroboros-problem hero image, [what it should depict]
```

It covers sourcing a genuinely public-domain/CC0 image, verifying the licence before fetching, processing with ImageMagick to a controlled size/quality with the fade baked into the pixels (not a CSS overlay), writing a `public/images/<slug>/SOURCE.md` provenance record (mandatory — this is what lets the asset be rebuilt with different styling later without re-deriving anything), and wiring it into the article. Read the skill's own file for the full recipe and lessons from the first real run of it.

#### Step 4: Deploy

```bash
git add code-snippets/your-article-slug/ src/data/articles.ts
git commit -m "Add article: Your Article Title"
```

Then push using the `git-push` skill rather than a bare `git push` — it watches CI through to
completion and smoke-tests the live article afterwards, rather than treating the push as
fire-and-forget:

```
Skill(git-push)
```

Only push once the user has actually authorised it for this specific commit — committing and
pushing are not the same permission, and a push here triggers a real production deploy.

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

- Referencing complete interface definitions (add a "See" link pointing at the real file instead of replicating the interface inline)
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
  toLLMData(): Record<string, string>;
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
result.addData('PROJECT_COUNT', '5'); // PROJECT_COUNT might be real

// ✅ CORRECT - Clearly dummy examples
result.addData('EXAMPLE_FIELD', 'sample-value');
result.addData(ExampleKeys.SAMPLE_FIELD, 'dummy-data');
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

**SITE-TRUTH Rule (overrides everything else)**: [SITE-TRUTH.md](SITE-TRUTH.md) is the single source of truth for all page copy. Every claim on every page MUST be traceable to an item in that document, and its BANNED list is absolute. To say something new, add it to SITE-TRUTH.md first (with Joseph's sign-off), then use it. Article bodies are technical writing and exempt, but article claims about Joseph himself must still comply.

**No Bullshit Rule**: All content must be factual and verifiable. No fabricated client case studies, made-up performance metrics, or fictional project examples. Use generic examples or theoretical scenarios instead of claiming specific real-world implementations that didn't happen.

---

---

_Last Updated: 2026-02-22_
_Version: 4.0 - React/TypeScript SSG_

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

<hooksdaemon>
<!-- Auto-generated by hooks daemon on restart. Do not edit this section — changes will be overwritten. -->

## Hooks Daemon — Active Handler Guidance

The handlers listed below are active in this project. Read this section to avoid triggering unnecessary blocks.

**When a tool is blocked by a handler, do not stop working.** Read the block reason, modify your approach, and continue with your task.

**A file written through Bash is not seen by the content guards that run BEFORE the write.** The PreToolUse handlers below that inspect what a file CONTAINS, or where it lives, key on the `Write` and `Edit` tools — so a `>`, `>>`, `tee` or a `cat <<EOF` heredoc reaches disk unexamined by them: no block, no advisory, no record. **A Bash write that drew no complaint is NOT a write that passed those checks** — use `Write`/`Edit` for file content and they apply.

**The LINTERS are the exception, and they DENY.** `lint_on_edit` and `validate_eslint_on_write` do run on a file a Bash command AUTHORS — a redirect, `tee`, a heredoc — so unparseable Python or failing TypeScript is reported however it reached disk. The write has already landed, so the denial is a failure report to repair with `Edit`, not a rollback. A file the command merely RELOCATES (`cp`, `mv`, `install`, `dd`) is never linted: those bytes were already on disk, so blaming the copy would report a defect the command did not introduce.

The handlers that judge a Bash COMMAND — destructive git, `sed`, pipes, permissions, `curl | sh` — are unaffected and still cover you.

Full detail on any rule: `bin/hooks-daemon explain-rule <ID>`.

## All other enforced rules

<!-- handler: block-ask-user-question -->

<!-- handler: prevent-destructive-git -->

<!-- handler: block-sed-command -->

<!-- handler: daemon-location-guard -->

<!-- handler: require-absolute-paths -->

<!-- handler: error-hiding-blocker -->

<!-- handler: block-artefact-publishing -->

<!-- handler: block-curl-pipe-shell -->

<!-- handler: block-secret-file-read -->

<!-- handler: block-security-antipatterns -->

<!-- handler: block-sensitive-content -->

<!-- handler: enforce-project-containment -->

<!-- handler: flaggable-content-channel-guard -->

<!-- handler: quarantine-artefact-read-guard -->

<!-- handler: pipe-blocker -->

<!-- handler: block-unread-overwrite -->

<!-- handler: prevent-worktree-file-copying -->

<!-- handler: root-recursion-guard -->

<!-- handler: block-git-stash -->

<!-- handler: block-self-matching-process-probe -->

<!-- handler: block-dangerous-permissions -->

<!-- handler: github_auto_close_keywords -->

<!-- handler: block-ancestry-severing-merge -->

<!-- handler: lock-file-edit-blocker -->

<!-- handler: block-git-message-backtick -->

<!-- handler: block-pip-break-system -->

<!-- handler: block-sudo-pip -->

<!-- handler: block-comment-changelog -->

<!-- handler: block-comment-size -->

<!-- handler: plan-number-helper -->

<!-- handler: verification-result-gate -->

<!-- handler: bash-safe-mode -->

<!-- handler: remote-docs-provenance -->

<!-- handler: remote-docs-routing -->

<!-- handler: enforce-lsp-usage -->

<!-- handler: remote-docs-commit-gate -->

<!-- handler: require-gh-issue-comments -->

<!-- handler: require-gh-pr-comments -->

<!-- handler: staged-lint-gate -->

<!-- handler: plan-qa-commit-gate -->

<!-- handler: plan-qa-edit -->

<!-- handler: docs-qa-commit-gate -->

<!-- handler: docs-qa-edit -->

<!-- handler: failsafe-cron-blockage-suppressor -->

<!-- handler: auto-continue-stop -->

| ID                                 | Blocked                                                                                                            | Why                                                                                                                                                                                               | Fix                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| R-ASK-USER-QUESTION-UNJUSTIFIED    | AskUserQuestion without `ASKING BECAUSE:` prefix                                                                   | Asking pauses the session for a question the daemon cannot verify was necessary                                                                                                                   | State the assumed answer in output text and proceed, or retry every question prefixed `ASKING BECAUSE: <reason>` |
| R-GIT-RESET-HARD                   | `git reset --hard`                                                                                                 | Permanently destroys all uncommitted changes                                                                                                                                                      | Ask the user to run it manually                                                                                  |
| R-GIT-CLEAN-FORCE                  | `git clean -f`                                                                                                     | Permanently deletes untracked files                                                                                                                                                               | Ask the user to run it manually                                                                                  |
| R-GIT-CHECKOUT-DISCARD             | `git checkout -- <file>` / `git checkout .`                                                                        | Discards local changes to file(s) permanently                                                                                                                                                     | Ask the user to run it manually                                                                                  |
| R-GIT-RESTORE                      | `git restore <file>`                                                                                               | Discards local changes to files permanently (`--staged`/`-S` is allowed)                                                                                                                          | Ask the user to run it manually                                                                                  |
| R-GIT-STASH-DROP                   | `git stash drop`                                                                                                   | Permanently destroys a stashed change                                                                                                                                                             | Ask the user to run it manually                                                                                  |
| R-GIT-STASH-CLEAR                  | `git stash clear`                                                                                                  | Permanently destroys all stashed changes                                                                                                                                                          | Ask the user to run it manually                                                                                  |
| R-GIT-PUSH-FORCE                   | `git push --force` / `git push <remote> +<refspec>`                                                                | Can overwrite remote history and destroy team members' work                                                                                                                                       | Ask the user to run it manually, or coordinate and use `--force-with-lease`                                      |
| R-GIT-BRANCH-FORCE-DELETE          | `git branch -D` / `git update-ref -d refs/heads/<name>`                                                            | Force-deletes a branch without checking if it has been merged                                                                                                                                     | Use `git branch -d` first (refuses unmerged branches); ask the user for -D                                       |
| R-GIT-COMMIT-AMEND                 | `git commit --amend`                                                                                               | Rewrites the previous commit, creating messy history and potential data loss                                                                                                                      | Create a new commit instead                                                                                      |
| R-SED-FILE-MODIFICATION            | `sed`                                                                                                              | Claude gets sed syntax wrong regularly and a single error can destroy hundreds of files                                                                                                           | Use the Edit tool (or parallel Haiku agents with Edit for bulk changes)                                          |
| R-DAEMON-DIR-CD                    | `cd` into `.claude/hooks-daemon/`                                                                                  | Daemon CLI commands must be run from PROJECT ROOT, causing path confusion otherwise                                                                                                               | Run daemon commands from project root, e.g. `bin/hooks-daemon status`                                            |
| R-ABSOLUTE-PATH-REQUIRED           | `Read`/`Write`/`Edit` file_path requires absolute path                                                             | Ambiguous about the current working directory and can target the wrong file                                                                                                                       | Use an absolute path starting with /                                                                             |
| R-ERROR-HIDING                     | an error-hiding pattern (bare except,                                                                              |                                                                                                                                                                                                   | true, empty catch, result, _ := ..., ...)                                                                        |
| R-ARTIFACT-PUBLISH                 | publishing an artefact via the `Artifact` tool                                                                     | The page lives OUTSIDE the project and the repository cannot audit or retract it                                                                                                                  | Write the file locally and tell the user its path, or ask a human to publish                                     |
| R-CURL-PIPE-SHELL                  | \`curl                                                                                                             | wget ...                                                                                                                                                                                          | bash                                                                                                             |
| R-SECRET-READ                      | Read/Write/Edit/NotebookEdit/Grep targeting a protected path                                                       | The file's contents must NEVER be read into context by any route — not Read, not Bash, not an interpreter one-liner, not a copy                                                                   | Use `bin/hooks-daemon secret-meta <path>` for metadata, or ask the user                                          |
| R-SECRET-BASH-MENTION              | a Bash command whose text mentions a protected path                                                                | The file's contents must NEVER be read into context by any route — not Read, not Bash, not an interpreter one-liner, not a copy                                                                   | Use `bin/hooks-daemon secret-meta <path>` for metadata, or ask the user                                          |
| R-SECRET-SCRIPT-AUTHOR             | a script authored via Write/Edit whose content references a protected path                                         | The file's contents must NEVER be read into context by any route — not Read, not Bash, not an interpreter one-liner, not a copy                                                                   | Use `bin/hooks-daemon secret-meta <path>` for metadata, or ask the user                                          |
| R-SEC-CODE-INJECTION               | `eval`, `exec`, `new Function`, `__import__`, `instance_eval`, `yaml.load`                                         | Dynamic execution of a string as code                                                                                                                                                             | Avoid dynamic code execution; use safe parsing/import alternatives                                               |
| R-SEC-CMD-INJECTION                | `os.system`, `subprocess(..., shell=True)`, `shell_exec`, `proc_open`, `Runtime.exec`, `Process.Start`, `IO.popen` | Shell command construction from untrusted input enables command injection                                                                                                                         | Use argument-list APIs (no shell=True) instead of shell string concatenation                                     |
| R-SEC-DESERIALISATION              | `pickle.load`, `Marshal.load`, `unserialize`, `ObjectInputStream`, `XMLDecoder`, `BinaryFormatter`                 | Deserialising untrusted data can execute arbitrary code                                                                                                                                           | Use a safe serialisation format (e.g. JSON) instead                                                              |
| R-SEC-XSS                          | `innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `template.HTML`/`JS`/`URL`                               | Injects unescaped content into the DOM/output, enabling XSS                                                                                                                                       | Use the framework's safe templating/escaping APIs                                                                |
| R-SEC-HARDCODED-CREDS              | AWS access keys, GitHub tokens, Stripe keys, private key blocks                                                    | Hardcoded credentials leak via source control history and code review                                                                                                                             | Use environment variables, never hardcode credentials                                                            |
| R-SEC-UNSAFE-MEMORY                | Rust `from_raw_parts`, `transmute`                                                                                 | Bypasses Rust's memory/type safety guarantees                                                                                                                                                     | Use safe conversions (`as`, `From`/`Into`) or validated slice operations                                         |
| R-SENSITIVE-PUBLIC-PATTERN         | content matching a configured public pattern                                                                       | The pattern is a named, safe-to-disclose signal (a path, a placeholder, profanity, ...)                                                                                                           | Remove or replace the matched text before retrying                                                               |
| R-SENSITIVE-SECRET-TERM            | content matching a configured blocked term                                                                         | A gitignored secret word list term was found in what this call would record                                                                                                                       | Ask the user what the cited entry covers, then remove the matching text                                          |
| R-WRITE-OUTSIDE-PROJECT-ROOT       | a write whose target is outside the repository root                                                                | Outside the repo nothing is version-controlled, reviewed or durable — a container's temp directory is wiped on restart, and every other path rule is scoped to the repo so none of them judges it | Write it inside the repository — `untracked/scratch/` is the scratch location                                    |
| R-FLAGGABLE-CONTENT-CHANNEL        | a content-revealing git/grep command shape over a flaggable path                                                   | It would reveal flaggable content inside routine command output, with no deliberate Read at all                                                                                                   | Delegate the WHOLE review to the quarantine subagent instead                                                     |
| R-QUARANTINE-ARTEFACT-READ         | reading a quarantined `*-opus-security-DETAIL*` artefact into the coordinator                                      | A DETAIL artefact holds raw flaggable substance meant for a human or another quarantine agent only                                                                                                | Read the paired `*-opus-security-SUMMARY*` artefact instead                                                      |
| R-PIPE-TO-TAIL                     | \`                                                                                                                 | tail\`                                                                                                                                                                                            | Truncates output and causes information loss                                                                     |
| R-PIPE-TO-HEAD                     | \`                                                                                                                 | head\`                                                                                                                                                                                            | Truncates output and causes information loss                                                                     |
| R-WRITE-CLOBBER                    | `Write` to an existing file you have not read this session                                                         | You cannot know what you are destroying, so you could not report the loss even afterwards                                                                                                         | `Read` the file then retry, or use `Edit` for a targeted change                                                  |
| R-WORKTREE-FILE-COPY               | `cp`/`mv`/`rsync` between a worktree and the main repo                                                             | Defeats worktree isolation, bypasses git tracking, and can nuke untracked work in the target directory                                                                                            | cd into the worktree, commit, then git merge back                                                                |
| R-ROOT-RECURSION-CATASTROPHIC      | `grep -r`/`find`/`rg`/... rooted at `/`, `/proc`, `/sys`, `/home`, `/root`, `~`, `$HOME`                           | Walks the entire filesystem and can pin every CPU core for hours                                                                                                                                  | Scope the search to the project (e.g. `rg -l "pattern" .`)                                                       |
| R-GIT-STASH-PUSH                   | `git stash` / `git stash push` / `git stash save`                                                                  | Stashes get forgotten, lost, and block git pull                                                                                                                                                   | Use git commit instead — WIP commits are fine                                                                    |
| R-PGREP-SELF-MATCH                 | a `pgrep -f`/`pkill -f`/`ps`-piped-to-`grep` probe whose literal pattern matches this command's own argv           | The probe always finds itself, so a wait never ends and a check always lies                                                                                                                       | Bracket the first character (`pgrep -f '[p]rovision.bash'`), or wait on a log marker                             |
| R-UNBOUNDED-LIVENESS-LOOP          | a `while`/`until` wait on a process with a sleep-only body and no cap                                              | run_in_background has no time limit, so a wrong probe waits for ever                                                                                                                              | Wrap it in `timeout 3600 bash -c '…'`, add a counter, or wait on a log marker                                    |
| R-PGREP-UNRESOLVED-PATTERN         | a process probe whose pattern is built by expansion, inside a wait or a kill                                       | If it expands to text in this command's argv, the probe counts the caller                                                                                                                         | Bracket the pattern where it is built, or wait on a log marker                                                   |
| R-CHMOD-WORLD-WRITABLE             | `chmod 777`/`chmod a+w`/`chmod o+w`                                                                                | Allows anyone to read, write, and execute, bypassing all file permission security                                                                                                                 | Use least-privilege permissions instead (755/644/600)                                                            |
| R-GH-AUTO-CLOSE-KEYWORD            | a GitHub closing keyword + issue reference in a git/gh message                                                     | Auto-closes the referenced issue/PR the moment the commit reaches the default branch, and cannot be disabled repository-side                                                                      | Use a non-closing reference instead, e.g. Addresses #123                                                         |
| R-GIT-MERGE-SQUASH                 | `git merge --squash`                                                                                               | Severs ancestry -- git branch -d refuses the branch forever                                                                                                                                       | Use git merge --no-ff instead                                                                                    |
| R-GH-PR-MERGE-SQUASH               | `gh pr merge --squash`                                                                                             | Severs ancestry -- git branch -d refuses the branch forever                                                                                                                                       | Use gh pr merge --merge instead                                                                                  |
| R-GH-PR-MERGE-REBASE               | `gh pr merge --rebase`                                                                                             | Severs ancestry -- git branch -d refuses the branch forever                                                                                                                                       | Use gh pr merge --merge instead                                                                                  |
| R-LOCK-FILE-EDIT                   | Direct `Write`/`Edit` of a package manager lock file                                                               | Lock files are generated artifacts; manual edits create checksum mismatches and broken dependency graphs                                                                                          | Use the package manager commands instead (e.g. `npm install`, `cargo update`)                                    |
| R-GIT-MESSAGE-BACKTICK             | an unescaped backtick in a double-quoted git commit/tag message                                                    | Bash performs command substitution inside double quotes -- the span is EXECUTED, not quoted                                                                                                       | Use single quotes, or git commit -F <file>                                                                       |
| R-PIP-BREAK-SYSTEM-PACKAGES        | `pip install --break-system-packages`                                                                              | Bypasses PEP 668 protection and can corrupt the system Python installation                                                                                                                        | Use a virtual environment or `pip install --user` instead                                                        |
| R-SUDO-PIP-INSTALL                 | `sudo pip install`                                                                                                 | Conflicts with the OS package manager and can corrupt system Python                                                                                                                               | Use a virtual environment or `pip install --user` instead                                                        |
| R-COMMENT-CHANGELOG                | changelog narrative in a code comment                                                                              | A comment describes CURRENT STATE; history belongs elsewhere                                                                                                                                      | Move it to git, a changelog file, or the plan's JOURNAL/                                                         |
| R-COMMENT-SIZE                     | a comment growing past its configured size limit                                                                   | Comments should describe current state, not accumulate                                                                                                                                            | Shorten the comment, or declare MUST_EXCEED_COMMENT_SIZE_BECAUSE                                                 |
| R-PLAN-NUMBER-DISCOVERY            | a bash discovery scan (ls/find/sort+tail) for the next plan number                                                 | Misses subdirectories like Completed/ and disagrees across branches                                                                                                                               | Use the printed next plan number, or the git counter directly                                                    |
| R-PLAN-FOLDER-MKDIR                | `mkdir <plan-dir>/NNNNN-name` (hand-creating a plan folder)                                                        | Claims a plan number the moment the folder appears, but nothing records the claim until PLAN.md is written                                                                                        | Use the mkplan.bash scaffolder instead                                                                           |
| R-VERIFICATION-RESULT-NOT-CONSUMED | a verifier followed by a mutator with nothing consuming the result                                                 | The verifier can fail and the mutator would still run                                                                                                                                             | Gate with `&&`, an explicit exit-code check, or `set -euo pipefail`                                              |
| R-BASH-SAFE-MODE-PRELUDE-MISSING   | a sequenced Bash invocation with no `set` safety prelude                                                           | Errors in earlier statements can be silently ignored                                                                                                                                              | Add `set -euo pipefail` at the top, or gate explicitly with `&&`/\`                                              |
| R-REMOTE-DOCS-PROVENANCE           | a write into the remote-docs tree without valid provenance frontmatter                                             | A vendored document with no recorded source is indistinguishable from something we wrote ourselves, and cannot be refreshed, dated or trusted                                                     | Capture with `hooks-daemon remote-docs add <url>` instead of hand-authoring                                      |
| R-REMOTE-DOCS-VENDORED-COPY        | a WebFetch of a URL this project already holds a fresh vendored copy of                                            | The local copy is faster, costs no network round trip, and is the corpus the remote-docs tree exists to build                                                                                     | Read the local path named in the message, or refresh it if you need newer content                                |
| R-LSP-SYMBOL-LOOKUP                | a symbol-like Grep/Bash grep lookup                                                                                | LSP tools give semantic ~50ms code intelligence; grep is slow and imprecise                                                                                                                       | Use goToDefinition/findReferences/workspaceSymbol/hover/documentSymbol instead                                   |
| R-REMOTE-DOCS-STAGED-PROVENANCE    | a commit staging a remote-docs file without valid provenance frontmatter                                           | An unattributed vendored document that reaches history needs a rewrite to remove, and cannot be refreshed, dated or trusted meanwhile                                                             | Capture with `hooks-daemon remote-docs add <url>` and re-stage                                                   |
| R-GH-ISSUE-VIEW-NO-COMMENTS        | `gh issue view` without `--comments`                                                                               | Issue comments contain critical context, clarifications and updates not in the issue body                                                                                                         | Add --comments, or include comments in --json fields                                                             |
| R-GH-PR-VIEW-NO-COMMENTS           | `gh pr view` without `--comments`                                                                                  | PR comments contain review feedback and discussion context not in the PR body                                                                                                                     | Add --comments, or include comments in --json fields                                                             |
| R-STAGED-LINT-FAILURE              | a staged file fails the cheap syntax check at commit time                                                          | lint_on_edit only ever runs at Write/Edit time, so a git add of pre-existing content skips it entirely                                                                                            | Fix the failing file(s) above and re-stage before committing                                                     |
| R-PLAN-QA-COMMIT                   | a git commit violates a block-level plan QA cross-file invariant                                                   | Most plan rot is cross-file and a single-file edit hook cannot see it                                                                                                                             | Amend the commit to also stage what each finding's remediation names below                                       |
| R-PLAN-QA-EDIT                     | a PLAN.md/README.md Write/Edit violates a block-level plan QA check                                                | Plan QA linting catches issues you can fix immediately, before they reach commit                                                                                                                  | Fix the content per each finding's remediation below and retry                                                   |
| R-DOCS-QA-COMMIT                   | a git commit violates a block-level docs QA staged-tree check                                                      | Most doc rot that matters at commit time is cross-file drift a single-file edit hook cannot see                                                                                                   | Fix the content per each finding's remediation below and amend the commit                                        |
| R-DOCS-QA-EDIT                     | a documentation Write/Edit violates a block-level docs QA check                                                    | A finding only denies the write when it is BLOCK severity AND the resolved mode for that check is block                                                                                           | Fix the content per each finding's remediation below and retry                                                   |
| R-FAILSAFE-CRON-SUPPRESSED         | A delivered failsafe-cron tick, while a 'blocked only on human input' marker is live                               | Every tick against a session blocked only on human input is a guaranteed no-op model turn                                                                                                         | Nothing to do -- this is expected. Send a real message to clear the marker and resume ticks                      |
| R-FAILSAFE-CRON-BACKED-OFF         | A delivered failsafe-cron tick, while this session is producing nothing and owes no ledgered work                  | An hourly tick against a session with nothing to recover costs a full model turn and finds nothing                                                                                                | Nothing to do -- ticks continue, just less often. Any real user message restores hourly cadence                  |
| R-STOP-QA-FAILURE                  | Stopping while the last QA tool run's own output indicated failure                                                 | QA failures detected in the last QA tool run                                                                                                                                                      | Fix the failures, re-run the QA tool, and continue without stopping                                              |
| R-STOP-TAUTOLOGICAL-QUESTION       | Stopping behind a rhetorical continue/confirmation question                                                        | The answer is obvious -- yes, continue the already-planned work now                                                                                                                               | Resume the next unit of work immediately; STOPPING BECAUSE: does not exempt this                                 |
| R-STOP-AFTER-TOOL-ERROR            | Stopping right after an unresolved tool_use_error                                                                  | The correct action is to address the cause and retry, not stop                                                                                                                                    | Address the tool_use_error's cause (e.g. Read before Edit/Write) and retry                                       |
| R-STOP-CONFIRMATION-QUESTION       | Stopping to ask an obvious confirmation question                                                                   | The daemon auto-continues through confirmation-style questions                                                                                                                                    | Proceed with the remaining work; stop with STOPPING BECAUSE: only if truly stuck                                 |
| R-STOP-NO-REASON                   | Stopping without a STOPPING BECAUSE: explanation                                                                   | The stop hook enforces intentional stops                                                                                                                                                          | Prefix your stop message with STOPPING BECAUSE: <reason>, or keep working                                        |
| R-STOP-GOAL-LEDGER                 | Stopping while ledgered plan(s) are still In Progress                                                              | The daemon-side goal ledger owes a goal for EVERY In Progress plan, not only the newest /goal condition                                                                                           | Continue the listed plan(s), or stop with STOPPING BECAUSE: naming why each cannot proceed                       |

## Advisories and other active handlers

One line each; these fire with their own guidance when relevant. Full text: `bin/hooks-daemon explain-handler <name>`.

<!-- handler: plan-workflow-guidance -->

- plan_workflow — PLAN.md, supporting docs and JOURNAL/ obey DIFFERENT contracts

<!-- handler: agent-isolation-advisor -->

- agent_isolation_advisor — isolate concurrent agents

<!-- handler: dispatch-declaration -->

- dispatch_declaration — declare where a subagent's reports go

<!-- handler: flaggable-work-advisor -->

- flaggable_work_advisor — delegate flaggable work BEFORE reading it

<!-- handler: article-snippet-enforcer -->

- article-snippet-enforcer — articles must use the snippet system

<!-- handler: background-process-tracker -->

- background_process_tracker — backgrounded processes are tracked

<!-- handler: budget-exhaustion-detector -->

- budget_exhaustion_detector — hidden agent budgets are surfaced

<!-- handler: command-hints -->

- command_hints — advisory reminders after specific commands

<!-- handler: git-hooks-executable-fixer -->

- git_hooks_executable_fixer — auto-fixes non-executable git hooks

<!-- handler: goal-injection -->

- goal_injection — plan-start goal signal for the ccy supervisor

<!-- handler: markdown-table-formatter -->

- markdown_table_formatter — markdown tables are auto-aligned

<!-- handler: model-downgrade-recorder -->

- model_downgrade_recorder — the automatic model downgrade is written down

<!-- handler: recovery-cron-advisor -->

- recovery_cron_advisor — failsafe recovery cron lifecycle advisory

<!-- handler: project-handler-load-checker -->

- project_handler_load_checker — project protection degraded alert

<!-- handler: hook-registration-checker -->

- hook_registration_checker — hooks configuration policy

<!-- handler: git-upstream-checker -->

- git_upstream_checker — additive fetch + pull/cleanup advice on session start

<!-- handler: plan-qa-sweep -->

- plan_qa_sweep — plan-tree drift report at session start

<!-- handler: ccy-supervisor-integrity -->

- ccy_supervisor_integrity — keep the ccy supervisor properly set up

<!-- handler: plan-workflow-asset-checker -->

- plan_workflow_asset_checker — plan tooling provisioning alert

<!-- handler: secret-file-hygiene-checker -->

- secret_file_hygiene_checker -- on-disk hygiene for protected paths

<!-- handler: model-fallback-detector -->

- model_fallback_detector — silent model substitution is surfaced

<!-- handler: docs-qa-sweep -->

- docs_qa_sweep — documentation drift report at session start

<!-- handler: tool-disable-advisor -->

- tool_disable_advisor — declared never-want tools are checked at session start

<!-- handler: ts-qa-ci -->

- ts-qa-ci

<!-- handler: idle-housekeeping-advisory -->

- idle_housekeeping_advisory — report-first idle housekeeping (beta, opt-in)

<!-- handler: standing-authorisations -->

- standing_authorisations — a project can record a standing request

<!-- handler: auto-approve-reads -->

- auto_approve_reads — gated on bypassPermissions mode

<!-- handler: subagent-report-size-blocker -->

- subagent_report_size_blocker — write large reports to a file

<!-- handler: worktree-create -->

- worktree_create — semantic worktree naming

</hooksdaemon>
