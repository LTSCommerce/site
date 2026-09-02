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

## ask_user_question_blocker — questions need `ASKING BECAUSE:` justification

AskUserQuestion calls are only allowed when every `question` string begins with `ASKING BECAUSE:` (case-sensitive, leading whitespace OK). The convention mirrors the Stop handler's `STOPPING BECAUSE:` pattern — explicit declared intent gates the privilege of pausing the session.

**Before asking, evaluate critically**:

- Tautological/rhetorical questions with one obvious answer ("Should I continue?", "Would you like me to proceed?") — do NOT ask. State the question and your assumed-correct answer in plain output text and proceed. The user is watching and will interrupt if the assumption is wrong.
- Questions whose options reduce to **good vs. bad** are tautological — the answer is always the good option. Examples: best practice vs. bodge, increasing vs. decreasing code quality, delivering the requirement vs. not delivering it, fixing the failing test vs. leaving it broken, following project conventions vs. inventing your own. Do NOT ask; pick the good option and proceed.
- Errors with a clear recovery path ("Should I fix the failing test?") — do NOT ask. Fix it.
- Genuine choice questions where you cannot resolve the answer from context — these are the legitimate use case. Prefix every question text with `ASKING BECAUSE: <one-line reason you cannot decide>` so the daemon allows the call through.

**Audit log pattern** (preferred for tautological questions):

```
I would normally ask: <question>.
Assumed answer: <your assumption>.
Proceeding on that basis; the user will interrupt if wrong.
```

**Escape hatch** (genuine ambiguity): prefix every question text with `ASKING BECAUSE: <reason>`. Mixing prefixed and non-prefixed questions in one call still triggers a block — prefix all or none.

## destructive_git — blocked git commands

The following git commands are permanently blocked and will always be denied:

| Command                  | Reason                                                                   |
| ------------------------ | ------------------------------------------------------------------------ |
| `git reset --hard`       | Permanently destroys all uncommitted changes                             |
| `git clean -f`           | Permanently deletes untracked files                                      |
| `git checkout -- <file>` | Discards all local changes to that file                                  |
| `git restore <file>`     | Discards local changes (`--staged` is allowed)                           |
| `git stash drop`         | Permanently destroys stashed changes                                     |
| `git stash clear`        | Permanently destroys all stashes                                         |
| `git push --force`       | Can overwrite remote history and destroy teammates' work                 |
| `git branch -D`          | Force-deletes branch without checking if merged (lowercase `-d` is safe) |
| `git commit --amend`     | Rewrites the previous commit — create a new commit instead               |

If the user needs to run one of these, ask them to do it manually. Do not attempt to work around the block.

**To delete a branch, ALWAYS try `git branch -d` first.** It is allowed, it is battle-tested, and it refuses unless the branch is genuinely merged. Reach for anything else only once it has actually refused:

```
git branch -d <name>                          # ALWAYS TRY THIS FIRST
hooks-daemon delete-branch --dry-run <name>    # only if -d refused
hooks-daemon delete-branch <name>              # deletes only if provably safe
```

`git branch -d` refuses a branch whose commits are not ancestors of the target, which after a history rewrite or a squash merge means EVERY branch — the content is upstream but the ancestry is severed. That specific gap is what `delete-branch` fills; it is not a general replacement. It refuses by default and deletes only what it can prove is recoverable: merged, or every commit already upstream by patch-id, or every file version byte-identical to a blob still reachable from `main`. For a merged branch it delegates to `git branch -d` anyway, so git re-checks the work independently. A recovery bundle is written first unless you pass `--no-bundle`. If it refuses, it names the files whose CONTENT exists nowhere else.

**Abandoning unmerged work is human-gated and you cannot complete it.** When no proof holds, the branch holds the only copy of real work, so `--allow-unproven --reason` is not enough: the command also requires a human to type a confirmation at an interactive terminal, which your non-interactive shell does not have. Those flags declare intent; consent is separate and cannot be self-granted. Report the named files to the user and ask them to run the command themselves — do not hunt for a way around it.

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

## daemon_location_guard — do not cd into .claude/hooks-daemon/

Bash commands that change directory into `.claude/hooks-daemon/` (or `cd` into a daemon-internal subdirectory and then run something) are blocked. The daemon is an upstream dependency that must remain untouched in client repos.

**Run daemon CLI from the project root instead** — it always works regardless of cwd:

```
/workspace/.claude/hooks-daemon/bin/hooks-daemon status
/workspace/.claude/hooks-daemon/bin/hooks-daemon restart
/workspace/.claude/hooks-daemon/bin/hooks-daemon logs
```

If you need to inspect daemon source for debugging, use `Read` from the project root with the absolute path — never `cd` in. Do NOT edit anything inside `.claude/hooks-daemon/`; changes will be overwritten on the next upgrade.

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

**Excluded paths**: vendor/, node_modules/, and test-fixture dirs (tests/fixtures/, tests/assets/, **fixtures**/) are skipped by default. Exempt more paths with glob patterns via `handlers.pre_tool_use.error_hiding_blocker.options.exclude_paths` or the project-wide `daemon.exclude_paths` — use these for fixtures of deliberately-broken code instead of disabling the handler.

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

