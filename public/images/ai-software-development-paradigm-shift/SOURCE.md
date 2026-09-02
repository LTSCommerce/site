# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Ford assembly line - 1913" — a black-and-white photograph of workers
  assembling flywheel magnetos at Ford's Highland Park, Michigan plant in 1913, the year Ford
  introduced the world's first moving assembly line. Workers stand along a belt conveyor fitted
  with parts bins, assembling components as the line moves past them.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Ford_assembly_line_-_1913.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/2/29/Ford_assembly_line_-_1913.jpg>
- **Original dimensions**: 3,916×2,826px JPEG, already greyscale
- **Licence**: Public domain in the United States — first published prior to 1 January 1931 with
  no copyright renewal. Wikimedia Commons attributes the file to the U.S. National Archives
  (catalog.archives.gov/id/1633486). Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about a fundamental paradigm shift in how software gets built — not an
incremental speed-up, but a change in the basic unit of production. The 1913 Highland Park
photograph is a literal (not metaphorical) documentation of exactly that kind of shift: the
introduction of the moving assembly line, which restructured how a complex product got made from
the ground up, the same way this article argues AI coding assistants are restructuring how
software gets made. It was chosen over generic AI/robot stock imagery deliberately — this site's
hero images use grounded historical/industrial photography as metaphor, not literal tech imagery,
and a real production-method changeover mid-adoption is a stronger, less clichéd fit than any
picture of a screen or a robot arm. The frame is dense with content edge to edge — a receding
line of workers, hands, parts bins, and the conveyor rail leading the eye into the distance —
rather than a small subject against empty background.

The non-"restored" version was used deliberately: `File:Ford_assembly_line_-_1913_(restored).jpg`
is a community-retouched derivative (digitally enhanced via Photopea) of this same file, and the
plain original traces more directly to the National Archives without an extra unverified
processing step in the provenance chain.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width (source is already greyscale, no -colorspace Gray needed)
convert original.jpg -resize 2400x resized.png   # → 2400x1732

# 2. Hero crop: a wide band across the receding line of workers/conveyor (chosen by eye after
#    comparing three vertical offsets — this one captures the most hands-on-work plus the
#    conveyor rail leading into the distance, without too much soft background at the top)
convert resized.png -crop 2400x480+0+680 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 3. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 4. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 5. Encode to WebP (q85/78/70/60 compared — q70 was the chosen balance: near-indistinguishable
#    detail from q78 at on-page display size, meaningfully smaller than q85, and no blur step
#    was needed since this source isn't high-frequency-textured the way stone/foliage is)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~65KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms composite `og:image`/`twitter:image` at roughly 1.91:1 and don't reliably
render alpha transparency, so the on-page hero (5:1, alpha-faded) isn't usable directly. `og.jpg`
is a separate, fully opaque asset at the conventional 1200×630 social-card size, cropped from the
same `resized.png` used for the hero — same source, different framing, not a re-fetch:

```bash
# A closer, taller crop centred on one worker's face/hands assembling a flywheel, with a second
# worker's hands visible at the right edge — chosen over a flatter offset because it reads as
# people actively doing the work, not just a receding line
convert resized.png -crop 1200x630+600+560 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 72 og.jpg
```

Result: 1200×630px JPEG, ~90KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed — the source photograph is already black-and-white, so it sits
  calmly against the site's blue/white/grey palette with no colour-clash processing required.
- No pre-encode blur was needed either — unlike a stone-wall or foliage source, this photograph's
  detail (fabric, machined metal, skin) isn't high-frequency noise in the way WebP's compressor
  struggles with, so quality alone controlled file size adequately.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav — only the
  bottom edge needed a fade, not the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offsets/quality values —
  the source URL and licence above are exactly what's needed to refetch it from scratch if this
  processed copy is ever lost.
