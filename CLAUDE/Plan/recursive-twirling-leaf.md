# ltscommerce.dev — action the change-requests brief

**Status**: 🔄 In Progress — Phases 1–4 (Tasks 1.1–4.8) executed and re-verified after the VAT/Footer/Privacy edits (`npx ts-qa` fully clean across all 10 checks: oxlint, prettier, eslintFix, eslintReport, remarkValidateLinks, knip, tsc, dependencyCruiser, vitest, playwright — 5/5 e2e tests pass). VAT status resolved and applied to Footer/Privacy. Testimonials closed (declined). GitHub profile name/bio updated live via API (Task 5.2); repo pinning confirmed API-impossible, left for Joseph to do manually. Added `.claude/ccy/Dockerfile` to bake the Playwright chromium browser into the ccy container image so it persists across sessions instead of reinstalling each time. LinkedIn (Task 5.1) still open — which profile is primary is Joseph's call. Not committed or deployed — awaiting instruction.

## Context

`/workspace/untracked/change-requests-v2.md` is a self-contained audit of the live
`ltscommerce.dev` site. It lists ~30 defects/gaps across content accuracy, the open-source
portfolio page, site positioning, conversion, and legal/trust compliance, plus a hard editorial
constraint (§0): never name a client, never publish a client's revenue/turnover/headcount, no
testimonials from current engagements, former-client testimonials only with explicit permission.

This is the sole source document for this plan — every item below traces to a section of that
file, and nothing from any earlier/superseded draft is carried forward.

Three research agents plus a direct real-browser check de-risked execution before this plan was
finalized. Two decisions were gated on Joseph and are now resolved:

- **Positioning (§4.1): agentic governance-first**, PHP moved to a service-page framing rather
  than the hero.
- **Years of experience (§2.2): 20+** (already the majority figure in this codebase — used
  twice in Contact.tsx and in About's own meta description — and loosely corroborated by Packt's
  official author bio).

---

## Research findings (verified facts to build from)

**Book credit (§2.3) — RESOLVED, sole-authored.** Packt's own product page (reached directly via
a real browser — scripted `curl`/`WebFetch` get WAF-blocked with a 403, confirmed independently
by two different methods) shows **only Joseph Edmonds** in both the pricing byline and the "About
the author" section (singular). No co-author or foreword contributor is credited anywhere on
Packt's own page. Fix: remove "Co-authored" from Home.tsx's book section.

**Packt link (§2.4) — RESOLVED, works fine.** The 403s were WAF bot-blocking, not a dead page —
a real browser redirects cleanly to `https://www.packtpub.com/en-us/product/the-art-of-modern-php-8-9781800566156`.
Optionally update the site's link to that canonical URL to skip the redirect hop (cosmetic, low
priority).

**Company details (§7.2) — mostly resolved.** UK Companies House: **Long Term Support Ltd**
(legal name has spaces — distinct from the "LongTermSupport"/"LTS" brand styling used for the
GitHub org and domain), company number **13027963**, status **Active**, incorporated **18 Nov
2020**, registered office Baildon, Shipley, BD17 5JB. Independently corroborated by Packt's own
author bio, which states Joseph "started... LTS (Long Term Support Ltd.)" in 2020 — matches the
incorporation date exactly. **VAT registration status is not on this register at all** (that's
HMRC data, not Companies House) — genuinely unresolvable without Joseph. Recommend displaying the
legally-exact name + number in the footer for compliance purposes; flagged for his sign-off since
it's his company's legal identity being published.

**Open-source portfolio data (§3) — verified, with three corrections to the brief:**

