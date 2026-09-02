---
name: article-image
description: Source, fetch, process, and wire in a full-width hero image for an article — find a genuinely public-domain/CC0 image, verify its licence, process it to a controlled size/quality with a baked-in fade, and record full provenance so it can be rebuilt later with different styling.
argument-hint: "<article-slug> <what to depict>"
disable-model-invocation: false
user-invocable: true
allowed-tools: Bash, Read, Edit, Write, WebSearch, WebFetch
---

# Article Image

Adds (or replaces) an article's `heroImage`: source a real image, verify its licence, process it
with ImageMagick to a controlled size/quality with the fade baked into the pixels, write a
provenance record, and wire it into `src/data/articles.ts`. This is deliberately NOT
fire-and-forget — every step below exists because skipping it caused a real problem the first
time this was done by hand (see "Lessons from the first run" at the end).

## Step 1 — Source candidates

Search for genuinely public-domain or CC0 images, not merely "free to use with attribution."
Good sources, roughly in order of how often they turn out to be exactly what's needed:

- **Wikimedia Commons** — best for historical illustrations/engravings and for US-federal-work
  photography (National Park Service, USFWS, etc., which are public domain as government work).
  Search via `WebSearch`, then verify licence on the actual file page.
- **Getty Open Content Program**, **Met Open Access** — institutional art, CC0.
- **Picryl**, **NGA Images** — aggregated public domain photographs, posters, historical images.

Avoid stock-photo sites unless they explicitly state CC0 — "free" often still means
attribution-required or non-commercial, which this site doesn't want to carry as an obligation.

**Composition matters as much as licence.** A tall, narrow emblem centred on a wide banner with
empty space either side reads as a small icon, not a hero image — this happened on the first
run of this skill (see lessons below). Prefer something that already fills a wide-ish frame, or
that has enough detail/texture to crop a dense, content-full band from (a coiled animal, a
tightly-packed scene, a close-up texture) rather than a small subject on a big empty background.

## Step 2 — Verify the licence before fetching anything

For each real candidate, `WebFetch` the actual file page (not a search result summary) and get:
the direct file URL, the exact licence statement (quote it), the dimensions, and a description
of the composition. Do not proceed on a licence you're inferring from a search snippet — get it
from the file's own page.

## Step 3 — Fetch and inspect

```bash
curl -sL -o /path/to/scratch/original.<ext> "<direct file URL>"
identify /path/to/scratch/original.<ext>
```

Then actually look at it (`Read` the file as an image) before processing — check the
composition holds up at hero-banner proportions before spending time on the pipeline.

## Step 4 — Process with ImageMagick (`convert`/`identify`, ImageMagick 6 in this container)

The exact recipe depends on the source (line-art needs its background dropped to transparent;
a photo needs desaturating and a content-dense crop), so there's no one-size script — but the
building blocks, verified working on two different source types so far:

**Resize to target width:**

```bash
convert original.jpg -resize 2400x resized.png
```

**For line art / manuscript illustrations** — drop the white background to transparent so the
artwork floats on the page with no visible card edge, rather than leaving a solid white
rectangle behind it:

```bash
convert artwork.png -fuzz 8% -transparent white artwork-transparent.png
```

**For photographs** — desaturate toward greyscale so an arbitrary source's colour palette never
clashes with the site's own palette (this project's blue primary / white-grey neutrals):

```bash
convert resized.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 grey.png
```

**Crop to a wide, content-dense band** (adjust the `+X+Y` offset by eye — there's no formula for
"the most interesting region," view the resized image first and pick a crop that keeps the
subject filling the frame edge to edge, not centred with empty margins):

```bash
convert resized.png -gravity center -crop 2400x480+0+40 +repage cropped.png
```

**Bake in a fade as a real alpha channel — not a CSS overlay.** This is the "high-performance"
part: one static asset, no extra paint layer, works regardless of where the image sits (top of
page under a translucent nav needs only a bottom fade; mid-page needs both edges).

```bash
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert \( -size ${W}x${OPAQUE_H} xc:white \) \( -size ${W}x${FADE_H} gradient:white-black \) -append gradient-mask.png

# Photo (no existing transparency to preserve) — straight replace is correct:
convert cropped.png gradient-mask.png -alpha off -compose CopyOpacity -composite faded.png

# Line art that already has its own transparency (from the white-removal step above) —
# MULTIPLY the two alphas together, don't replace, or the transparent margins outside the
# artwork's bounding box become semi-opaque-white in the fade region instead of staying clear:
convert canvas-composed.png -alpha extract existing-alpha.png
convert existing-alpha.png gradient-mask.png -compose multiply -composite combined-alpha.png
convert canvas-composed.png combined-alpha.png -compose CopyOpacity -composite faded.png
```

