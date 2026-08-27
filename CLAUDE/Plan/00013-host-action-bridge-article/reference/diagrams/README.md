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

## Re-rendering

Run from the repository root. The `--no-sandbox` puppeteer config is required
because the authoring session runs as root inside a container; the theme
variables match the site's `--color-primary` (see `src/styles/global.css`) so
the diagram reads as drawn for the site rather than as a default-Mermaid
screenshot.

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
    "fontFamily": "system-ui, sans-serif"
  }
}
JSON
npx -y @mermaid-js/mermaid-cli \
  -i CLAUDE/Plan/00013-host-action-bridge-article/reference/diagrams/architecture.mmd \
  -o public/images/host-action-bridge/architecture.svg \
  -p /tmp/puppeteer-config.json -c /tmp/mermaid-theme.json -b transparent
```

Commit the resulting `.svg` like any other static asset. Nothing renders
Mermaid at build time or in the browser, by design: the site is
static-HTML-first with no JavaScript in the critical path.

Every label in a rendered diagram is public-facing text, so it obeys the
placeholder set in [`../publishing-conventions.md`](../publishing-conventions.md)
section 8 exactly, the same as prose and code.