- Code injection: `eval`, `exec`, `new Function`, `__import__`, `instance_eval`, `yaml.load` — dynamic execution of a string
- Command injection: `os.system`, `subprocess(..., shell=True)`, `shell_exec`, `proc_open`, `Runtime.exec`, `Process.Start`, `IO.popen`
- Unsafe deserialization: `pickle.load`, `Marshal.load`, `unserialize`, `ObjectInputStream`, `XMLDecoder`, `BinaryFormatter`
- XSS: `innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `template.HTML`/`JS`/`URL`
- Hardcoded credentials: AWS access keys, GitHub tokens, Stripe keys, private key blocks

**This is pattern matching on known-dangerous constructs, not analysis.** It does NOT detect SQL injection, weak hashing, or path traversal — those are properties of how a value FLOWS, which a regex cannot see. Do not read a passing write as 'this code is secure'.

**Supported languages**: Python, JavaScript/TypeScript, Go, PHP, Ruby, Java, Kotlin, C#, Rust, Swift, Dart. Coverage varies by language — a construct blocked in one is not necessarily blocked in another.

**Excluded paths**: vendor/, node_modules/, and test fixtures are skipped by default. Exempt more paths with glob patterns via `handlers.pre_tool_use.security_antipattern.options.exclude_paths` or the project-wide `daemon.exclude_paths`.

## sensitive_content — blocked patterns and secret terms are never written

Writing content that matches a configured public pattern or a gitignored secret word list is blocked. Two sources, two different disclosure rules:

**Public patterns** (`handlers.pre_tool_use.sensitive_content.options.public_patterns`): named regexes safe to name — the deny reason shows the pattern name and the exact matched text so you can fix it.

**Secret word list** (`options.secret_word_list_path`, default `.claude/block-words.secret`, gitignored): a term never appears anywhere — not in the deny reason, not in any log, not in payload capture, not in a transcript archive. The deny reason names only an index (`entry N of M in the secret word list`), which is meaningless without the gitignored file. **Do NOT try to guess or work around the block** — open the secret word list file (if you have access) to see what matched, or ask the user. Only the ADDED text is checked on `Edit` (`new_string`) — removing sensitive content is never blocked.

**Git metadata is checked too.** File contents and file PATHS are only two of the seven places a term can enter a repository — the other five are git metadata, and none of them is a file write. So a `Bash` command that records metadata is also checked: `git commit` (messages), `git tag` (names and messages), `git branch` / `checkout -b` / `switch -c` (branch names), `git config user.name|user.email` (author identity), `git merge -m`. A match denies the command.

**Reading is never blocked.** Only commands that WRITE metadata are candidates, so `grep`, `cat`, `git log --grep=`, `git show`, `git branch --list` and `git tag -l` stay allowed even when the term is right there on the command line — searching for a term and removing it are exactly the work of cleaning a repository.

If a compound command is denied because an unrelated part of it carries a term (`grep <term> f && git commit -m 'clean'`), split it into two calls rather than trying to disguise the term.

Missing/empty/comments-only secret file = this source is silently inert.

### Pipe Blocker

Commands piped to `tail` or `head` are **blocked** — piping truncates output and causes information loss.

**Do NOT do the theatre** of capturing output to a file and then echoing the WHOLE file to stdout — that defeats the point and just bloats tokens.

**Preferred — `echd-capture`**: capture the FULL output, see only a preview. When the block fires it prints the exact invocation to use — an ABSOLUTE path to the deployed helper, not a bare name — so copy the path from the block message (the helper is not guaranteed to be on `PATH`). If no helper path can be resolved, the block recommends the temp-file redirect below instead.

```bash
# WRONG — blocked (and truncates):
pytest tests/ 2>&1 | tail -20

