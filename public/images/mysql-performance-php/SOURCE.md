# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Interior, Model 14 Interlocking Machine" — HAER MD,4-BALT,145-4, a
  black-and-white architectural documentation photograph of the mechanical interlocking lever
  frame inside the Union Junction Interlocking Tower, Baltimore, Maryland (tower built c. 1910,
  part of the Pennsylvania Station rail complex). Photographed March 1983 by William E. Barrett
  for the Historic American Engineering Record (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:INTERIOR,_MODEL_14_INTERLOCKING_MACHINE_-_Union_Junction_Interlocking_Tower,_Bounded_by_Federal,_Guilford,_Royal_...,_Baltimore,_Independent_City,_MD_HAER_MD,4-BALT,145-4.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/7/75/INTERIOR%2C_MODEL_14_INTERLOCKING_MACHINE_-_Union_Junction_Interlocking_Tower%2C_Bounded_by_Federal%2C_Guilford%2C_Royal_...%2C_Baltimore%2C_Independent_City%2C_MD_HAER_MD%2C4-BALT%2C145-4.tif>
- **Original dimensions**: 4,992×4,026px TIFF, already greyscale, ~19.2MB
- **Licence**: "This image or media file contains material based on a work of a National Park
  Service employee, created as part of that person's official duties. As a work of the U.S.
  federal government, such work is in the public domain in the United States." Quoted verbatim
  from the Wikimedia Commons file page's Licensing section, verified at fetch time (not inferred
  from a search snippet).
- **Fetched**: 2026-09-02

## Why this image

The article is about MySQL performance tuning from a PHP application's perspective — indexing,
query optimisation, connection handling — i.e. routing a lookup to the right row fast rather
than raw processing power. `high-performance-php` (a different article on this site) already
used a steam turbine for a generic "performance" theme, so a mechanical-power image would have
collided thematically. A railway interlocking machine is a different, more precise fit: each
numbered lever routes traffic to one specific track, deterministically and quickly — a physical
analogue of an index routing a query straight to the matching row instead of scanning the whole
table. The numbered discs on the levers (76 through 84 in the full frame) even read as literal
"indexed" entries.

Candidates considered and rejected first: a pneumatic tube dispatch system and a library card
catalogue (both evoke "fast retrieval" but Commons search turned up no dense, wide, verifiably
PD/HAER photograph of either at the composition quality needed — mostly narrow single-object
shots or CC BY-SA under-documented uploads). This HAER interlocking-machine photograph was
chosen over other interlocking-tower candidates in the same Commons category because the camera
angle (looking down the length of the lever frame in perspective) already fills a wide frame
edge-to-edge with dense mechanical detail — no empty sky or wall either side — which is exactly
the composition failure mode the `article-image` skill's own lessons warn about avoiding.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to a working width with margin to spare for border-trimming and a later
#    shifted crop (the archival print has a black frame + a "HAER No. MD-50-4" label
#    burned into the top edge that needs removing — it's part of the print, not the
#    photographed subject)
convert original.tif -resize 2800x resized3.png                  # → 2800x2258

# 2. Trim the archival border: top label strip + thin black frame on all sides
#    (offsets chosen by eye against a viewed preview)
convert resized3.png -crop 2734x2103+34+123 +repage clean3.png   # → 2734x2103

# 3. Hero crop: a wide band across the lever bank, shifted right from a first attempt
#    that left ~10% empty dark space at the left edge — this offset instead fills the
#    frame completely edge-to-edge with levers and numbered discs (67 through 84 visible)
convert clean3.png -crop 2400x480+300+391 +repage hero-crop.png  # → 2400x480

# 4. Light contrast boost (source is already greyscale HAER documentation photography,
#    no -colorspace Gray desaturation needed)
convert hero-crop.png -brightness-contrast 3x8 crop-grey.png

# 5. Light blur BEFORE encoding — the machined-metal texture (polished lever balls,
#    engraved discs, cast ironwork) is high-frequency detail that WebP compresses very
#    poorly: unblurred landed at 131-245KB even down to q60. A small blur cut that by
#    roughly 25-30% with no visible softness at on-page display size.
convert crop-grey.png -blur 0x0.6 crop-blurred.png

# 6. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the translucent nav,
#    so only the bottom edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 7. Apply the gradient as the alpha channel (a photographic crop has no transparency
#    of its own to preserve, so a straight CopyOpacity replace is correct)
convert crop-blurred.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 8. Encode to WebP (q85/78/70/60 all tried on both blurred and unblurred source —
#    q70 on the blurred version was the chosen balance: comparable detail to q78
#    unblurred at roughly half the file size)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~99KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean3.png` source used for the hero (same framing family, taller aspect ratio):

```bash
convert clean3.png -crop 1200x630+400+300 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 72 og.jpg
```

Result: 1200×630px JPEG, ~132KB. No blur needed at this crop/quality — the smaller crop area
and JPEG's own block-based compression handled the same texture without the same size blowout
WebP had. Wired in via the article's `heroImage.ogImage` field, which `entry-server.tsx`/
`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags instead of falling
back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source is already black-and-white documentation
  photography, so it sits calmly against the site's blue/white/grey palette with no processing.
- The archival border/label trim (step 2) is specific to this source — a modern digitisation of
  a physical HAER print, unlike a plain digital-native photograph — and must be removed before
  any crop or it prints "HAER No. MD-50-4" across the top of the hero.
- The blur-before-encode step is source-specific (dense machined-metal texture), not a default —
  check the unblurred file size first; only reach for it if a source's texture is inflating the
  WebP beyond the usual ~100-140KB range, as documented in the `article-image` skill itself.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav, so only the
  bottom edge needed a fade, not the top.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality values —
  the source file's URL and licence above are exactly what's needed to refetch it from scratch if
  this processed copy is ever lost.
