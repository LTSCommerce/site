# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Runner Boxes in Casting Shop Maintenance Area" — HAER NY,15-BUF,25-12, a
  black-and-white architectural documentation photograph of refractory-lined runner boxes
  (the troughs that channel molten brass/copper from furnace to mould) sitting on rail carts in
  the maintenance area of the American Brass Foundry, 70 Sayre Street, Buffalo, Erie County, New
  York. Historic American Engineering Record (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:RUNNER_BOXES_IN_CASTING_SHOP_MAINTENANCE_AREA._THE_SECTION_OF_THE_PLANT_SHOWN_IN_THE_BACKGROUND_FORMERLY_HOUSED_SMALL_BRASS_AND_COPPER_FURNACES_THAT_POURED_APPROXIMATLEY_3500_LBS._HAER_NY,15-BUF,25-12.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/1/1a/RUNNER_BOXES_IN_CASTING_SHOP_MAINTENANCE_AREA._THE_SECTION_OF_THE_PLANT_SHOWN_IN_THE_BACKGROUND_FORMERLY_HOUSED_SMALL_BRASS_AND_COPPER_FURNACES_THAT_POURED_APPROXIMATLEY_3500_LBS._HAER_NY%2C15-BUF%2C25-12.tif>
- **Original dimensions**: 5,000×3,597px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties. As a work of
  the U.S. federal government, such work is in the public domain in the United States." Verified
  on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about LLM agents overfitting: producing a fix that reproduces the exact reported
case and nothing else, rather than a solution that generalises. A runner box is itself a fixed
mould — refractory-lined, cast to one specific cross-section, useless for anything but exactly
that shape of casting. This photograph shows several of them lined up on rail carts, each
nominally identical but individually worn and repaired in slightly different ways (patched
refractory, mismatched wear patterns), which is a closer visual match to the article's point than
a single mould would have been: a fleet of narrow, single-purpose fixtures that only ever
reproduce one shape, standing in for the narrow, single-case fixes an overfitting agent produces.
Rejected first: a single pouring-in-progress shot (HAER NY,15-BUF,25-9, "Caster Jim Durfee is
pouring brass alloy into moulds") — technically on-theme but portrait-oriented with a lot of
empty rafter/lighting space at the top, which reads poorly cropped to a 5:1 band. This runner-box
photograph was chosen because the frame is already dense with repeated mould shapes edge to edge
in a landscape composition, with no empty-sky problem.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif` (here: `runner-boxes.tif`):

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # → 2400x1727

# 2. Remove the HAER archival print border (a black frame line + white margin running down
#    both the left and right edges of the photograph print, not part of the photographed
#    subject — the right edge also carries a vertical "HAER..." text label). The border is not
#    axis-aligned at the true image edge, so an automated -fuzz -trim does not catch it; crop it
#    out manually and re-resize to restore the working width.
convert resized.png -crop 2190x1727+55+0 +repage clean.png   # trims ~55px left, ~155px right
convert clean.png -resize 2400x clean-resized.png            # → 2400x1893

# 3. Hero crop: a wide band across the row of runner-box moulds (chosen by eye — the band that
#    keeps all four visible troughs filling the frame edge to edge, avoiding the emptier
#    rafter/ceiling space above and the plain floor below)
convert clean-resized.png -crop 2400x480+0+468 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q60/70/78/80/85 compared — unblurred q80 landed at ~123KB, comfortably in
#    the usual ~100-140KB range, so the blur-before-encode fallback wasn't needed here despite
#    the concrete/refractory texture)
convert hero-faded.png -quality 80 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~122.7KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same cleaned source
(`clean-resized.png` from step 2 above, not a re-fetch or a resize of `hero.webp`):

```bash
# A tighter crop centred on the two nearest troughs meeting corner-to-corner, with a third
# visible further back — tried an alternative crop (+300+400) first that included more empty
# ceiling/backdrop; this framing (+600+400) keeps the repeated mould shapes as the dominant
# subject at the taller 1.91:1 ratio
convert clean-resized.png -crop 1200x630+600+400 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 78 og.jpg
```

Result: 1200×630px JPEG, ~116.3KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source is already greyscale, same as the two prior
  hero images on this site.
- The archival print border needed a manual (not automated) trim because it isn't a clean
  solid-colour frame at the true canvas edge — it's an angled black line with a white margin
  around a slightly rotated print scan. `-fuzz N% -trim` only catches borders that are uniform
  colour right at the image boundary, which this wasn't.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- Blur-before-encode (used on the component-driven-design hero for a similarly textured stone
  source) was tried and compared but not needed here: unblurred q80 already landed at ~123KB,
  inside the normal range, so adding blur would have traded away detail for no real file-size
  benefit.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets — the source
  URL and licence above are exactly what's needed to refetch it from scratch if this processed
  copy is ever lost.
