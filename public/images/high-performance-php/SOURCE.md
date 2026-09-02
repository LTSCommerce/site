# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "General View of Turbine -3" — HAER WASH,17-SEAT,2-14, a black-and-white
  architectural/engineering documentation photograph of a vertical steam turbine-generator unit
  at the Georgetown Steam Plant, Seattle, Washington. Photographed by Jet Lowe for the Historic
  American Engineering Record (HAER), a National Park Service programme, documentation compiled
  after 1968.
- **Source page**: <https://commons.wikimedia.org/wiki/File:GENERAL_VIEW_OF_TURBINE_-3_-_Georgetown_Steam_Plant,_South_Warsaw_Street,_King_County_Airport,_Seattle,_King_County,_WA_HAER_WASH,17-SEAT,2-14.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/a/a0/GENERAL_VIEW_OF_TURBINE_-3_-_Georgetown_Steam_Plant%2C_South_Warsaw_Street%2C_King_County_Airport%2C_Seattle%2C_King_County%2C_WA_HAER_WASH%2C17-SEAT%2C2-14.tif>
- **Original dimensions**: 5,000×4,003px TIFF (4×5 inch original negative), 8-bit greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties... such work
  is in the public domain in the United States." Verified on the Wikimedia Commons file page at
  fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about high-performance PHP: opcache, JIT, profiling, and the mechanics of getting
real throughput out of a running system. A large steam turbine-generator unit is a direct,
literal fit for "raw mechanical throughput" rather than a stretched metaphor — it is the actual
machine that converts steam pressure into continuous rotational output at scale, photographed
close enough that the frame is dense with mechanical detail (turbine housing, coupling flange,
motor vents, control gauges, piping, ladder) edge to edge rather than a small subject lost in an
empty machine hall. It was chosen over a wider interior-pano shot of the same plant (which is
CC-BY-SA, not public domain — a 2008 stitched composite by a different photographer) specifically
to keep the site's public-domain-only sourcing preference.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width (source is already greyscale, no -colorspace Gray needed)
convert original.tif -resize 2400x resized.png   # → 2400x1921

# 2. Crop a wide band from the densest mechanical region (chosen by eye after comparing three
#    candidate Y-offsets — this one captures the switchboard/gauges on the left, the full
#    turbine housing through the middle, and the motor coupling/vents on the right, with no
#    empty wall or sky either side)
convert resized.png -crop 2400x480+0+700 +repage crop-grey.png

# 3. Light contrast boost
convert crop-grey.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    all tried — this source is smooth painted metal, not high-frequency texture, so even q85
#    landed well under budget and was kept for maximum detail)
convert hero-faded.png -quality 85 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~68KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).
No blur pass was needed — file size stayed well under the ~150KB budget at the highest quality
setting tried.

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same `resized.png`
source used for the hero (same framing family, taller aspect, slightly different offset chosen
by eye to keep the switchboard, turbine, and motor coupling all in frame at the taller ratio):

```bash
convert resized.png -crop 1200x630+500+600 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~59KB.

## Why this approach

- No desaturation step was needed — the HAER source is already black-and-white, so it sits
  calmly against the site's blue/white/grey palette without any colour-processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
