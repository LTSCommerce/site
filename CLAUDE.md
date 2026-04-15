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

<hooksdaemon>
<!-- Auto-generated by hooks daemon on restart. Do not edit this section — changes will be overwritten. -->

## Hooks Daemon — Active Handler Guidance

The handlers listed below are active in this project. Read this section to avoid triggering unnecessary blocks.

**When a tool is blocked by a handler, do not stop working.** Read the block reason, modify your approach, and continue with your task.

## destructive_git — blocked git commands

The following git commands are permanently blocked and will always be denied:

| Command | Reason |
|---------|--------|
| `git reset --hard` | Permanently destroys all uncommitted changes |
| `git clean -f` | Permanently deletes untracked files |
| `git checkout -- <file>` | Discards all local changes to that file |
| `git restore <file>` | Discards local changes (`--staged` is allowed) |
| `git stash drop` | Permanently destroys stashed changes |
| `git stash clear` | Permanently destroys all stashes |
| `git push --force` | Can overwrite remote history and destroy teammates' work |
| `git branch -D` | Force-deletes branch without checking if merged (lowercase `-d` is safe) |
| `git commit --amend` | Rewrites the previous commit — create a new commit instead |

If the user needs to run one of these, ask them to do it manually. Do not attempt to work around the block.

**Safe alternatives**: `git stash` (recoverable), `git diff` / `git status` (inspect first), `git commit` (save changes permanently first).

## sed_blocker — sed is forbidden for file modification

`sed` is blocked because Claude gets sed syntax wrong and a single error can silently destroy hundreds of files with no recovery possible.

**Blocked**:
- `sed -i` / `sed -e` (in-place file editing via Bash tool)
- `grep -rl X | xargs sed -i` (mass file modification)
- Shell scripts (`.sh`/`.bash`) written via Write tool that contain `sed`

**Allowed** (read-only, no file modification):
- `cat file | sed 's/x/y/' | grep z` (pipeline transforming stdout only)
- `sed` mentioned in commit messages, PR bodies, or `.md` documentation files

**Use instead**:
- `Edit` tool — safe, atomic, verifiable
- Parallel Haiku agents with `Edit` tool for bulk changes across many files:
  1. Identify all files to update
  2. Dispatch one Haiku agent per file
  3. Each agent uses the `Edit` tool (never `sed`)

## absolute_path — always use absolute paths

The `Read`, `Write`, and `Edit` tools require absolute paths. Relative paths are blocked.

- **Correct**: `/workspace/src/main.py`, `/workspace/tests/test_utils.py`
- **Blocked**: `src/main.py`, `./config.yaml`, `../other/file.txt`

The working directory is `/workspace`. Prepend `/workspace/` to any relative path before calling these tools.

## error_hiding_blocker — error-suppression patterns are blocked

Writing code that silently swallows errors is blocked. All errors must be handled explicitly.

**Blocked patterns (examples)**:
- Python: bare `except` clauses with an empty body, catching and discarding all exceptions
- Shell: redirecting stderr to `/dev/null` to silence failures, `|| true` to suppress non-zero exit codes
- JavaScript/TypeScript: empty `catch` blocks that swallow exceptions
- Go: `_ = err` (discarding error return values without handling)

**Required action**: Handle errors explicitly — log them, return them to the caller, or propagate them. Silent error suppression masks bugs and makes debugging impossible.

## curl_pipe_shell — never pipe curl/wget to bash/sh

Piping network content directly to a shell is blocked. It executes untrusted remote code without any inspection.

**Blocked**: `curl URL | bash`, `curl URL | sh`, `wget URL | bash`, `curl URL | sudo bash`

**Safe alternative**: download first, inspect, then execute:
```
curl -o /tmp/script.sh URL
cat /tmp/script.sh          # inspect
bash /tmp/script.sh         # execute if safe
```

## security_antipattern — OWASP security antipatterns are blocked

Writing code that contains security antipatterns is blocked across all supported languages. Fix the code to use safe patterns instead.

**Blocked categories**:
- SQL injection: building queries via string concatenation (use parameterised queries)
- Command injection: passing unvalidated input to subprocess (use argument lists)
- Hardcoded credentials: API keys, passwords, tokens embedded in source code
- Weak cryptography: MD5 or SHA1 for password hashing (use bcrypt/argon2)
- Path traversal: unvalidated user input used in file paths

**Supported languages**: Python, JavaScript/TypeScript, Go, PHP, Ruby, Java, Kotlin, C#, Rust, Swift, Dart.

### Pipe Blocker

Commands piped to `tail` or `head` are **blocked** — piping truncates output and causes information loss.

**Use a temp file instead:**

```bash
# WRONG — blocked:
pytest tests/ 2>&1 | tail -20

# RIGHT — redirect to temp file:
pytest tests/ > /tmp/pytest_out.txt 2>&1
# Then read selectively if needed
```

**Allowed** (whitelisted): `grep`, `rg`, `awk`, `sed`, `jq`, `ls`, `cat`, `git log`, `git tag`, `git branch`, and other cheap filtering commands.

**Add to whitelist** (if safe to pipe): set `extra_whitelist` in `.claude/hooks-daemon.yaml` under `pipe_blocker`.

## worktree_file_copy — do not copy files between worktrees and the main repo

`cp`, `mv`, and `rsync` operations that move files from a worktree directory (`untracked/worktrees/` or `.claude/worktrees/`) into the main repo (`src/`, `tests/`, `config/`) — or vice versa — are blocked.

