# Publishing conventions — everything the writer needs about this site

This file exists so a writing agent that reads **only this plan folder** can
produce a publish-ready article without opening any other document. It
distils the site's own rules (root `CLAUDE.md` → "Adding New Articles",
`CONTRIBUTING-PROJECTS.md`, `src/types/article.ts`, the
`technical-article-writer` / `article-reviewer` / `content-editor` agents and
the `voice-check` skill) into one place.

Where a rule here disagrees with something you remember about the site, this
file plus the repo's own `CLAUDE.md` win — never invent a convention.

---

## 1. Where the output goes

| Artefact       | Path                                                                         | Notes                                                         |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Article object | `src/data/articles.ts`                                                       | One TypeScript object in the `SAMPLE_ARTICLES` array          |
| Code snippets  | `code-snippets/host-action-bridge/<file>.<ext>`                              | Raw code, one file per code block, no HTML escaping           |
| Diagram assets | `public/images/host-action-bridge/<name>.svg`                                | Static, committed; served from `/images/host-action-bridge/…` |
| Diagram source | `CLAUDE/Plan/00013-host-action-bridge-article/reference/diagrams/<name>.mmd` | Mermaid source kept for re-rendering                          |
| Rendered page  | `dist/articles/host-action-bridge/index.html`                                | Build output — read it to verify, never edit it               |
| Public URL     | `/articles/host-action-bridge`                                               | Derived from the object's `id`                                |

There are no markdown article files, no EJS templates, and no YAML
front-matter anywhere in this system. The "front matter" is the TypeScript
object's fields, described next.

**Ordering**: articles are newest-first. A new article goes at the **top** of
`SAMPLE_ARTICLES`. This article is already the first entry — the Phase 3
rewrite replaces its `content` field in place and leaves its position alone.

---

## 2. The article object schema (the site's "front matter")

The interface is `Article` in `src/types/article.ts`. Field by field:

| Field         | Type                     | Required | Rule                                                                   |
| ------------- | ------------------------ | -------- | ---------------------------------------------------------------------- |
| `id`          | `string`                 | yes      | URL slug, kebab-case, must match the `code-snippets/<slug>/` directory |
| `title`       | `string`                 | yes      | Sentence-style title case; a colon is fine, an em dash is not          |
| `description` | `string`                 | yes      | SEO meta description and listing excerpt; one or two sentences         |
| `date`        | `string`                 | yes      | ISO 8601 `YYYY-MM-DD`                                                  |
| `category`    | `CategoryId`             | yes      | `CATEGORIES.<key>.id` — see the category list below                    |
| `readingTime` | `number`                 | yes      | Whole minutes, estimated at roughly 220 words per minute               |
| `author`      | `string`                 | yes here | Always `'Joseph Edmonds'` on this site                                 |
| `tags`        | `readonly string[]`      | yes here | Present on every article; every current article ships `[]`             |
| `subreddit`   | `string`                 | yes here | Target subreddit for social sharing, e.g. `'devops'`, `'PHP'`          |
| `register`    | `'formal'`               | yes      | **Required on all new articles.** Only `'formal'` exists today         |
| `content`     | `string` (template lit.) | yes      | The article HTML — see section 3                                       |

Categories available (`src/data/categories.ts`): `CATEGORIES.php.id`,
`CATEGORIES.infrastructure.id`, `CATEGORIES.database.id`, `CATEGORIES.ai.id`,
`CATEGORIES.typescript.id`, `CATEGORIES.qa.id`.

### The exact values for this article

Keep these as-is. `id` and `date` in particular must not change — the URL is
already published and the site generates a sitemap and feed from these.

```typescript
{
  id: 'host-action-bridge',
  title: 'The Host-Action Bridge: Letting a Sandboxed Agent Control Containers It Cannot Reach',
  description:
    'A pattern for letting a runtime-less AI coding agent container start, stop, and rebuild containers on its host, without a container socket, SSH access, or ad-hoc firewall holes.',
  date: '2026-08-27',
  category: CATEGORIES.infrastructure.id,
  readingTime: 13,
  author: 'Joseph Edmonds',
  tags: [],
  subreddit: 'devops',
  register: 'formal',
  content: `…`,
},
```

`readingTime` is the one metadata field the rewrite should revisit: the
Phase 3 target is 2,200–2,800 words, so 11 becomes roughly 12–13. Recount
from the finished draft rather than guessing.

**Description length**: aim for 150–170 characters so search engines show it
whole. The current description is longer than that and is worth tightening
during the rewrite, provided it keeps naming the three rejected alternatives
— that specificity is what makes it click-worthy.

---

## 3. Content HTML structure

`content` is a JavaScript **template literal** holding raw HTML. It is
injected directly into the page; there is no markdown step and no sanitiser.

