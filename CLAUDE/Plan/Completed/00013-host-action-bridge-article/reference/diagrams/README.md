# Diagram sources

Mermaid sources for the diagrams that earn a place in the published article,
kept here so any of them can be re-rendered later without reconstructing the
graph from the SVG.

| Source             | Rendered output                                     | Used in the article        |
| ------------------ | --------------------------------------------------- | -------------------------- |
| `architecture.mmd` | `public/images/host-action-bridge/architecture.svg` | Yes, as a `<figure>` image |

The other two diagrams in [`../architecture.md`](../architecture.md) (the
request-lifecycle sequence and the state machine) are deliberately **not**
rendered: both read better in the article as an ordered prose walk-through,
and `CONTRIBUTING-PROJECTS.md` sets the bar at "a diagram must earn its
place". They stay as Mermaid in the reference pack, where nothing needs to
render them.

## Direction: `TB`, not `LR`

`architecture.mmd` uses `flowchart TB` (top-to-bottom) with `direction LR`
inside each subgraph, not a top-level `flowchart LR`. The first render of
this diagram used `LR` throughout and produced a viewBox roughly
2300×200px, an 11:1 wide-and-short strip. Squeezed into an article's prose
column (a few hundred px wide), that forced the whole image down to a
fraction of its natural size, taking the text with it — the diagram read as
low-resolution even though it is a lossless vector. It was not blurry, it
was just rendered tiny. Switching to `TB` produced roughly 445×1390px: a
portrait shape that fits an article column at close to its natural size,
so the text stays legible and the reader scrolls down through it like the
rest of the page, rather than fighting a diagram far wider than the column
it lives in.

The lesson generalises: pick the Mermaid direction that matches the shape
of the column the diagram will render in, not whichever direction reads
most naturally as a graph on its own. A wide screen and a narrow prose
column are different canvases. `direction LR` inside an individual
subgraph is still useful for keeping a short local chain compact
side-by-side, even while the overall diagram flows `TB`.

## Re-rendering

Run from the repository root. The `--no-sandbox` puppeteer config is
required because the authoring session runs as root inside a container; the
theme variables match the site's `--color-primary` (see
`src/styles/global.css`) so the diagram reads as drawn for the site rather
than as a default-Mermaid screenshot; `fontSize` is bumped from Mermaid's
16px default to 20px so text stays comfortable even after the SVG is
scaled to fit the article column.

```bash
cat > /tmp/puppeteer-config.json << 'JSON'
{"args": ["--no-sandbox", "--disable-setuid-sandbox"]}
JSON
cat > /tmp/mermaid-theme.json << 'JSON'
{
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#eef4fa",
    "primaryTextColor": "#171717",
    "primaryBorderColor": "#0f4c81",
    "lineColor": "#0f4c81",
    "fontFamily": "system-ui, sans-serif",
    "fontSize": "20px"
  }
}
JSON
npx -y @mermaid-js/mermaid-cli \
  -i CLAUDE/Plan/Completed/00013-host-action-bridge-article/reference/diagrams/architecture.mmd \
  -o public/images/host-action-bridge/architecture.svg \
  -p /tmp/puppeteer-config.json -c /tmp/mermaid-theme.json -b transparent
```

Commit the resulting `.svg` like any other static asset. Nothing renders
Mermaid at build time or in the browser, by design: the site is
static-HTML-first with no JavaScript in the critical path.

Every label in a rendered diagram is public-facing text, so it obeys the
placeholder set in [`../publishing-conventions.md`](../publishing-conventions.md)
section 8 exactly, the same as prose and code.
