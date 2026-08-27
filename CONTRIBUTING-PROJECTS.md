# Contributing Article Source Material From Another Project

This site's best technical articles come from real engineering work happening
in other (often private) projects. Those projects should not have to write
finished prose. They should hand over raw, verbose, well-organised source
material, and let this repo's own writing process (`technical-article-writer`
→ voice/quality pass → `article-reviewer`) turn it into a published article.

This document defines that hand-off: where it lives, what shape it takes, and
the one rule that overrides everything else.

## The one rule that overrides everything else

**This repo is public.** Nothing that crosses the hand-off boundary may
contain real hostnames, IP addresses, ports, file paths, repo names,
container/service/user names, client names, customer names, or employer
names. Sanitise at the source, in the donating project, before anything is
written into this repo. Do not rely on the writer downstream to catch it.

The two named exceptions are tools that are already public and fair to name:
`ccy` / `claude-yolo`, and `LongTermSupport/fedora-desktop` on GitHub. Naming
either of those is fine. Nothing else about a private project's identity,
stack, or deployment is.

## Where this lives

The donating project checks this site's repo out locally, typically into its
own `./untracked/repos/` (or equivalent gitignored scratch location) so it
has a normal git remote to push a branch or commit through. From there, the
hand-off is just a plan folder under `CLAUDE/Plan/`, created the normal way:

```bash
CLAUDE/Plan/mkplan.bash "descriptive-kebab-name"
```

Everything else described below lives inside that plan folder. Nothing about
the hand-off needs new tooling, a new directory convention, or a new file
format outside of what the plan workflow (`CLAUDE/PlanWorkflow.md`) already
supports.

## What the donating project should push: a plan + a reference pack

A `PLAN.md` alone is too thin to write a genuinely good article from. Ship a
`reference/` folder alongside it, one file per concern, so the eventual
writer never has to reconstruct context that already existed in your head
while you were doing the work:

- `reference/architecture.md` — the mechanism, described precisely enough
  that a reader could reimplement it. Components, responsibilities, the
  request/data lifecycle, states and transitions. Diagrams are welcome as
  source material (see the note on diagrams below).
- `reference/security-model.md` (or `design-rationale.md` for non-security
  topics) — the reasoning behind every non-obvious design choice: what
  problem it closes, what it costs, what was deliberately left out and why.
  This is usually the highest-value file in the pack, because "why" is the
  thing that doesn't survive in the code itself.
- `reference/snippets.md` — sanitised, illustrative code the writer can
  embed close to verbatim. Real technique and structure, generic names,
  trimmed to what makes the point. Not copy-pasted from the real source; a
  fresh, deliberately-sanitised rewrite of it.
- `reference/alternatives.md` — the other approaches that were considered
  (or that a reader would obviously reach for first) and concretely why
  each one is worse. Comparisons with real teeth beat vague hand-waving.
- `reference/lessons.md` — the non-obvious things that only became clear by
  building it and watching it break. War stories, generalised: describe the
  shape of the problem and the fix as a transferable principle, not as a
  private incident report.
- `reference/article-angles.md` — several candidate framings for the
  eventual article, each with a one-paragraph pitch, a suggested length, and
  the key takeaway it lands. Let the writer pick the strongest spine instead
  of guessing at the one true angle. Recommend one, but include at least two
  more as real alternatives, not throwaway options.

Name the files by concern, not by this exact list — a topic without a
meaningful "alternatives" angle shouldn't force one into existence. The
organising idea is: **one file per distinct kind of thing the writer needs
to know**, not one undifferentiated wall of text.

### Declare your placeholder set up front, once, and use it everywhere

Pick a consistent set of sanitised stand-ins before writing anything else,
state it at the top of `reference/snippets.md`, and hold every file in the
pack to it. For example: a project slug, container/service names built from
that slug, a generic host username, a fake-but-plausible repo path, a
network name, a script name. One consistent fake project reads as
intentional and professional. A different placeholder in every file reads as
carelessly redacted, and invites exactly the kind of close reading that
finds what should have been removed.

### Favour verbose over terse

Context is cheap for the writer to skim past and expensive for the writer to
invent. When in doubt, include the extra paragraph, the extra war story, the
extra alternative that didn't make the cut. A reference pack that runs long
because it's thorough is doing its job. A reference pack trimmed down to
save the donating project some writing time just moves that cost onto the
writer, who has far less context to fill the gap with.

### Diagrams

This site's article renderer has **no Mermaid support**. Articles are
pre-rendered to plain static HTML (`ArticleContent` injects the `content`
field's HTML directly; `highlight.js` handles code-block syntax
highlighting only). A \`\`\`mermaid fence prints as raw, unrendered text to a
reader — never use one in anything meant to reach the published article.

**Inside the reference pack, Mermaid is fine.** Nobody needs a reference-pack
diagram to render: it is read by the writer (human or agent), not a site
visitor. Mermaid is precise, cheap to write and edit, and a good way to
convey a component graph, a sequence, or a state machine exactly. Keep using
it there.

**In the published article, use hand-authored inline SVG**, embedded
directly in the HTML `content` string, for any diagram that earns its place
(a component/architecture diagram, a state machine — not a two-box flow that
prose already covers as well). Reasons this beats the alternatives on this
site specifically:

- The article's HTML is injected as-is with no build step in between, so an
  inline `<svg>...</svg>` block just works — no new dependency, no runtime
  rendering library, nothing that can fail silently during the static
  prerender.
- It stays crisp at any zoom level, unlike a rasterised PNG/JPEG export of a
  Mermaid diagram.
- It can be styled with `currentColor` and the site's existing CSS custom
  properties (see `src/styles/global.css`) so it inherits the site's actual
  look instead of reading as a pasted screenshot from somewhere else.

A diagram that does not clear the "earns its place" bar should be prose or a
short numbered walk-through instead — most sequences and lifecycles read
perfectly well as an ordered list of steps, and not every Mermaid diagram in
the reference pack needs a published-article equivalent at all.

## What happens after the push

Once the plan and its reference pack land on `main`, the write-up itself
follows this repo's normal article process (see root `CLAUDE.md` → "Adding
New Articles"): a drafting pass grounded in the reference pack, a voice and
formal-register quality pass, then the mandatory `article-reviewer` gate
before anything is committed to `src/data/articles.ts`. The donating
project's sanitisation is the first gate, not the only one — this repo's own
process independently re-checks the finished article against the same
public-repo hygiene rules before publication, because this repo is the one
whose name is on it.

## Worked example

`CLAUDE/Plan/00013-host-action-bridge-article/` is the reference
implementation of this whole document: a scoped `PLAN.md` plus a full
`reference/` pack (architecture, security model, snippets, alternatives,
lessons, article angles) donated from a private project, sanitised to a
single consistent placeholder set, and turned into the published
`host-action-bridge` article. Use its `reference/` folder as the template
for shape and depth when building your own.