# RIGHT — full capture, bounded preview + path to the rest. Use the ABSOLUTE
# echd-capture path from the block message (shown here as /…/scripts/echd-capture):
set -o pipefail
pytest tests/ 2>&1 | /…/scripts/echd-capture 20
# prints the last 20 lines + '(full output: /…/command-output-….txt)'.
# Use --head N for the first N lines. pipefail keeps pytest's exit code visible.
```

**Always-works alternative** (no helper, no pipe): `pytest tests/ > /tmp/out.txt 2>&1` then read the file selectively.

**Allowed** (whitelisted): `grep`, `rg`, `awk`, `sed`, `jq`, `ls`, `cat`, `git log`, `git tag`, `git branch`, and other cheap filtering commands.

**Only PIPES are restricted — reading a file directly is not.** `tail -n 40 <file>`, `head -n 40 <file>` and `grep pattern <file>` take the path as an ARGUMENT, so no pipe exists and this handler never sees them. That is the supported way to sample a large append-only file such as a plan's `JOURNAL/` day-file — which you should tail or grep rather than read whole.

**Add to whitelist** (if safe to pipe): set `extra_whitelist` in `.claude/hooks-daemon.yaml` under `pipe_blocker`.

## worktree_file_copy — do not copy files between worktrees and the main repo

`cp`, `mv`, and `rsync` operations that move files from a worktree directory (`untracked/worktrees/` or `.claude/worktrees/`) into the main repo (`src/`, `tests/`, `config/`) — or vice versa — are blocked.

Worktrees are isolated branches. Cross-copying corrupts that isolation and can silently overwrite in-progress work.

**Allowed**: operations within the same worktree branch. **To merge changes**: use `git merge` or `git cherry-pick` instead.

## root_recursion_guard — recursive scans rooted at / are blocked

A recursive scanner whose path argument resolves to a catastrophic root location is blocked, because it walks the entire filesystem and can pin every CPU core for hours.

**Blocked** (recursive scanner + dangerous root path):

- `grep -r`/`-R`/`-rl`, `ugrep -r`, `rgrep`, `find`, `fd`/`fdfind`, `rg`
- pointed at `/`, `/proc`, `/sys`, `/home`, `/root`, `~`, `$HOME`

**Allowed**: the same scanners scoped to the project — `rg -l "x" /workspace`, `grep -rl "x" "$CLAUDE_PROJECT_DIR"`, `grep -rl x src/`, `find . -name y`. Non-recursive `grep x /etc/hosts` is not affected.

**Note**: `... | head` does NOT bound a `-l`/`-rl` scan — a producer that matches nothing never writes, so it never receives SIGPIPE and runs to completion across the whole disk.

**Escape hatch** (rare legitimate whole-disk scan):

```
MUST_SCAN_ROOT_BECAUSE="explain why"; grep -rl x /
```

## git_stash — git stash is blocked by default

`git stash`, `git stash push`, and `git stash save` are blocked. `git stash pop`, `git stash apply`, `git stash list`, and `git stash show` are always allowed.

**Why**: stashes get forgotten, lost, and block `git pull`. Use `git commit -m 'WIP: ...'` instead — WIP commits are acceptable.

**Escape hatch** (when commit truly won't work):

```
MUST_STASH_BECAUSE="explain why"; git stash
```

Configure via `handlers.pre_tool_use.git_stash.options.mode: warn` for advisory-only mode.

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

## pip_break_system — --break-system-packages is blocked

`pip install --break-system-packages` (and the `pip3` / `python -m pip` / `python3 -m pip` variants) is blocked. The flag bypasses PEP 668 system-package protection and corrupts the system Python environment in containers and on modern Linux distros.

**Use a virtualenv or `--user` install instead**:

```
python3 -m venv /tmp/venv && /tmp/venv/bin/pip install <package>
# or
pip install --user <package>
```

If a tool's installer insists on `--break-system-packages` (some quick-start scripts do), download it first, inspect, and run it inside a venv — do not shortcut by adding the flag.

## sudo_pip — sudo pip install is blocked

`sudo pip install` (and the `sudo pip3` / `sudo python -m pip` / `sudo python3 -m pip` variants) is blocked. Installing as root corrupts the system Python managed by the OS package manager and creates permission/ownership issues that are painful to recover from.

**Use a virtualenv or `--user` install instead**:

```
python3 -m venv /tmp/venv && /tmp/venv/bin/pip install <package>
# or
pip install --user <package>
```

Even in a container running as root, `sudo` adds nothing — drop it and use a venv.

## plan_number_helper — use `mkplan.bash` to create a plan

**To create a new plan, run the deployed scaffolding script:**

```
CLAUDE/Plan/mkplan.bash "descriptive-kebab-name"
```

(Use the project's configured plan directory if it is not `CLAUDE/Plan/`.) The script takes a lock, reads the same authoritative git counter (`hooksdaemon.latestPlanNumber`), assigns the next number atomically, creates the `NNNNN-name/` folder, scaffolds `PLAN.md`, and advances the counter — so concurrent runs can never collide on a number. It prints the new folder path on stdout. You still add the README index row yourself (the script reminds you).

**If you only need the _number_ (not a folder)**, read the counter and add 1 — this is the fallback, not the primary path:

```
git config --local hooksdaemon.latestPlanNumber
```

Add 1 to that value (zero-pad to 5 digits, e.g. counter `117` → next plan `00118`). The git counter is the source of truth; the daemon keeps it correct across branches.

**Do NOT** scan `CLAUDE/Plan/` with `ls`/`find`/glob pipelines to discover the next number. Folder scans miss plans in `Completed/` and other subdirectories, and disagree across branches. The folder scan is only used to bootstrap the counter when the git key is unset (which `mkplan.bash` and the daemon both handle).

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

## gh_pr_comments — always include --comments on gh pr view

`gh pr view` without `--comments` is blocked. PR comments often contain review feedback, reviewer requests, and decisions not in the PR body.

**Blocked**: `gh pr view 123`, `gh pr view 123 --repo owner/repo`

**Allowed**: `gh pr view 123 --comments`, `gh pr view 123 --json title,body,comments`

If using `--json`, include `comments` in the field list instead of adding `--comments`.

## plan_qa_commit_gate — cross-file plan checks at git commit

Every `git commit` is checked against the STAGED tree's plan QA
invariants. In `commit_gate_mode: warn` (the rollout default)
violations appear as advisory context — read them and amend the
commit content BEFORE committing; in `block` mode they deny the
commit with a TODO list of what the commit must also contain.

**The invariants**:

- creating a plan folder ⇒ the SAME commit stages its README
  index row (`index-at-birth`) and the number must come from the
  git counter / mkplan.bash (`counter-sanity`, `no-new-collisions`)
- flipping a plan to Complete/Cancelled/Superseded ⇒ the SAME
  commit contains the `git mv` into the archive dir AND the README
  row + statistics update (`terminal-state-atomic`)
- every folder has a README row in the section matching its
  location, and every row's link resolves
  (`row-folder-bijection`, `stats-recount`)
- a commit claiming `Plan NNNNN` that stages src/tests/config
  changes should also update that plan's PLAN.md
  (`same-commit-plan-doc`); reference plans as `Plan NNNNN:`
  (`plan-ref-format`)
- (advise-only, Plan 00163) a commit that changes a plan's PLAN.md
  tasks should stage a `JOURNAL/` entry recording what changed
  (`journal-entry-with-progress`); a terminal-status flip should
  stage a closing journal entry when
  `plan_workflow.qa.journal.enforce_on_completion` is on
  (`journal-completion-entry`)
- (advise-only, Plan 00190) a commit whose PLAN.md loses 2,000+
  bytes while staging NO journal entry is flagged
  (`plan-shrink-without-journal`): that shape usually means
  narrative was DELETED rather than relocated into `JOURNAL/`.
  If the content was genuinely obsolete this is fine as it stands
  — git keeps the history; the check exists so you notice which
  of the two you just did

Check the staged tree any time without committing:
`/workspace/.claude/hooks-daemon/bin/hooks-daemon plan-qa --check-staged`.
Commits inside nested/vendor repos or foreign worktrees are exempt.

## plan_qa_edit — PLAN.md writes are linted in real time

Every Write/Edit of a `PLAN.md` under the plan directory is checked
against the plan QA edit-stage rules on the content the file WOULD
have. Block-level violations (in `edit_mode: block`) deny the tool
call with the exact remediation; fix the content and retry.

**Rules that block new plan material**:

- a parseable `**Status**:` line must exist (`status-line-present`)
- the status token must be one of: Not Started, In Progress,
  Complete, Blocked, Cancelled, Superseded, Dormant
  (`status-enum-and-date`)
- the header must not contradict the body — do not leave
  `Not Started`/`In Progress` above an all-ticked task list or
  "ALL DONE" prose; flip the status instead
  (`header-body-coherence`)
- use the template task grammar `- [ ] ⬜ **Task N.N**:` — not
  ad-hoc markers like `[✓]`/`[⏳]` (`task-grammar`)
- a `PLAN.md` must stay under the size tiers (`plan-doc-size`):
  advisory above 18,000 bytes / 350 lines, escalated warning above
  25,000 / 500, and edits BLOCKED above 35,000 / 900. The two
  remedies are RELOCATE the narrative into this plan's `JOURNAL/`
  or SPLIT the plan — never delete content. Only an edit that
  GROWS the file can be blocked (shrinking is silent, same-size
  only advises), so an oversized plan can always be updated and
  refactored down; declare a genuine exception in the file with
  `<!-- MUST_EXCEED_PLAN_SIZE_BECAUSE: <reason> -->`. Journals and
  the plan-index README are exempt at any size.

**Advisory rules**: missing Created/Owner/Priority headers on new
plans; a terminal status set while the folder is still in the plan
root (the same commit must `git mv` it to the archive dir and
update the README row); edits to archived plans; backticked
`src/...` paths that no longer exist.

**Journal day-files** (`JOURNAL/NNNNN-Journal-YY-MM-DD.md`) are also
linted: the name must match the grammar and the enclosing plan
number (`journal-dayfile-naming`, ADVISE), and edits must APPEND —
never rewrite or remove earlier entries (`journal-append-only`,
ADVISE). Corrections are new dated entries at the bottom, not edits
to old ones.

**A Write/Edit to a journal day-file dated anything other than
TODAY is BLOCKED by default** (`journal-dayfile-is-today`) — this
includes yesterday's date. A session that spans midnight must start
TODAY's day-file, not keep appending to yesterday's; the block
message names the exact today-dated filename to write instead.
Controlled independently of the other journal checks via
`plan_workflow.qa.journal.today_only_mode` (advise | block | off;
default block).

A journal is **unbounded by design** — its length is never a problem
and it must not be tidied or trimmed. It is safe to grow forever
precisely because it is never read whole: grep it, `tail -n N` the
newest day-file directly, or send a sub-agent. `PLAN.md` is the
opposite — read in full every session, so keep it lean and curated,
with history in git rather than in the file body.

Grandfathered plans in `plan_workflow.qa.legacy_plan_allowlist`
only ever advise. Lint any file on demand:
`/workspace/.claude/hooks-daemon/bin/hooks-daemon plan-qa --lint <file>`.

## plan_workflow — PLAN.md and JOURNAL/ obey OPPOSITE contracts

Confusing these two is the single most common plan-hygiene failure: narrative gets appended to `PLAN.md` until it is tens of KB of stale log. Each file has a WRITE contract and a READ contract, and the read contract is what justifies the write contract.

|             | `PLAN.md`                                                                                | `JOURNAL/NNNNN-Journal-YY-MM-DD.md`                                                                  |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Write**   | Commit if dirty, EDIT IN PLACE, commit. Rewrite freely — git holds the history           | APPEND ONLY. Never edit or remove an earlier entry; corrections are new dated entries at the bottom  |
| **Content** | LEAN, surgical, always correct — current truth only: goals, decisions, task tree, status | What actually happened: dated progress, findings, incidents, hand-offs                               |
| **Read**    | Read IN FULL every session — it is your grounding                                        | NEVER read whole. `tail -n N` the newest day-file, grep it, or send a sub-agent for deep archaeology |
| **Size**    | Bounded — see tiers below                                                                | UNBOUNDED by design. Length is never a problem; never tidy or trim a journal                         |

**Why the asymmetry**: a plan is re-read in full at the start of every session that touches it, so every KB is a recurring context cost paid before any work starts. A journal is only ever sampled, so it is safe to grow forever.

**Size tiers on `PLAN.md`** (bytes OR lines, whichever trips first): advisory above 18,000 bytes / 350 lines; escalated warning above 25,000 / 500; edits BLOCKED above 35,000 / 900.

**When a plan gets too big there are exactly two remedies, and NEITHER is deletion**:

1. **Relocate** the narrative into this plan's `JOURNAL/` day-file.
2. **Split** the plan if the task tree itself is the bulk — an over-scoped plan is not fixed by better journalling.

**Only an edit that GROWS the file can be blocked.** Shrinking it is silent and a same-size edit (ticking a checkbox) only advises — so an oversized plan can always be updated and refactored down. If a plan genuinely warrants its size, record why in the file: `<!-- MUST_EXCEED_PLAN_SIZE_BECAUSE: <reason> -->`.

**Task status icons**: ⬜ not started, 🔄 in progress, ✅ complete. Include a Success Criteria section and break work into phases.

## agent_isolation_advisor — isolate concurrent agents

When more than one agent thread is live in this checkout, spawning another Agent without isolation is flagged (advisory, never blocked).

Agents in one working tree share a single `.git/index`, so a peer's bare `git commit` can silently absorb another agent's staged work.

**Prefer**: `isolation: "worktree"` on the Agent tool, then `git merge` or `git cherry-pick` to bring work back.

**Keep the shared tree** for agents that need the real project root — daemon restart verification and client-mode testing do not work in a worktree.

## article-snippet-enforcer — articles must use the snippet system

Writes to `src/data/articles.ts` that embed multi-line code directly inside `<pre><code>...</code></pre>` blocks are blocked. Articles must reference code via `{{SNIPPET:article-slug/filename.ext}}` placeholders.

**Workflow**:

1. Create the code file under `code-snippets/<article-slug>/`.
2. Reference it from the article: `<pre><code class="language-php">{{SNIPPET:article-slug/example.php}}</code></pre>`.
3. The build step (`scripts/generate-snippets.mjs`) auto-generates `src/data/snippets.ts` from those files.

Short inline references like `<code>exampleVar</code>` are allowed.

## background_process_tracker — backgrounded processes are tracked

A PostToolUse advisory that fires when a Bash call backgrounds a process (`run_in_background: true`, or a `&`/`nohup`/`setsid`/`disown` command). It records the command to `background-processes.jsonl` and injects rate-limited guidance.

**The daemon never kills.** It surfaces runaways; you decide.

When you background a long-lived process:

- Create a non-durable recurring **watchdog cron** (CronCreate, durable:false) whose prompt runs `/workspace/.claude/hooks-daemon/bin/hooks-daemon harvest-background` and acts on any runaway — this covers the idle/compaction window a tool-call hook cannot. Do NOT wait for the cron; keep working.
- Check on demand: run `harvest-background` (exit 1 == runaways surfaced).
- Reap a runaway by its **process group**: `kill -- -<pgid>` (not just the pid).
- Keep a wanted long task: note `KEEP_RUNNING_BECAUSE="reason"`.
- Delete the watchdog cron (CronDelete) when no backgrounded work remains.

Advisory is rate-limited per session (default-on). Disable with `handlers.post_tool_use.background_process_tracker.enabled: false`.

## git_hooks_executable_fixer — auto-fixes non-executable git hooks

When a git command prints `hint: The '...' hook was ignored because it's not set as executable`, this handler automatically `chmod +x`s every non-`.sample` file in the repository's hooks directory (resolved via `git rev-parse --git-path hooks`, so worktrees and `core.hooksPath` are handled). Execute bits are added with least privilege (only where read is already granted). It never blocks the command and reports which hooks it fixed via advisory context. `.sample` files and already-executable hooks are left untouched.

