# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Front view of pouring from -61 holding furnace at -02 station into three
  vertical molds submerged in a water-filled tank below the casting floor" — HAER NY,15-BUF,25-8,
  a black-and-white documentation photograph of a casting crew pouring molten brass alloy at the
  American Brass Foundry, 70 Sayre Street, Buffalo, Erie County, NY. Photographed 1986 by Jet Lowe
  for the Historic American Engineering Record (HAER), a National Park Service programme (the same
  photographer as the `host-action-bridge` hero image's Golden Gate Bridge truss photo).
- **Source page**: <https://commons.wikimedia.org/wiki/File:FRONT_VIEW_OF_POURING_FROM_-61_HOLDING_FURNACE_AT_-02_STATION_INTO_THREE_VERTICAL_MOLDS_SUBMERGED_IN_A_WATER-FILLED_TANK_BELOW_THE_CASTING_FLOOR._THE_CASTING_CREW%27S_JOBS_DURING_HAER_NY,15-BUF,25-8.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/5/5a/FRONT_VIEW_OF_POURING_FROM_-61_HOLDING_FURNACE_AT_-02_STATION_INTO_THREE_VERTICAL_MOLDS_SUBMERGED_IN_A_WATER-FILLED_TANK_BELOW_THE_CASTING_FLOOR._THE_CASTING_CREW%27S_JOBS_DURING_HAER_NY%2C15-BUF%2C25-8.tif>
- **Original dimensions**: 5,000×3,575px TIFF, already greyscale, 17.05 MB
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties. As a work of
  the U.S. federal government, such work is in the public domain in the United States." Verified
  on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article covers Fedora 42's new-edition features (KDE Plasma promoted to a full edition,
COSMIC introduced as a new desktop environment, a rebuilt installer). Rather than an OS-logo
cliché, the theme here is the moment a new release is actually produced: a casting crew pouring
molten brass into molds is a literal "producing a new edition" scene — bright, active, and dense
with process detail, not a static machine. Considered and rejected first: HAER printing-press
photographs (Commons has no genuinely public-domain HAER/NPS printing-press interior at the
needed resolution/composition; the closest candidates were either HABS building-interior shots
with a press as a minor background element, or later 20th-century commercial photography of
uncertain licence) and a generic gear/mechanism photo (already used for the
`component-driven-design-react-typescript-storybook` hero — would read as repetitive on the same
site). This photograph was chosen because the frame is already dense edge-to-edge — furnace,
pour stream, mold, two casting-crew workers, hydraulic press — and the glowing molten metal gives
it a genuine "breakthrough moment" visual charge the other HAER foundry candidates (static
machinery, empty rooms) didn't have.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to a working width, then remove the HAER archival photo-frame border (black border
#    plus a vertical "HAER No. NY-311-8" text label printed along the right edge — both are part
#    of the archival print, not the photographed subject)
convert original.tif -resize 2400x resized.png              # -> 2400x1716
convert resized.png -fuzz 8% -trim +repage trimmed.png      # partial auto-trim -> 2352x1685
convert trimmed.png -crop 2260x1685+0+0 +repage clean.png   # manual crop removes right-edge label
convert clean.png -resize 2400x clean-resized.png           # -> 2400x1789

# 2. Hero crop: a wide band across the furnace pour, mold, and both casting-crew workers
#    (chosen by eye after comparing offsets +680/+780/+880 — +780 centres the pour stream and
#    both workers without cropping into the furnace body above or the floor below)
convert clean-resized.png -crop 2400x480+0+780 +repage crop.png

# 3. Light contrast boost (source is already greyscale, no -colorspace Gray needed)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. No blur step needed — unblurred crop-grey.png encoded to WebP at q78 landed at 70KB (see
#    step 6), comfortably under the ~100-140KB range that triggers the blur-before-encode step.
#    The photo's own motion blur (long exposure on the moving casting crew) already suppresses
#    high-frequency noise that would otherwise inflate the WebP.

# 5. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the bottom
#    45% (this hero sits at the very top of the page under the nav, so only the bottom edge --
#    where it meets the article header -- needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP with alpha preserved, quality-controlled for file size (q85/78/72/65 were
#    compared: 99768 / 70314 / 59496 / 54574 bytes respectively -- q78 was chosen as the best
#    balance of detail vs size, well inside the usual ~100-140KB range)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~69KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` -> `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean-resized.png` used for the hero — same source, taller framing to include more of the
furnace body above the pour and more headroom around both workers:

```bash
convert clean-resized.png -crop 1200x630+650+680 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~94KB.

## Why this approach

- No desaturation step needed — the HAER source is already greyscale.
- No blur-before-encode needed for this source — see step 4 above; the photo's own long-exposure
  motion blur already keeps high-frequency detail (and therefore WebP size) low.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav — only the
  bottom edge needed a fade, not the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality values —
  the source URL and licence above are exactly what's needed to refetch it from scratch if this
  processed copy is ever lost.