### The required skeleton

```html
<div class="intro">
  <p class="lead">
    Opening lead paragraph. Two to four sentences that state the tension the article resolves.
  </p>
</div>

<section>
  <h2>Section Title</h2>
  <p>Prose…</p>
  <h3>Sub-section Title</h3>
  <p>Prose…</p>
  <pre><code class="language-bash">{{SNIPPET:host-action-bridge/watcher-loop.sh}}</code></pre>
</section>

<section>
  <h2>Next Section</h2>
  …
</section>
```

Rules:

- **No `<h1>`.** The page renders the `title` field as the `h1`.
- Every top-level part of the article is a `<section>` opening with `<h2>`.
  `<h3>` for sub-sections inside one. Do not skip levels.
- The `div.intro` / `p.lead` block appears exactly once, at the very top,
  outside any `<section>`.
- Four-space indentation inside `<section>` matches every existing article.
- Short inline code is `<code>like this</code>` and is allowed anywhere in
  prose. Multi-line code is never inline — see section 4.
- Lists (`<ul>`/`<ol>`) are fine, but prose is the default explanatory mode.
  A bullet wall where two sentences would do is an AI tell (section 6).

### Template-literal escaping (prose only)

- Double every backslash in prose: `App\Service` → `App\\Service`.
- Never use a backtick or `${` in prose — both break the template literal.
- Code inside snippet files needs **no** escaping; the build escapes it.

### Links

- Internal: `<a href="/articles/other-slug">Descriptive title</a>` — no
  `target`, no `rel`.
- External: `<a href="https://example.com" target="_blank" rel="noopener">…</a>`
  — both attributes, always.
- Link to primary sources (official docs, project repositories), not to
  third-party summaries or blog aggregations.
- Relevant existing articles to link to from this piece, at most two, only
  where the sentence genuinely wants them:
  - `/articles/systemd-timers-modern-cron` — when the `.path`/`.service`
    systemd user-unit machinery is introduced.
  - `/articles/claude-code-hooks-subagent-control` — when the point is made
    that constraining an agent is a policy problem, not a prompt problem.
  - `/articles/fedora-desktop-automation-ansible` — if the provisioned
    host-desktop context is mentioned at all.

---

## 4. Code blocks: the snippet system is mandatory

**Never** embed a multi-line code block directly in `content`. A pre-tool
hook (`article-snippet-enforcer`) blocks writes to `src/data/articles.ts`
that contain inline multi-line code inside `<pre><code>`.

The workflow:

1. Write the raw code to `code-snippets/host-action-bridge/<name>.<ext>`.
   Raw, unescaped, exactly as it should appear.
2. Reference it from the article:
   `<pre><code class="language-bash">{{SNIPPET:host-action-bridge/<name>.<ext>}}</code></pre>`
   The path is relative to `code-snippets/`.
3. `npm run build` runs `scripts/generate-snippets.mjs`, which HTML-escapes
   every snippet file into `src/data/snippets.ts` and substitutes it in.

Supported language classes: `language-php`, `language-typescript`,
`language-javascript`, `language-bash`, `language-sql`, `language-yaml`,
`language-json`, `language-nginx`. Highlight.js styles them at render time,
so an unsupported or missing class silently degrades to unhighlighted text —
always set one, and set the right one.

### The snippet set for this article

`snippets.md` in this pack carries seven excerpts, already sanitised. Four
are committed today; the Phase 3 rewrite should carry across the ones the
finished draft actually uses, and delete any it does not. Suggested mapping:

| Pack excerpt                          | Snippet file                   | Language class        |
| ------------------------------------- | ------------------------------ | --------------------- |
| 1. Verb allowlist / fixed-argv table  | `verb-allowlist.yaml` or `.sh` | `yaml` / `bash`       |
| 2. Request writer (agent side)        | `request-writer.sh`            | `bash`                |
| 3. Watcher validate step              | `watcher-loop.sh`              | `bash`                |
| 4. systemd `.path` / `.service` units | `bridge-units.ini`             | `bash` (no ini class) |
| 5. `policy.conf` sample               | `policy.conf`                  | `bash`                |
| 6. Atomic publish helper              | `atomic-publish.sh`            | `bash`                |
| 7. Per-project namespacing            | `namespacing.sh`               | `bash`                |

Plus the two illustrative data files already in place:
`request-spool-entry.json` and `audit-log-entry.json` (`language-json`).

Six to eight code blocks is the right density for a 2,500-word piece. Every
one must earn its place by showing something the prose cannot state as
economically.

**Code comments inside snippet files are reviewed prose.** They obey the same
register rules as the article body: no em dashes, no contractions, no first
person, no "note that" / "simply" / "keep in mind", and they state _why_
rather than _what_.