## markdown_table_formatter — markdown tables are auto-aligned

After every `Write` or `Edit` of a `.md` or `.markdown` file, the content is re-formatted via `mdformat + mdformat-gfm` so that table pipes are aligned and column widths are consistent. The handler is non-terminal and advisory — it never blocks, it just rewrites the file on disk.

**What changes:**

- Table pipes are aligned vertically and delimiter rows widened to match cell widths.
- Ordered lists keep consecutive numbering (`1.` `2.` `3.`).
- `---` thematic breaks are preserved (mdformat's 70-underscore default is post-processed back).
- Asterisks in table cells are escaped (`*` → `\*`) as required by GFM.

**Exempt:** anything under a plan's `JOURNAL/` directory is NEVER reformatted — day-files (`JOURNAL/NNNNN-Journal-YY-MM-DD.md`, Plan 00163) and any other file in there. A journal is an append-only, byte-stable log; rewriting it would trip the `journal-append-only` check. The exemption is by LOCATION as well as by filename, so a mis-named day-file is still safe.

**Ad-hoc formatting of existing files:**

```
/workspace/.claude/hooks-daemon/bin/hooks-daemon format-markdown <path>
```

## recovery_cron_advisor — failsafe recovery cron lifecycle advisory

An advisory PostToolUse handler that fires across a plan's lifecycle and
injects guidance telling the agent to manage a non-durable hourly failsafe
recovery cron.

### What it does

Three lifecycle phases are detected from Write/Edit to `CLAUDE/Plan/<digits>-<name>/PLAN.md`
(never from files inside `Completed/`) and from `mkplan.bash` Bash invocations:

| Phase          | Trigger                                               | Guidance injected                                                                                                                                                                                                                                         |
| -------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Creation**   | New PLAN.md written, or `mkplan.bash` invoked         | Create a non-durable hourly cron now (CronCreate, durable:false); record the ID in the plan's `JOURNAL/` day-file (NOT in PLAN.md); do NOT wait for the cron.                                                                                             |
| **Progress**   | Edit to PLAN.md touching task-status icons (⬜/🔄/✅) | Confirm the recovery cron is still running (CronList); recreate if missing; keep working.                                                                                                                                                                 |
| **Completion** | `**Status**: Complete[d]` written/edited              | Plan complete — **warns first**: deleting now leaves the still-live session with no recovery coverage. Keep the cron if any further work may happen (it is non-durable and dies on session exit); `CronDelete` only when certain the session is finished. |

Progress reminders are rate-limited per plan: the handler advises on the first
progress edit and then once every few progress edits for that plan, so it does
not spam context on every edit. Completion always advises (bypasses the interval).

### CRITICAL: recovery cron is NOT a heartbeat

The recovery cron is a **failsafe safety net**, not a pacing mechanism:

- The agent **must never** wait for the cron between units of work.
- Work proceeds at **full speed** until an external factor (Claude API error,
  rate limit, 5-hour usage limit, network failure) actually stalls it.
- The cron fires only while the REPL is idle; it cannot interrupt active work.
- Treating the cron as a heartbeat is an **own goal** — it would convert a
  safety net into an artificial hourly throttle.

### Canonical recovery-cron prompt

Use this verbatim as the CronCreate prompt:

```
**FAILSAFE RECOVERY CHECK (automated hourly safety net — NOT a heartbeat).**
If your most recent work on the active plan/task was interrupted by an
*external* factor (Claude API error/overload, rate limit, 5-hour usage limit,
network failure) and is now resumable, resume it immediately and carry it to
completion. If you are blocked **only** on human input, do nothing and keep
waiting. If work is already proceeding normally, this is a **no-op** — do not
interrupt, restart, or duplicate anything in flight. Never treat this as a
heartbeat or pacing signal: between checks, continue at full speed until an
external factor actually stops you — waiting for the cron is an own goal. Do
NOT delete this cron merely because a tick finds nothing to resume: it is
non-durable and ends automatically when the session exits, and a still-live
session stays exposed to the next rate limit without it. Remove it (CronDelete)
only once the session is genuinely finished with no further work.
```

### Configuration

This handler is **on by default** (opt-out). Disable with:

```yaml
handlers:
  post_tool_use:
    recovery_cron_advisor:
      enabled: false
```

## project_handler_load_checker — project protection degraded alert

At session start this handler reports any **project handlers** (`.claude/project-handlers/`) that FAILED to load in the running daemon. A skipped handler is a silently-disabled protection — the alert exists so you never assume a guardrail is active when it is not.

### When you see `🚨 PROJECT PROTECTION DEGRADED 🚨`

1. **Do not assume normal guardrails are in force.** The listed handlers are OFF for this session.
2. **Diagnose** each failure: `/workspace/.claude/hooks-daemon/bin/hooks-daemon validate-project-handlers` names the file, the missing method, and the daemon version that introduced it.
3. **Fix** the handler(s) — usually adding a required method stub (e.g. `get_claude_md`) that a daemon upgrade made mandatory.
4. **Restart the daemon** (`/workspace/.claude/hooks-daemon/bin/hooks-daemon restart`). The alert reflects the _running_ daemon, so it clears only after a restart reloads the fixed handlers — fixing the file alone is not enough.

The handler is silent when every project handler loads, so seeing this alert always means real action is required.

## hook_registration_checker — hooks configuration policy

On every new session this handler audits hook configuration across `.claude/settings.json` and `.claude/settings.local.json`. When it reports issues, fix them — do not ignore the warning.

### Policy

1. **All hooks live in `settings.json`.** That file is tracked in version control, visible to teammates, and is the single source of truth for the daemon.
2. **`settings.local.json` must contain ZERO `hooks` entries.** It exists for per-developer `permissions` and IDE state only. A `hooks` block there is either (a) invisible to the rest of the team, or (b) duplicated with `settings.json` — in which case the hook fires twice per event.
3. **Hook commands must invoke the daemon wrapper.** Every registered command must end with `/.claude/hooks/{event}`. Anything else (inline Python, custom shell scripts, bespoke paths) is a legacy setup that bypasses the daemon entirely.

### Remediation

- **Hooks in `settings.local.json`**: move each `hooks` entry to `settings.json`, then delete the `hooks` key from `settings.local.json`. Confirm no duplicates remain.
- **Legacy-style commands**: replace them with a project-level handler. Run `/workspace/.claude/hooks-daemon/bin/hooks-daemon init-project-handlers` to scaffold `.claude/project-handlers/`, port the logic into a handler class, then restore the daemon wrapper in `settings.json`. The daemon will auto-discover the new handler on restart.
- **Missing hooks**: by default this handler SELF-HEALS — it merges the full wired registration set into `settings.json` on session start (additive; preserves `permissions`/`env`/`statusLine` and any custom hooks; one-shot backup to `settings.json.bak.pre-registration-repair`), so the flood stops without a reinstall. Opt out with `handlers.session_start.hook_registration_checker.options.auto_repair_registrations: false`, then re-run the installer or add the missing `{event_name}` entry manually.
- **Duplicate hooks**: a hook registered in both files fires twice. Keep the `settings.json` entry and remove the duplicate in `settings.local.json`.

## git_upstream_checker — additive fetch + pull/cleanup advice on session start

On each new session the daemon runs an **additive** `git fetch --all` (never `--prune` — it never removes anything automatically) and then:

**If your branch is behind its upstream**, acts on the configured `mode`:

- `warn` (default): strongly advises you to run `git pull`.
- `agent-pull`: instructs you to run `git pull` as your first action.
- `auto-pull`: the daemon runs `git pull --ff-only` for you on a clean, non-diverged tree; if it cannot fast-forward (dirty tree or diverged history) it degrades to a warning and you pull manually.

**If the upstream was REWRITTEN**, every mode above is overridden and NO pull is advised in any wording. The signal is a divergence whose two sides share no commit shas yet resolve to the SAME tree: identical content, so there is nothing to merge and each local commit is a pre-rewrite duplicate. Pulling would merge the entire pre-rewrite history back in and republish whatever the rewrite (a `filter-repo` secret-strip, say) was run to remove. The advisory instead asks a human to realign the branch onto its upstream and to re-fetch tags with `--force`, since a rewrite moves every tag to a new sha. Do NOT work around this by pulling — if you believe the divergence is genuine, check the trees yourself before merging.

**If local branches track a remote branch that was deleted**, it lists them (marked merged = safe vs not-merged = has unique commits) and asks you to clean up AFTER checking: `git branch -d <name>` for merged branches, ask the human for the rest, and optionally `git fetch --prune` the stale remote-tracking refs. The daemon never prunes or deletes a branch itself; never use `git branch -D`.

It is silent when up to date with no gone branches, not in a git repo, on a detached HEAD, or without an upstream. Configure via `handlers.session_start.git_upstream_checker.options.mode`.

## plan_qa_sweep — plan-tree drift report at session start

At the start of each new session the plan directory is swept with the
plan QA check catalogue (index/folder bijection, number collisions,
statistics recount, archive structure, status-vs-location coherence,
staleness). Findings are injected once as advisory context — the
sweep never blocks.

**When a drift report appears**: fix the listed findings (each names
its exact remediation) as part of your plan housekeeping, then
re-check with:

```
/workspace/.claude/hooks-daemon/bin/hooks-daemon plan-qa --sweep
```

The CLI exits 1 while findings remain (CI-able). Single-file lint:
`plan-qa --lint <PLAN.md>`; staged-commit check: `plan-qa --check-staged`.
Policy lives under `plan_workflow.qa` in `.claude/hooks-daemon.yaml`
(archive dir names, staleness window, legacy/collision allowlists).

## ccy_supervisor_integrity — keep the ccy supervisor properly set up

At session start this handler checks a ccy project (`.claude/ccy/`) whose supervisor is **armed** (`ccy.env` exports `CCY_CLAUDE_WRAPPER` referencing `claude-supervise.py`). It warns — never blocks — when the setup is brick-risky:

- **`claude-supervise.py` missing** → the launcher's `exec` fails. Redeploy via a daemon upgrade or restore from git.
- **not executable** → `chmod +x .claude/ccy/claude-supervise.py`.
- **git-ignored** → it won't be committed; teammates get a broken supervisor. Add a `!claude-supervise.py` / `!ccy.env` whitelist line to `.claude/ccy/.gitignore` and commit the files.
- **`ccy.deploy_supervisor: false` while armed+present** → the installer skips deploy on `false`, so upgrades never refresh `claude-supervise.py` and the project runs an increasingly stale supervisor. Set it to `true` (or disarm `CCY_CLAUDE_WRAPPER` if you truly want it off).

It also detects a **stale running supervisor** (Plan 00164): when a daemon upgrade has put a NEWER `claude-supervise.py` on disk than the live process (compared by source fingerprint, not just version), it advises restarting ccy so the wrapper re-execs the updated supervisor. Nothing is broken meanwhile — the old supervisor keeps working until the session is relaunched.

When you see this alert, fix the listed item(s) and commit the ccy files so the supervisor works for everyone.

## plan_workflow_asset_checker — plan tooling provisioning alert

At session start, when the plan workflow is enabled but the daemon-owned `mkplan.bash` is missing from the plan directory, this advisory fires (it never blocks). A missing `mkplan.bash` means `CLAUDE.md` and `plan_number_helper` reference a scaffolder that does not exist and journalling is inert.

**Fix**: (re)deploy the assets on demand —

```
/workspace/.claude/hooks-daemon/bin/hooks-daemon deploy-plan-workflow
```

The deploy is idempotent (fills gaps only, never overwrites client-owned files). Silent when `mkplan.bash` is present or the workflow is disabled.

## ts-qa-ci

This project uses `ts-qa-ci` for QA/CI. Run `npx ts-qa` for the full pipeline, or `npx ts-qa -t <tool>` to run a single tool. See `node_modules/@longtermsupport/ts-qa-ci/docs/` for the full docs set.

## idle_housekeeping_advisory — report-first idle housekeeping (beta, opt-in)

When the session is idle and caught up (repeated no-op failsafe-recovery ticks), this advisory suggests a bounded HOUSEKEEPING MODE: dispatch specialist housekeeping sub-agents that run read-only audits and write shareable **markdown report files** (default `untracked/reports/`). It is REPORT-ONLY — never auto-fix or auto-commit — and strictly lower priority than real work (a real user prompt aborts it). Off by default; enable via `handlers.user_prompt_submit.idle_housekeeping_advisory.enabled: true`. A project can point it at its own doc via the `custom_guidance_doc` option (`custom_guidance_mode: additive` appends it to the default, `replace` uses only the project doc). See docs/guides/CREATING_REPORTS.md.

## auto_approve_reads — gated on bypassPermissions mode

Read-only tool permission requests (`Read`, `Glob`, `Grep`) are auto-approved **only** when Claude Code reports `permission_mode == "bypassPermissions"` (YOLO mode).

In every other mode (`default`, `plan`, `acceptEdits`, `dontAsk`) the handler defers and Claude Code's normal approval prompt is shown — the user has not opted out of per-tool approvals, so the daemon must not silently approve on their behalf.

If a permission prompt for `Read` appears in `default` mode, that is correct behaviour — approve it via Claude Code's UI.

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
- Smuggle a rhetorical continue question inside a `STOPPING BECAUSE:` message ('STOPPING BECAUSE: slice 1 done. Want me to build slice 2?') — this is HARD-BLOCKED; the prefix does not exempt tautological questions. Just continue with the next unit of work
- Use `AUTO-CONTINUE` unless you intend to keep working indefinitely

**Before asking a question, evaluate it critically**:

- Tautological/rhetorical questions with obvious answers ("Should I continue?", "Would you like me to proceed?") — do NOT ask, just do it
- Errors with a clear next step ("The test failed, should I fix it?") — do NOT ask, just fix it
- Genuine choice questions where all options are valid ("Which of A, B, or C should we use?") — these deserve a response. Use `STOPPING BECAUSE: need user input` and ask your question

**Recovering from a `tool_use_error` — do NOT stop silently**:

Some tool errors require an explicit recovery action, not a halt. The most common shape:

- You call `Edit` or `Write` on a file you have not yet read.
- Claude Code returns a `tool_use_error` (e.g. "File has not been read yet").
- The correct recovery is **Read the file, then retry Edit/Write** — **do not stop**. Stopping silently after a tool error triggers a Stop-hook re-entry loop and wastes a turn.

**Rule: Read before Edit/Write.** If you must edit a file you have not read, Read it first in the same turn. The daemon's Stop handler will detect a `tool_use_error` followed by a silent stop and re-fire to force recovery.

**On Stop hook re-entry (the hook fires again after a prior block)**: your next response is treated like any other — it must either prefix with `STOPPING BECAUSE:` or continue the work. Re-entry does not exempt you from the explanation rule.

## dismissive_language_detector — do not deflect or prematurely halt

Stop-time advisory that fires on language patterns signalling avoidance of work. The handler does NOT block the stop, but injects context for the next turn so the agent self-corrects. Identical advisories (same session, same phrase set) are emitted once, not repeated on every subsequent stop.

**Avoid**:

- Dismissing issues as `pre-existing`, `out of scope`, `not our problem`, or `not relevant` to deflect work that is in fact yours.
- Premature-halt phrasing like `natural checkpoint`, `ready to continue on your   cue`, `pausing here` mid-plan when there is more to do — finish the task rather than dressing up a halt.
- Speculative `should be fine` or `probably works` when verification is cheap (run the test, read the file).

**Do**: acknowledge the issue, fix it, or — if it genuinely is out of scope — say so once with the specific reason and continue with the in-scope work.

## worktree_create — semantic worktree naming

When Claude Code creates a worktree (an `isolation: "worktree"` agent or `--worktree` session), the daemon creates it at a human-friendly path `.claude/worktrees/<slug-of-name>-<shorthash>/` and echoes that path. Name an agent semantically (the Agent tool's `name:`) to get a readable worktree directory (e.g. `refactor-auth-4f2a1c9b`) instead of an opaque `wf_<hash>`. The short hash suffix keeps identically-named agents from colliding.

</hooksdaemon>