**Encode to WebP with quality/size control:**

```bash
convert faded.png -quality 85 -define webp:lossless=false hero.webp
ls -la hero.webp   # sanity-check the size — a hero image should land well under ~150KB
identify -format "channels=%[channels] alpha=%A\n" hero.webp   # confirm alpha survived encoding
```

Try a couple of quality values and compare size/detail trade-off (`-quality 90` vs `-quality 78`
etc.) rather than accepting the first number — this is exactly what "control filesize" means in
practice, not just picking a default and moving on.

## Step 5 — Write the provenance file (MANDATORY, not optional)

Every processed image gets a `public/images/<slug>/SOURCE.md` alongside it, containing:

1. **Provenance**: original work description, source page URL, direct file URL, original
   dimensions, licence (quoted, not paraphrased), fetch date.
2. **The exact processing recipe used** — every command, with the actual values (crop offsets,
   width/height, quality setting) that produced the final asset, not a generic template. This
   must be enough to rebuild the asset from the original source with different parameters
   (a new crop, a different fade point, a different target size) without re-deriving anything.
3. **Why this approach** — the reasoning behind the specific choices (why greyscale, why this
   crop, why this fade split) so a future rebuild can tell what's load-bearing vs. arbitrary.

This is the single most important step in this skill. An image with no provenance record is a
dead end the moment anyone wants to adjust it — see "Lessons from the first run" below for why.

## Step 6 — Wire into the article

1. `public/images/<slug>/hero.webp` is the asset; reference it as `/images/<slug>/hero.webp`.
2. Add/update the `heroImage: { src, alt }` field on the article object in
   `src/data/articles.ts` — `alt` describes what's actually depicted, plainly (see
   `src/types/article.ts` for the `ArticleHeroImage` type).
3. `npm run build` and verify the article's `dist/articles/<slug>/index.html` output.

## Step 7 — Actually look at the result, not just build success

A green build proves the code compiles, not that the image looks right. Use `agent-browser` (or
this project's `run` skill) against a local `npm run preview` server to screenshot the real
rendered page, at a real viewport size, and look at it.

**Wait for the page's own load transition to settle before screenshotting.** This site fades
`body` in via `opacity: 0 → 1` over 0.2s on load — a screenshot taken immediately after
navigation catches this mid-transition and every colour on the page reads washed-out toward
white, which looks exactly like a real rendering bug (it fooled a full diagnostic pass on the
first run of this skill, including sampling pixel colours, before the actual cause was found).
Sleep briefly (~1s is comfortably enough) after `agent-browser open` before capturing.

When checking contrast (e.g. text over an image), don't trust the screenshot by eye alone —
sample actual pixel colours with ImageMagick and compare against the expected values:

```bash
convert screenshot.png -crop 1x1+<x>+<y> +repage -format "%[pixel:p{0,0}]\n" info:
```

Also check for horizontal overflow if the image uses any full-bleed/breakout CSS technique:

```bash
agent-browser eval "document.documentElement.scrollWidth + 'x' + document.documentElement.clientWidth"
```

The two numbers should match exactly.

## Lessons from the first run (the-ouroboros-problem)

- **A thematically-perfect image can still be the wrong choice.** The first candidate (a
  historical ouroboros manuscript illustration) was licence-clean and exactly on-topic, but as
  a tall emblem on a wide banner it read as a small icon in a lot of empty space. Composition
  fit for the actual layout matters as much as subject match — check both before committing.
- **A CSS-overlay gradient and a baked-in alpha fade are not interchangeable**, and the baked-in
  version needs the multiply-not-replace alpha handling above when the source already has its
  own transparency, or the "removed" background reappears as a faint haze in the fade zone.
- **A translucent nav over a hero image needs testing at more than one screenshot instant.**
  `backdrop-filter` was suspected and removed as the cause of an apparent full-page contrast
  bug; the actual cause was the page's own load-transition being caught mid-fade. Don't assume
  the first plausible CSS suspect is the real one — verify with pixel sampling before rewriting
  code to "fix" something that may not be broken.
- **Full-bleed image techniques differ depending on where the image sits.** A breakout trick
  (`relative left-1/2 right-1/2 -mx-[50vw] w-screen`) is needed for an image nested inside a
  constrained container; an image rendered as a direct sibling of `<Container>` (outside it) is
  already full width with no trick needed, and negative margin (`-mt-16`, matching the nav's own
  height) is what pulls it up to sit behind a sticky nav. Check where in the tree the image
  actually needs to render before reaching for the breakout CSS.