---

## 5. Diagrams

**The renderer has no Mermaid support.** `ArticleContent` injects the
`content` HTML directly and Highlight.js only styles code blocks. A mermaid
fence in an article prints as raw text to the reader. Never put one in
`content`.

Mermaid **inside this reference pack is fine and encouraged** — it is read by
you, not by a site visitor. `architecture.md` holds three: a component
flowchart, a request-lifecycle sequence diagram, and a state machine.

For the published article, the rule is **render once at authoring time,
commit the SVG**:

- `public/images/host-action-bridge/architecture.svg` is already rendered and
  committed, from `reference/diagrams/architecture.mmd`. Use it. Reference it
  as a plain image, **not** through the `{{SNIPPET:…}}` system (that escapes
  content into a `<pre><code>` block, which is wrong for an image):

```html
<figure class="my-8">
  <img
    src="/images/host-action-bridge/architecture.svg"
    alt="Component diagram: the agent container writes a request into a spool inside the shared bind mount, a systemd path unit on the host triggers a watcher, and the watcher runs a fixed command against the application containers."
  />
  <figcaption>
    The bridge in one picture: the agent writes files, the host decides what runs.
  </figcaption>
</figure>
```

- The sequence and state-machine diagrams do **not** need a published
  equivalent. Both read well as numbered prose walk-throughs, and
  CONTRIBUTING's bar is that a diagram must earn its place. Prefer an ordered
  list of lifecycle steps over a second image.
- If a further diagram genuinely earns its place, write the `.mmd` into
  `reference/diagrams/`, render it with the recipe in `CONTRIBUTING-PROJECTS.md`
  (`@mermaid-js/mermaid-cli` with the no-sandbox puppeteer config and the
  site-palette theme file), and commit both source and SVG.
- `alt` text describes what the diagram _shows_, in a full sentence.
  `figcaption` is one line and adds meaning rather than repeating the alt.

---

## 6. Voice, register, and tone

`register: 'formal'` is a machine-readable contract that the
`article-reviewer` agent and `content-editor` agent both read. It means:

- **No contractions.** "does not", never "doesn't".
- **No first person.** No "I", "we", "my", "our" — not in the prose, not in
  code comments. State findings as fact: "A container engine socket is root
  on the host, wearing a thin disguise."
- **Third-person authoritative, active voice.** Direct assertions, no
  hedging ("arguably", "it could be said that", "one might consider").
- **British English throughout**: sanitise, organise, behaviour, colour,
  analyse, recognise, centre, licence (noun). Never American spellings.
  Exception: never "correct" spelling inside code, config keys, CSS class
  names, or tool flags.
- **Dates in prose**: `27 August 2026`. Numbers: full stop for decimals,
  comma for thousands.

Beyond register, this site has a specific voice. The traits worth actively
reaching for:

- Longer, comma-linked, loosely-built sentences carrying an argument
  through, rather than a wall of short punchy fragments. Vary the rhythm;
  uniform sentence length across a paragraph is itself a tell.
- Opinions stated plainly once earned. This is a portfolio, not a neutral
  encyclopedia entry — "the wrong bridge quietly undoes the sandbox it was
  supposed to protect" is the right level of conviction.
- Concrete over abstract. Every claim traces to a specific mechanism or a
  specific failure that a reader can picture.

### Banned outright

- **Corporate buzzwords**: leverage, seamless, robust, streamline,
  cutting-edge, unlock, elevate, best-in-class, synergy, holistic,
  world-class, innovative, state-of-the-art, revolutionise, game-changing,
  empower, "comprehensive solution", "dedicated to", "passionate about".
- **Connective throat-clearing**: "Moreover", "Furthermore", "In essence",
  "It is worth noting that", "That said", "At the end of the day".
- **Decorative "X, not Y." contrastive clauses** used for cadence rather
  than to correct a real misconception. One load-bearing contrast in a piece
  is fine; a sprinkle of them is the strongest AI tell there is.
- **Decorative rule-of-three enumeration** — three items listed for rhythm
  when there are not genuinely three things worth naming.
- **Em dashes as heading separators** (`Title — Subtitle`). Use a colon.
  Em dashes in prose are permitted where a real pause is intended, but
  sparingly; a comma or a full stop is usually better.
- **Fourth-wall breaks**: "you asked", "as requested", "I propose", "here is
  what I would add", "building on what you said", or any section framed as a
  reply rather than as a standalone topic. The article is a published piece
  for any developer on the internet.
- **Fabricated metrics or case studies.** No invented percentages, no
  invented benchmarks, no "we cut deploy times by 40%". Every number must be
  real and traceable, or absent. This is the site's No Bullshit rule and it
  is absolute.
