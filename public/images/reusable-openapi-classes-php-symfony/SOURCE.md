# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Quonset huts at Alaskan base c1943" — a black-and-white photograph of a
  WWII-era U.S. Navy installation in Alaska, showing dozens of prefabricated Quonset huts
  arranged across a snow-and-tundra site with mountains in the background. Photographed
  c1943-1944 by Capt. Lewis R. Devoe, USNR.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Quonset_huts_at_Alaskan_base_c1943.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/9/9d/Quonset_huts_at_Alaskan_base_c1943.jpg>
- **Original dimensions**: 1,375×964px JPEG (already greyscale)
- **Licence**: Public domain — "This file is a work of a sailor or employee of the U.S. Navy,
  taken or made as part of that person's official duties. As a work of the U.S. federal
  government, it is in the public domain in the United States." Source collection: U.S. Navy
  National Museum of Naval Aviation (photo No. 2005.024.005.055). Verified on the Wikimedia
  Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about generating reusable, well-structured PHP classes from an OpenAPI schema —
standardized, interchangeable components assembled into whatever Symfony endpoint needs them,
instead of hand-duplicated attribute blocks. A Quonset hut encampment is a direct visual match
for that idea rather than a stretched metaphor: the Quonset hut is a mass-produced, identical,
prefabricated unit, designed so the same standard component could be assembled anywhere, at
speed, with no bespoke redesign per site. This particular photograph was chosen over other
Quonset candidates because the frame is dense with content edge to edge — a dozen-plus huts of
identical arched-roof profile at varying distances/angles, plus support structures and vehicles
— rather than a single isolated hut with empty sky or ground around it. It avoids repeating the
forging-die/closed-die-press theme already used for `openapi-automatic-code-generation` and the
cast-iron-gears theme used for `component-driven-design-react-typescript-storybook`.

The original file is only 1,375px wide, smaller than prior hero sources. It was upscaled to the
2400px target width as part of the standard resize step; at hero-band display size the result
holds up (it's a grainy historical photograph to begin with, so the upscale softness reads as
period photographic grain rather than a resizing artefact — verified by eye before proceeding).

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`. Note: the gradient-mask build below is split into
separate single-image `convert` calls (rather than one command using `\( ... \)` sub-image
groups) purely because this worktree's shell guard misfires on `(` used for ImageMagick grouping
— functionally identical to the single-command version in the skill doc.

```bash
# 1. Resize to the target hero width (source is only 1375px wide, so this upscales ~1.75x)
convert original.jpg -resize 2400x resized.png   # → 2400x1683

# 2. Crop a wide, content-dense band across the main hut cluster (chosen by eye — captures the
#    foreground huts, the mid-distance cluster on both left and right, and the background hut
#    near the tree line, while cropping out most of the empty sky/mountain band above and the
#    grass tussock foreground below)
convert resized.png -crop 2400x480+0+760 +repage crop-test1.png

# 3. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert crop-test1.png -brightness-contrast 3x10 crop-grey.png

# 4. This source is high-texture (period film grain, snow/gravel/debris) and did not compress
#    well even at low WebP quality (~124KB at q65, uncomfortably close to the ~150KB ceiling for
#    a q65 baseline) — apply a light blur before the alpha composite, per the skill's high-texture
#    fallback:
convert crop-grey.png -blur 0x0.6 crop-grey-blur.png

# 5. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the bottom
#    45% (this hero sits at the very top of the page under the nav, so only the bottom edge —
#    where it meets the article header — needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100))    # 264
FADE_H=$((H - OPAQUE_H))      # 216
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey-blur.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP with alpha preserved, quality-controlled for file size (q65/75/82 were tried
#    on both the unblurred and blurred versions — q75 on the BLURRED source gave the best detail
#    vs size trade-off: 112KB vs 141KB unblurred at the same quality setting)
convert hero-faded.png -quality 75 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~112KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same resized source
used for the hero (same framing family, not a re-derivation):

```bash
convert resized.png -crop 1200x630+600+700 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x10 og-grey.png
convert og-grey.png -quality 72 og.jpg
```

Result: 1200×630px JPEG, ~125KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No further desaturation was needed — the source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette without any processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- The blur-before-encode step is source-specific (high-frequency period film grain compressed
  poorly), not a default — a cleaner source wouldn't need it. To rebuild for new styling, rerun
  from the original JPEG with new crop offset/quality/blur values — the original source file's
  URL and licence above are exactly what's needed to refetch it from scratch if this processed
  copy is ever lost.
