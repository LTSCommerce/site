# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "(Left to right) American elevator, Canagra Mill, Lake and rail elevator,
  marine A" — HAER NY,15-BUF,27-2, a black-and-white architectural documentation photograph of
  the Buffalo Grain Elevators complex, Buffalo, Erie County, NY. Historic American Engineering
  Record (HAER), a National Park Service programme; image credited to the Library of Congress.
- **Source page**: <https://commons.wikimedia.org/wiki/File:(Left_to_right)American_elevator,_Canagra_Mill,_Lake_and_rail_elevator,_marine_A._-_Buffalo_Grain_Elevators,_Buffalo,_Erie_County,_NY_HAER_NY,15-BUF,27-2.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/5/5b/%28Left_to_right%29American_elevator%2C_Canagra_Mill%2C_Lake_and_rail_elevator%2C_marine_A._-_Buffalo_Grain_Elevators%2C_Buffalo%2C_Erie_County%2C_NY_HAER_NY%2C15-BUF%2C27-2.tif>
- **Original dimensions**: 5,000×3,610px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties. As a work of
  the U.S. federal government, such work is in the public domain in the United States." Verified
  on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about building PHP APIs that scale with growing load — not a single fixed design,
but infrastructure with headroom for growth, added to incrementally as demand grows. This
photograph shows the Buffalo grain elevator district: several distinct elevator structures of
different eras, construction methods (brick, poured concrete, steel), and heights, built
alongside each other over decades as the site's grain-handling capacity needed to expand, fed by
the converging rail sidings visible at ground level. That is a direct visual match for
"capacity added over time as load grows," without literally depicting a computer or a diagram.
Considered and rejected first: a single modern grain silo (visually clean but reads as one static
object, not growth/scaling); a rail marshalling yard (good scaling metaphor but Commons HAER
candidates in that category were harder to source at this resolution). This photograph was
chosen because the frame is already dense with structural content edge to edge — five or six
separate elevator generations stacked side by side — rather than one isolated subject on empty
sky.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero working width
convert original.tif -resize 2400x resized.png                  # → 2400x1733

# 2. The HAER archival print carries its own physical border: a thin black frame line on the
#    left, and a thicker black strip with a handwritten "HAER NY-239.2" label running down the
#    right edge. Neither is part of the photographed subject, so trim them by content-cropping
#    to the photo's real extent (found by inspecting narrow strips at each edge) rather than
#    relying on `-trim`, which only trims a uniform border colour from the corner inward and
#    doesn't reach the embedded text label:
convert resized.png -crop 2250x1733+40+0 +repage content-only.png

# 3. Re-resize the border-free content back up to the standard 2400 hero width (this rescales
#    the vertical axis proportionally too, so any y-offset picked in step 2's coordinate space
#    must be rescaled by the same factor, 2400/2250 ≈ 1.0667, before reuse)
convert content-only.png -resize 2400x content-resized.png       # → 2400x1849

# 4. Hero crop: a wide band across the elevator complex — full height of the shorter brick
#    structures through to the mid-height of the tall concrete elevator on the right, with the
#    rail sidings just below frame and only a modest strip of sky above (chosen by eye; this is
#    the densest structural band without dipping into the empty-sky top third or the
#    gravel/car-heavy bottom eighth)
convert content-resized.png -crop 2400x480+0+661 +repage crop-final.png

# 5. Light contrast boost (source was already greyscale HAER documentation photography, no
#    -colorspace Gray needed)
convert crop-final.png -brightness-contrast 3x8 crop-grey.png

# 6. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 7. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 8. Encode to WebP with alpha preserved. q85/q78/q70 were all tried (72KB/52KB/42KB) — this
#    source is clean architectural line/concrete detail, not high-frequency noise, so it
#    compresses well even at high quality with no blur-before-encode step needed; q85 was chosen
#    since it was still comfortably under the usual ~100-140KB range at the best detail level.
convert hero-faded.png -quality 85 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~72KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same border-free
`content-resized.png` used for the hero (same source family, taller framing — captures more
vertical building height and the rail sidings/cars at the bottom, less sky, than the hero's
wider/shorter band):

```bash
convert content-resized.png -crop 1200x630+600+560 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-final.png
convert og-final.png -quality 82 og.jpg
```

Result: 1200×630px JPEG, ~73KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source is already black-and-white documentation
  photography, so it sits calmly against the site's blue/white/grey palette with no colour
  processing.
- The archival print's own border/label was trimmed by content-cropping to a known-good extent
  (found by inspecting edge strips), not by `-trim`, because the embedded handwritten label text
  defeats simple corner-colour trimming.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- No blur-before-encode step was needed — unlike a stone-wall or foliage source, this is mostly
  flat concrete/brick surfaces and sky, which WebP compresses well without any softening.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets — the source
  URL and licence above are exactly what's needed to refetch it from scratch if this processed
  copy is ever lost.
