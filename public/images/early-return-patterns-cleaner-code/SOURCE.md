# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Fire escapes on apartment buildings in Soho, New York, New York" — a
  colour photograph from the Carol M. Highsmith Archive at the Library of Congress, showing
  multiple zigzagging cast-iron fire escapes descending several adjoining SoHo building
  facades (Library of Congress control number LCCN2011630656).
- **Source page**: <https://commons.wikimedia.org/wiki/File:Fire_escapes_on_apartment_buildings_in_Soho,_New_York,_New_York_LCCN2011630656.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/e/e8/Fire_escapes_on_apartment_buildings_in_Soho%2C_New_York%2C_New_York_LCCN2011630656.tif>
- **Photographer**: Carol M. Highsmith
- **Original dimensions**: 4,338×3,419px TIFF, colour, 16-bit sRGB
- **Date**: between 1980 and 2006
- **Licence**: "This work is from the Carol M. Highsmith Archive collection at the Library of
  Congress. According to the library, there are no known copyright restrictions on the use
  of this work." Highsmith donated her entire photographic archive to the Library of Congress
  with no copyright restrictions, and this designation is treated as public-domain-equivalent
  throughout Wikimedia Commons. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about early return patterns / guard clauses — bailing out of a function early
down a direct exit path instead of staying nested inside the main body of logic. A fire escape
is a literal early-exit mechanism bolted onto a building: several independent zigzag stairways,
each one a direct route out that bypasses the interior. This photograph was chosen over several
HAER railroad-switch/turnout candidates (Heber Creeper Railroad Line, Union Switch & Signal,
Riverside Junction Interlocking Tower) because every one of those was dominated by empty forest
canopy or sky around a single narrow track with no visible fork in frame — thematically closer
to the metaphor on paper, but compositionally exactly the "small subject on a big empty
background" failure this skill warns against. This SoHo fire-escape photograph is instead
already dense edge to edge: four separate diagonal staircases at different building facades,
each reading as its own distinct "exit route," which fits both the composition requirement and
the article's subject more directly than the alternatives that were checked.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # -> 2400x1892

# 2. Hero crop: a wide band across the densest run of diagonal fire-escape stairs (chosen by
#    eye after comparing offsets +550/+750/+950 — +750 put the most stairs, at the most
#    varied diagonal angles, fully in frame with only a small sliver of sky at the left edge)
convert resized.png -crop 2400x480+0+750 +repage crop.png

# 3. Desaturate toward greyscale — the source has a strongly saturated blue/red-brick colour
#    palette that would clash with the site's blue/white/grey palette
convert crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 crop-grey.png

# 4. Light blur BEFORE encoding — the wrought-iron fire-escape lattice is dense high-frequency
#    detail that WebP compresses poorly (unblurred: ~173KB even at q60). A small blur cut size
#    by roughly 35% with no visible softness at on-page display size.
convert crop-grey.png -blur 0x0.6 crop-blurred.png

# 5. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the
#    bottom edge — where it meets the article header — needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-blurred.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP (q55/60/65/70/75 compared on the blurred source — q70 chosen as the
#    balance of detail vs size; unblurred needed q60 just to reach 173KB, blurred q70 lands
#    comfortably lower with more visible detail retained)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~124KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized.png` used for the hero (a different offset chosen to centre the same main diagonal
staircase rather than re-deriving a fresh crop):

```bash
convert resized.png -crop 1200x630+700+600 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 og-grey.png
convert og-grey.png -blur 0x0.6 og-grey-blur.png   # same high-frequency-detail problem as the hero
convert og-grey-blur.png -quality 70 og.jpg
```

Result: 1200×630px JPEG, ~139KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- Desaturation matters here more than on the prior HAER hero images (Golden Gate Bridge
  trusses, Creque Marine Railway gears) because this source is a modern colour photograph with
  a genuinely saturated palette (deep blue-painted brick, red-and-white striped brick), not
  already black-and-white archival documentation.
- The blur-before-encode step is source-specific — the same high-frequency-detail problem noted
  in the component-driven-design article's stone-wall HAER source, here caused by the fine
  cross-hatched ironwork of the fire escapes rather than masonry texture.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality
  values — the source URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