| Project                                | Correction / verified data                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claude-code-hooks-daemon`             | **Lives at `github.com/Edmonds-Commerce-Limited/claude-code-hooks-daemon`, not `LongTermSupport`.** 2 stars, MIT, 122 releases (confirmed twice — local checkout + live GitHub releases page), latest `v3.52.0` "Defence Before Fix" (published today), ~66.5k source lines / ~155k test lines (test tree ~2.3x source), 107 handler files.                                  |
| CCY                                    | Lives inside `github.com/LongTermSupport/fedora-desktop` (6★) — confirmed via direct quote from `docs/ccy.md`: _"CCY — Claude Code YOLO. `ccy` runs Claude Code inside a disposable, rootless Podman container..."_                                                                                                                                                          |
| `edmondscommerce/phpqa`                | 22,918 lifetime installs (matches brief exactly), **63/month**, 5★                                                                                                                                                                                                                                                                                                           |
| `lts/php-qa-ci`                        | 6,744 lifetime, **807/month** — the strongest current monthly-rate story of any package, lead with this one                                                                                                                                                                                                                                                                  |
| `edmondscommerce/typesafe-functions`   | 16,528 lifetime, 68/month                                                                                                                                                                                                                                                                                                                                                    |
| `edmondscommerce/doctrine-static-meta` | 3,449 lifetime, 8/month — **flagged `abandoned: true` on Packagist and archived on GitHub.** Present honestly as legacy, not active.                                                                                                                                                                                                                                         |
| `edmondscommerce/mock-server`          | 2,782 lifetime, **0/month** — no current-usage story to tell; use lifetime-total framing only, not "still being pulled" language                                                                                                                                                                                                                                             |
| `actions-hub`                          | **Currently a private repo** — cannot be linked from a public page. Default: omit from `/open-source` for now, note to Joseph that making it public is a prerequisite if he wants it featured. Not blocking.                                                                                                                                                                 |
| `llm-friendly-qa-wrappers`             | Public, 0★, created Feb 2026                                                                                                                                                                                                                                                                                                                                                 |
| Behat/Selenium archive                 | **18 repos, all under `github.com/edmondscommerce`** (none under `LongTermSupport`). Earliest is `selenium-server` (2015-02-11) — a near-exact match for "February 2015." `behat-framework` itself was created Jan 2016 — anchor the "eleven years" claim on the archive/lineage broadly (via `selenium-server`), not on `behat-framework`'s own creation date specifically. |

**Site internals (worker/RSS/footer/legacy dir) — see "Mechanism notes" below.**

---

## Mechanism notes (how, not just what)

- **`/author.html` → `/about` redirect and HSTS**: both are code changes in
  `cloudflare-workers/lts-site-proxy/worker.ts`, not Cloudflare-dashboard settings. The worker
  already 301s `*.html` → clean-URL generically (add a specific rule before that generic strip)
  and already sets a `SECURITY_HEADERS` const applied to every response (add
  `Strict-Transport-Security` there). **This worker is not deployed by CI** — deploy is manual
  (`cd cloudflare-workers/lts-site-proxy && npm run build && npm run deploy`, needs
  `CLOUDFLARE_API_TOKEN`) and pushes to production immediately. Edit + local build to verify
  compilation; **hold the actual `npm run deploy` for explicit confirmation** rather than
  fire-and-forget. CSP is deliberately **not** part of this pass — getting it wrong can break the
  live site (fonts/scripts/styles), and it needs a proper resource-origin audit first; flagged as
  a separate follow-up, not bundled into this plan blind.
- **RSS/Atom feed**: new `scripts/generate-feed.mjs`, following `scripts/generate-sitemap.mjs`'s
  exact pattern (imports built `dist-server/entry-server.js`, calls `getAllArticles()`, writes
  straight into `dist/`). Append as the new last step of `package.json`'s `build` script. Add
  `<link rel="alternate" type="application/rss+xml" href="/feed.xml">` to root `index.html`
  `<head>` (prerender clones this template per-route, so it lands on every page).
- **Footer/company details/privacy link**: `src/components/layout/Footer.tsx` copyright bar is
  the insertion point. `src/routes.ts` needs a new `privacy` route entry; register it in
  `src/App.tsx`.
- **Category landing pages**: `getCategoryRoute()` already exists in `routes.ts` but nothing
  serves `/articles/category/:id` yet. Reuse `ArticleList.tsx` (add a route
  `/articles/category/:categoryId`, read it via `useParams`, pre-filter + adjust page
  title/description) rather than building a new page component from scratch.
- **Cross-linking articles → services**: add one shared "what to read next" component rendered
  by `ArticleDetail.tsx` after the article content, keyed off category → relevant
  service/contact/open-source link. Avoids hand-editing 44 entries in `articles.ts`.
- **`public_html/`**: confirmed dead — gitignored, untracked since 2025-07-18, unreferenced by
  `vite.config.ts`/`package.json`/CI, and proven-stale by its own `.vite/manifest.json`
  (references `private_html/` sources that only exist in `ARCHIVE/`, the old pre-React build).
  Safe to delete; it's already outside git entirely. Root `README.md` still documents that old
  EJS/`public_html` architecture — refresh it to match `CLAUDE.md`'s v4.0 description while in
  there.
- **`security.txt`**: `public/.well-known/security.txt` — Vite copies `public/` verbatim into
  `dist/`, so this just works. Use `hello@ltscommerce.dev` as contact, set a 1-year `Expires`.

---

## Execution plan

### Phase 0 — durable tracking

`mkplan.bash` deployment was attempted and reported "Plan workflow disabled in config" — the
project has this automated numbered-plan tooling switched off. Not forcing it; using the
harness's own TaskCreate/TaskUpdate list for session progress tracking instead, and keeping this
file as the source-of-truth planning record.

**Correction post-approval**: Joseph flagged there are actually **two** companies, not one.
Companies House confirms **LTS Commerce Ltd** (16618262, incorporated 31 Jul 2025, SIC 62090
"Other IT service activities") is a 75%+-owned subsidiary of **Long Term Support Ltd** (13027963,
SIC 68209 "real estate letting" — the holding company). Same director (Joseph Frederick Edmonds),
same registered office (37 Milner Road, Baildon, Shipley, BD17 5JB). The footer already reads
"LTS Commerce Ltd" today, and the matching IT-services SIC code confirms that's the right trading
entity for _this_ site — proceeding with **LTS Commerce Ltd, company no. 16618262** in the footer
rather than the parent. VAT status remains unknown for either entity.

### Phase 1 — defects (small, independent, no blockers)

- [x] ✅ **Task 1.1**: `/author.html` → `/about` 301 in `worker.ts` — done, local build verified (redirect + HSTS both compile into `worker.js`); deploy still held for confirmation
- [x] ✅ **Task 1.2**: Book credit fixed — "Co-authored" removed from Home.tsx, Packt link updated to canonical `/en-us/` URL
- [x] ✅ **Task 1.3**: Years consistency — repo-wide grep found 5 instances, not 2 (also `Hero.tsx`'s hardcoded credentials-bar stat, two `entry-server.tsx` SSR meta-description fallbacks, and `Footer.tsx`'s tagline). All fixed to 20+; verified zero "18+" remain (excluding unrelated "React 18" version refs)
- [x] ✅ **Task 1.4**: HSTS header added to `worker.ts` `SECURITY_HEADERS`, verified in build output; deploy held
- [x] ✅ **Task 1.5**: `public_html/` deleted (confirmed untracked+gitignored first); root `README.md` fully rewritten for the v4.0 React/Vite architecture

### Phase 2 — highest-value content (no blockers)

- [x] ✅ **Task 2.1**: `/open-source` populated — 10 full project entries + 24-repo archive list,
      three-layer `ProjectLayer` grouping added to the data model, `ProjectList.tsx` restructured
      into Containment/Policy/Gates/Supporting/Archive sections. `doctrine-static-meta` marked
      archived, `mock-server` given lifetime-only framing (0/month, no growth story to tell)
- [x] ✅ **Task 2.2**: `Privacy.tsx` built — confirmed the contact form posts to a Google Apps
      Script endpoint per `Contact.tsx`, named as the processor. Route + Footer link wired; also
      needed adding to `entry-server.tsx`'s route list and PAGE_META (the layer that actually
      drives prerendered SEO tags — `Page.tsx` props alone don't reach the static HTML)
- [x] ✅ **Task 2.3**: CI/test-infrastructure history added — new paragraph in About's "My Journey"
- [x] ✅ **Task 2.4**: Capability statement added — new "What This Looks Like in Practice" section, About page

### Phase 3 — positioning-driven copy (now unblocked)

- [x] ✅ **Task 3.1**: Hero rewritten, then revised twice more for voice (see the Voice pass entry
      below) — final: "Ship Agent-Written Code You Can Actually Trust", links to `/open-source`
- [x] ✅ **Task 3.2**: Service cards restructured on both Home and About — new "Agentic Delivery
      Governance" card leads, PHP merged into one "Backend & PHP Engineering" card, no new route added
- [x] ✅ **Task 3.3**: "Fractional CTO & Technical Leadership" is now a lead-tier card on both
      Home and About (was buried in a Contact.tsx bullet list)
- [x] ✅ **Task 3.4**: Disqualifying line added under the Home hero

### Phase 4 — conversion & remaining trust items

- [x] ✅ **Task 4.1**: "Fixed-Scope Engagements" section added to Contact.tsx — two offer cards,
      prices explicitly "get in touch for a quote" (no fabricated numbers)
- [x] ✅ **Task 4.2**: "Capacity" bullet added to Contact's "How I Work" — describes the
      monthly-band model, no invented hour figures
- [x] ✅ **Task 4.3**: Visible `mailto:hello@ltscommerce.dev` link added to Contact sidebar
- [x] ✅ **Task 4.4**: `scripts/generate-feed.mjs` built (mirrors `generate-sitemap.mjs`), wired
      into `package.json`'s build chain, RSS `<link>` added to root `index.html`. Verified:
      `dist/feed.xml` generates with 44 correctly-sorted items
- [x] ✅ **Task 4.5**: `/articles/category/:categoryId` route added, `ArticleList.tsx` extended to
      read it via `useParams` (search-param interaction still takes precedence once used), category
      routes added to `entry-server.tsx`'s prerender list + given their own SEO meta. Verified: all 6
      category pages prerender with correct per-category titles
- [x] ✅ **Task 4.6**: New shared `ArticleNextStep.tsx` component, category-keyed CTA rendered
      after every article's content — avoided hand-editing all 44 `articles.ts` entries
- [x] ✅ **Task 4.7**: Footer copyright bar now reads "LTS Commerce Ltd. Company No. 16618262.
      Registered in England & Wales. VAT registered." Joseph confirmed fully VAT registered; no VAT
      number given so none is displayed (not legally required in a website footer, only on invoices).
      Same phrase added to Privacy.tsx's "Who this is" section
- [x] ✅ **Task 4.8**: `public/.well-known/security.txt` added (RFC 9116: Contact, Expires 1yr out,
      Preferred-Languages, Canonical). Verified present in `dist/`

### Phase 5 — external surfaces (explicit go-ahead per item, not bundled into blanket approval)

- [ ] 🔄 **Task 5.1**: Drafted — "Fractional CTO & PHP Engineer — building the guardrails (containment, policy, QA gates) that make AI-assisted delivery safe to ship. 20+ years backend. Long Term Support Ltd." Joseph pastes it himself (no API access to LinkedIn). **Correction**: there are actually _two_ LinkedIn profiles — the known `linkedin.com/in/edmondscommerce` (stale "Magento and E-Commerce Web Development Agency UK" headline) and a second, previously-undiscovered one, `linkedin.com/in/lts-joseph` (113 followers, headline just "Long Term Support LTD", featured posts still Magento/PHP-anchored). Neither shows any sign of repositioning yet. Flag both to Joseph — draft copy should probably go on whichever one he actually treats as primary, which only he can say.
- [x] ✅ **Voice pass** (added mid-execution, not in original brief): user asked for all copy to be filtered through Joseph's actual writing voice rather than generic marketing register. LinkedIn's activity feed is auth-walled (confirmed via real browser, no way through without his login — did not attempt). Real signal instead came from a LinkedIn Pulse article and featured-post snippets that _did_ come through via WebFetch: plain, clipped, self-deprecating, British-colloquial ("if you fancy a change", "100% X certified, 100% Y certified"), "get in touch" as his actual recurring CTA phrase.
      A background agent separately git-blame-verified that his own CCY docs are literally `Co-Authored-By: Claude Opus 5` in the commit history, and flagged (via stylistic fingerprinting) that **this site's pre-existing copy is itself probably AI-written** — so "preserve the existing voice" was never a safe default here.
      Best source, per Joseph's own suggestion: cloned the private `LongTermSupport/php-book` manuscript repo (`gh repo clone`, accessible via this container's `gh` auth) into `untracked/repos/php-book/` and read Chapter 1 directly — genuine, unfiltered, pre-LLM (2021) prose. Real pattern: long, loosely-built, comma-heavy sentences, British idiom ("the big daddy", "kick the tyres", "jump in at the deep end"), hedges and asides ("Whilst...", "I seriously hope...", "I think it would be fair to say..."), direct reader address, opinions stated plainly — nothing like the short-punchy-aphorism cadence AI text (including this site's prior copy) tends toward.
      Applied to Home/About/Contact hero copy and CTAs: swapped "Work With Me"/"Start a Conversation" for "Get In Touch" throughout, removed "X, not Y" balanced-clause constructions, loosened some sentences toward his looser connective style ("...so that's what I build..."). Deliberately did **not** touch Privacy.tsx — a GDPR notice shouldn't chase brand voice at the expense of precision. Not exhaustively re-passed over every card/bullet on the site (diminishing returns) — hit hero copy, CTAs, and the most visible prose blocks.
- [x] ✅ **Task 5.2**: `github.com/LTSCommerce` profile name/bio updated via `gh api user -X PATCH`
      after Joseph restarted the session with a token carrying the `user` scope (confirmed via
      `gh auth status`) — name → "Joseph Edmonds", bio → "PHP engineer & fractional CTO. Building the
      guardrails that make AI-assisted delivery safe to ship. 20+ years backend engineering." Verified
      via the PATCH response. **Pinning repos is not possible via API** — the GitHub GraphQL schema
      has no `pinItem`/pinned-items mutation for user profiles (confirmed by introspecting
      `__schema.mutationType.fields`; only issue/environment pinning exist). Pinning
      `php-qa-ci`/`ts-qa-ci`/`claude-code-hooks-daemon`/`fedora-desktop` (phpqa dropped — "its
      ancient") is web-UI-only: Joseph needs to do it himself via
      github.com/LTSCommerce → Customize your pins.

### Not in this pass (blocked or out of scope per the brief itself)

- §5.1 guardrail data — the hooks-daemon persists no verdict log yet; separate repo, not actionable here
- §5.3 testimonials — Joseph declined ("no testimonials"). Closed, not just deferred
- CSP — deliberately deferred past this pass, needs a resource-origin audit first (see Mechanism notes)

---

## Open inputs still needed from Joseph (not blocking the rest of the plan)

| Input                                                                      | Blocks                                 |
| -------------------------------------------------------------------------- | -------------------------------------- |
| Fixed-scope offer prices — no anchor number exists anywhere                | Task 4.1 copy finalization             |
| Availability-band min/max hours                                            | Task 4.2 copy finalization             |
| VAT number (site now says "VAT registered", no number shown)               | cosmetic only, not blocking            |
| Whether to make `actions-hub` public                                       | Whether it's added to Task 2.1 at all  |
| Manually pin repos on github.com/LTSCommerce (API has no pinning mutation) | Task 5.2 fully closing out             |
| Which LinkedIn profile is primary + headline refinement                    | Task 5.1 (open discussion, per Joseph) |

~~Sign-off on which company name to display~~ — resolved without needing to ask: Companies House
PSC data + the matching SIC code settled it (see Phase 0 correction above).

~~VAT registration status~~ — resolved: Joseph confirmed fully VAT registered (Task 4.7, Task 2.2).

~~Which former clients can be approached for testimonials~~ — resolved: Joseph declined
testimonials outright (§5.3, closed).

---

## Verification plan

- After every content/code change: `npm run build` (snippets → tsc → vite → SSR → prerender →
  sitemap → feed) must pass clean — this is also the TypeScript strict-mode gate.
- Read the actual generated output rather than trusting the build alone: `dist/index.html`,
  `dist/about/index.html`, `dist/contact/index.html`, `dist/privacy/index.html`,
  `dist/open-source/index.html` + per-project pages, `dist/articles/category/<id>/index.html`,
  `dist/feed.xml`, `dist/.well-known/security.txt`.
- `npx ts-qa` (full QA pipeline: lint, type-check, tests, Playwright) before considering any
  phase done, per `CLAUDE.md`.
- New/changed pages get a Playwright screenshot (`node scripts/screenshot.js`, per `CLAUDE.md`'s
  debugging workflow) to catch layout regressions the build can't — especially the new Privacy
  and category-landing pages, and the rewritten Home hero.
- Worker changes: `npm run build` inside `cloudflare-workers/lts-site-proxy/` to confirm
  `worker.ts` compiles; review the diff carefully before ever running `npm run deploy`, since
  that pushes to production immediately with no CI gate.
- Task 5.2 (GitHub profile edit), if approved at the time: verify via `gh api user` afterward
  that the change applied as intended.