Worktrees are isolated branches. Cross-copying corrupts that isolation and can silently overwrite in-progress work.

**Allowed**: operations within the same worktree branch. **To merge changes**: use `git merge` or `git cherry-pick` instead.

## git_stash — git stash is advisory by default

`git stash`, `git stash push`, and `git stash save` trigger this handler. `git stash pop`, `git stash apply`, `git stash list`, and `git stash show` are always allowed.

**Default mode** (`warn`): stash is allowed but an advisory message explains risks.
**Deny mode** (`deny`): stash is blocked — use `git commit` to checkpoint work instead.

Configure via `handlers.pre_tool_use.git_stash.options.mode: deny` to enforce the stricter policy.

## dangerous_permissions — chmod 777 is blocked

`chmod 777` and other world-writable permission commands are blocked. Overly permissive file permissions are a security vulnerability.

**Blocked**: `chmod 777`, `chmod 666`, `chmod a+w`, `chmod o+w`

**Use least-privilege permissions instead**:
- Executable scripts: `chmod 755` (owner rwx, group/other rx)
- Regular files: `chmod 644` (owner rw, group/other r)
- Private files: `chmod 600` (owner rw only)

## lock_file_edit_blocker — never directly edit lock files

Direct `Write` or `Edit` to package manager lock files is blocked. Lock files are generated artifacts; manual edits create checksum mismatches and broken dependency graphs.

**Blocked files**: `composer.lock`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Gemfile.lock`, `Cargo.lock`, `go.sum`, `Package.resolved`, `Pipfile.lock`, and others.

**Use package manager commands instead**:
- PHP: `composer install` / `composer require package`
- Node: `npm install` / `yarn add package`
- Ruby: `bundle install` / `bundle add gem`
- Rust: `cargo add crate`
- Go: `go get module`

## lsp_enforcement — use LSP tools for code symbol lookups

Using `Grep` or `Bash` (grep/rg) to find class definitions, function signatures, or symbol references is blocked or redirected to LSP tools, which are faster and semantically accurate.

**Prefer LSP tools for**:
- Finding where a class or function is defined → `goToDefinition`
- Finding all usages of a symbol → `findReferences`
- Getting type information or documentation → `hover`
- Listing all symbols in a file → `documentSymbol`
- Searching symbols across the project → `workspaceSymbol`

**Grep/Bash grep is still appropriate for**: text patterns in content, log searching, finding strings in config files.

Default mode (`block_once`): the first symbol-lookup grep in a session is denied with guidance; subsequent retries are allowed.

## gh_issue_comments — always include --comments on gh issue view

`gh issue view` without `--comments` is blocked. Issue comments often contain critical context, clarifications, and updates not in the issue body.

**Blocked**: `gh issue view 123`, `gh issue view 123 --repo owner/repo`

**Allowed**: `gh issue view 123 --comments`, `gh issue view 123 --json title,body,comments`

If using `--json`, include `comments` in the field list instead of adding `--comments`.

## article-snippet-enforcer — articles must use the snippet system

Writes to `src/data/articles.ts` that embed multi-line code directly inside `<pre><code>...</code></pre>` blocks are blocked. Articles must reference code via `{{SNIPPET:article-slug/filename.ext}}` placeholders.

**Workflow**:
1. Create the code file under `code-snippets/<article-slug>/`.
2. Reference it from the article: `<pre><code class="language-php">{{SNIPPET:article-slug/example.php}}</code></pre>`.
3. The build step (`scripts/generate-snippets.mjs`) auto-generates `src/data/snippets.ts` from those files.

Short inline references like `<code>exampleVar</code>` are allowed.

## markdown_table_formatter — markdown tables are auto-aligned

After every `Write` or `Edit` of a `.md` or `.markdown` file, the content is re-formatted via `mdformat + mdformat-gfm` so that table pipes are aligned and column widths are consistent. The handler is non-terminal and advisory — it never blocks, it just rewrites the file on disk.

**What changes:**

- Table pipes are aligned vertically and delimiter rows widened to match cell widths.
- Ordered lists keep consecutive numbering (`1.` `2.` `3.`).
- `---` thematic breaks are preserved (mdformat's 70-underscore default is post-processed back).
- Asterisks in table cells are escaped (`*` → `\*`) as required by GFM.

**Ad-hoc formatting of existing files:**

```
$PYTHON -m claude_code_hooks_daemon.daemon.cli format-markdown <path>
```

### Stop Explanation Required

Before stopping, **prefix your final message** with `STOPPING BECAUSE:` followed by a clear reason:

```
STOPPING BECAUSE: all tasks complete, QA passes, daemon restart verified.
```

**Why**: The stop hook enforces intentional stops. Stopping without an explanation triggers an auto-block that asks you to explain or continue.

**Alternatives**:
- `STOPPING BECAUSE: <reason>` — stops cleanly with explanation
- Continue working — no need to stop unless all work is genuinely complete

**Do NOT**:
- Stop mid-task without explanation
- Ask confirmation questions and then stop (the hook auto-continues those)
- Use `AUTO-CONTINUE` unless you intend to keep working indefinitely

**Before asking a question, evaluate it critically**:
- Tautological/rhetorical questions with obvious answers ("Should I continue?", "Would you like me to proceed?") — do NOT ask, just do it
- Errors with a clear next step ("The test failed, should I fix it?") — do NOT ask, just fix it
- Genuine choice questions where all options are valid ("Which of A, B, or C should we use?") — these deserve a response. Use `STOPPING BECAUSE: need user input` and ask your question

</hooksdaemon>
