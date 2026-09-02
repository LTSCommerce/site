# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Multi-Casemate Arches Under Bastion" — HABS DE-24-30 (recorded under the
  Historic American Buildings Survey, a National Park Service programme; despite the "HABS"
  prefix in the file name, this is architectural/engineering documentation of Fort Delaware's
  masonry casemate vaulting). A black-and-white interior photograph of a receding row of brick
  barrel-vault arches under one of the fort's bastions, Pea Patch Island, Delaware City, New
  Castle County, Delaware.
- **Source page**: <https://commons.wikimedia.org/wiki/File:MULTI-CASEMATE_ARCHES_UNDER_BASTION_-_Fort_Delaware,_Pea_Patch_Island,_Delaware_City,_New_Castle_County,_DE_HABS_DEL,2-PEPIS,1-30.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/a/a1/MULTI-CASEMATE_ARCHES_UNDER_BASTION_-_Fort_Delaware%2C_Pea_Patch_Island%2C_Delaware_City%2C_New_Castle_County%2C_DE_HABS_DEL%2C2-PEPIS%2C1-30.tif>
- **Original dimensions**: 5,000×3,582px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties" (a work of
  the U.S. federal government). Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article's argument is that static analysis is a defensive layer built into the structure
before a failure happens, not a fix applied after — the title is literally "Defence Before Fix."
A fortification's own defensive masonry is a direct, unforced fit for that idea, and this
particular photograph was chosen over other Fort Delaware/bastion candidates because the frame
is already dense with structural content edge to edge — a row of brick barrel-vault arches
receding into depth, each one a repeated unit of the same defensive structure — rather than a
single isolated architectural detail with empty space around it. It was also already
black-and-white HABS/HAER-style documentation photography, so no desaturation artefacts to
manage. A wide hero crop through the archway row reads immediately as "layered defence," which
a single static wall photograph would not have.

The original file carries an archival print border (a black frame plus a vertical "HABS No.
DE-24-30 / KODAK" label strip along the left edge) that is part of the physical print, not the
photographed subject — this had to be manually cropped out before any hero/og derivation (see
step 2 below); an automatic `-fuzz`/`-trim` pass was tried first and only removed a few pixels of
padding, not the border or label strip, so the crop offsets were chosen by eye against a resized
preview.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero working width
convert original.tif -resize 2400x resized.png                # → 2400x1719

# 2. Remove the archival print border + "HABS No. DE-24-30 / KODAK" label strip along the left
#    edge (auto -fuzz/-trim only trimmed a few px of padding, not the border/label — manual crop
#    offsets chosen by eye against the resized preview)
convert resized.png -fuzz 10% -trim +repage trimmed.png       # → 2380x1697 (barely trimmed)
convert trimmed.png -crop 2120x1647+230+25 +repage clean.png  # manual crop past border+label
convert clean.png -resize 2400x clean-resized.png             # → 2400x1865

# 3. Hero crop: a wide band through the receding archway row (chosen by eye — this band shows
#    the arch openings and the depth/repetition of the vaulting, not just the plain ceiling
#    curve higher up the frame)
convert clean-resized.png -crop 2400x480+0+560 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q85/78/70/60 were all
#    tried — 70 was the chosen balance of detail vs size; no pre-encode blur was needed, this
#    source's brick texture compressed acceptably without it)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~115KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean-resized.png` used for the hero (same border-removed source, different framing — a taller
crop through the same archway to keep the arch's full depth visible rather than just its
uppermost curve):

```bash
convert clean-resized.png -crop 1200x630+300+520 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 75 og.jpg
```

Result: 1200×630px JPEG, ~127KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HABS/HAER source photograph is already black-and-white, so
  it sits calmly against the site's blue/white/grey palette without any processing.
- The archival print border and label strip are part of the scanned print, not the photographed
  subject, and had to be manually cropped out before either derivation — the automatic
  fuzz/trim pass alone was not sufficient (see "Why this image" above).
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality values —
  the source file's URL and licence above are exactly what's needed to refetch it from scratch
  if this processed copy is ever lost.