- **Sentences over 35 words**, and paragraphs over about six sentences.
- **Heavy tables or bullet walls as the default explanatory mode.** Tables
  are for genuinely tabular data.

### Audience

Assume a technically strong reader who already knows containers, systemd,
bind mounts, and why sandboxing matters. Do not explain what a container is.
Spend the words on the trust-model reasoning, the failure modes, and the
transferable principle.

---

## 7. Content policy constraints

- **SITE-TRUTH rule**: `SITE-TRUTH.md` is the single source of truth for all
  page copy. Article bodies are technical writing and exempt — but any claim
  the article makes _about Joseph himself_ (experience, clients, services,
  availability) must be traceable to that document. The simplest compliance
  strategy for this article: make no claims about him at all.
- **No Bullshit rule**: factual and verifiable only. Generic and theoretical
  examples are welcome; fictional real-world implementations presented as
  real are not.

---

## 8. Public-repo hygiene (the rule that overrides everything)

This repository is public. `CONTRIBUTING-PROJECTS.md` states the boundary:
nothing crossing into this repo may carry real hostnames, IP addresses,
ports, file paths, repository names, container/service/user names, client
names, customer names, or employer names from the donating private project.

Two named exceptions are public and fair to name: **`ccy` / claude-yolo**,
and **`LongTermSupport/fedora-desktop`** on GitHub. Nothing else about the
originating project's identity, stack, or deployment may appear.

Everything in this reference pack is already sanitised to a single
placeholder set. **Use it exactly; never introduce a second set.**

| Concept              | Placeholder                                |
| -------------------- | ------------------------------------------ |
| Project slug         | `demo-app`                                 |
| Containers           | `demoapp_web`, `demoapp_api`, `demoapp_db` |
| Services             | `web`, `api`, `worker`, `cache`, `db`      |
| Host user            | `dev`                                      |
| Repo path            | `~/Projects/demo-app`                      |
| Orchestration script | `./stack.bash`                             |
| Container network    | `demo-app-network`                         |
| Ports                | `9100`, `9101`                             |

Do not "restore" plausible-looking real names when adapting snippets, and do
not invent a new project name because `demo-app` reads as generic. Generic is
the point.

---

## 9. The QA gates, in order

Run these top to bottom. Do not proceed past a failing gate.

1. **Snippet files first.** Create or update everything under
   `code-snippets/host-action-bridge/` before touching `src/data/articles.ts`,
   otherwise the build fails on an unresolved `{{SNIPPET:…}}` placeholder.
2. **Build**: `npm run build`. This chains snippet generation, `tsc`, the
   Vite client and SSR builds, prerendering, sitemap, and feed generation.
3. **Verify the rendered output**: read
   `dist/articles/host-action-bridge/index.html` and confirm — the article
   renders, every code block is present and highlighted, the diagram image
   loads from `/images/host-action-bridge/architecture.svg`, and there is
   **no leftover `{{SNIPPET:`** anywhere in the file.
4. **Voice and humanisation pass**: run the `voice-check` skill against
   `src/data/articles.ts` naming this slug (it is out of scope by default and
   must be named explicitly), and/or the `content-editor` agent. Apply the
   proposals that hold up; this step exists to strip AI tells before a
   structural reviewer sees them.
5. **Editorial review (MANDATORY)**: run the `article-reviewer` agent —
   `Agent(article-reviewer): review article 'host-action-bridge' before publication`.
   It reads the `register` field, the whole `content` literal, and every file
   under `code-snippets/host-action-bridge/`. Fix **all** CRITICAL findings;
   resolve or consciously accept MODERATE ones. Do not commit until the
   verdict is **READY TO PUBLISH**.
6. **Repo QA**: `npm run type-check`, `npm run lint`, `npm run test:run`, and
   `npm run format` (Prettier, 100-column, single quotes, ES5 trailing
   commas — `src/data/articles.ts` is formatted, so an unformatted edit will
   show up in `format:check`).
7. **Link check**: open every external link and confirm it resolves and
   points at a primary source. There is no link-checker script in
   `scripts/` today — `docs/qa-link-checking.md` describes one as a planned
   addition, so this gate is manual. Known false positives (Wikipedia, some
   CloudFlare-fronted pages) return 403 to automated requests but are fine
   for readers, which is one reason the manual pass is the reliable one.
8. **Public-repo hygiene sweep**: grep the article, the snippet files, and
   the diagram SVG for anything outside the placeholder table in section 8.
   A cold re-read by a fresh pass is the last gate — nothing in the piece may
   identify the private project it came from.
9. **Commit**: stage `src/data/articles.ts`, `code-snippets/host-action-bridge/`,
   `public/images/host-action-bridge/`, and this plan folder together.
