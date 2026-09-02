# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Die in place" — HAER OHIO,18-CLEV,41-13, a black-and-white architectural
  documentation photograph of a forging die seated in the bed of the Mesta 50,000-ton closed-die
  forging press at the Alcoa Forging Division, 1600 Harvard Avenue, Cleveland, Cuyahoga County,
  Ohio. Historic American Engineering Record (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Die_in_place_-_Alcoa_Forging_Division,_Mesta_50,000-Ton_Closed_Die_Forging_Press,_1600_Harvard_Avenue,_Cleveland,_Cuyahoga_County,_OH_HAER_OHIO,18-CLEV,41-13.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/a/ad/Die_in_place_-_Alcoa_Forging_Division%2C_Mesta_50%2C000-Ton_Closed_Die_Forging_Press%2C_1600_Harvard_Avenue%2C_Cleveland%2C_Cuyahoga_County%2C_OH_HAER_OHIO%2C18-CLEV%2C41-13.tif>
- **Original dimensions**: 5,000×3,567px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties," a work of
  the U.S. federal government under 17 U.S.C. § 105. Verified on the Wikimedia Commons file page
  at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article's core idea is "define once, generate everywhere": one OpenAPI specification acts as
the master contract, and code generators mechanically reproduce it into many concrete client SDKs
and server stubs, each different, all derived from the same source of truth. A forging die is a
direct physical analogue of exactly that — a single machined master template (visibly tagged
"MOD 17FM" in this photograph, an actual identifier stamped on the physical artefact, much like a
spec version) seated in a press and used to stamp out many identical parts. It's a more literal
fit than an abstract "many gears" or "many copies" image, without being a screenshot of code or a
diagram.

Other candidates considered from the same HAER series (`Category:Forging presses` on Commons,
also all public domain via the same NPS/HAER provenance): "South elevation of Mesta Press, looking
north" (HAER OHIO,18-CLEV,41-3) — a striking wide shot of the press towers themselves, but reads
as "big machine" rather than "one template, many instances"; "Die being inserted into east side of
Press" (HAER OHIO,18-CLEV,41-6) — thematically as strong, but shot in portrait orientation
(3,582×5,000px), a poor fit for a 5:1 hero crop. "Die in place" was chosen over both for combining
the strongest thematic fit with a landscape-leaning frame (5,000×3,567px) that's dense with
mechanical detail edge to edge.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif` (here: `die-in-place.tif`):

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # → 2400x1712

# 2. Hero crop: a wide band through the die block itself — columns either side, the die's
#    "MOD 17FM" tag legible centre-frame, factory floor visible through the gap behind it
#    (offset chosen by eye after comparing several bands up and down the frame)
convert resized.png -crop 2400x480+0+560 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 3. Light blur BEFORE encoding — this source's cast-iron/rust surface texture is dense
#    high-frequency noise that WebP compresses poorly (unblurred: ~189KB at q78, ~156KB even
#    at q70). A small blur cuts size by roughly 50% with no visible softness at on-page
#    display size — same finding as the gears image (component-driven-design article).
convert crop-grey.png -blur 0x0.6 crop-blurred.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the
#    bottom edge — where it meets the article header — needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white opaque-part.png
convert -size ${W}x${FADE_H} gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-blurred.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q85/78/70/60 compared on the blurred source; q70 chosen as the balance
#    of visible detail vs size — q60 saved another ~15KB with a barely perceptible further
#    softening, q78 added ~20KB for no visible extra detail at hero display size)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~90KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same `resized.png`
used for the hero (same framing family, not a re-derivation) — a taller crop of the same die
block and press columns, capturing more of the factory floor visible through the gap behind it:

```bash
convert resized.png -crop 1200x630+600+400 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 70 og.jpg
```

No blur was needed here — at 1200×630 (versus the hero's downscaled 2400×480 display width) the
same texture compresses acceptably without it (q78 unblurred: ~143KB; q70: ~118KB, the value
used).

Result: 1200×630px JPEG, ~115KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source is already greyscale.
- The blur-before-encode step is specific to this source's high-frequency cast-iron/rust
  texture, the same class of problem as the stone-wall texture in the gears image
  (component-driven-design article). Checked the unblurred file size first, only reached for
  the blur once it was clearly inflating the WebP well past the usual ~100–140KB range.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- The vertical "HAER No. OH-64-13" identification tag visible at the right edge of the frame is
  part of the original photographed scene (a physical HAER field marker placed in view of the
  camera), not a scan artefact or archival mat border — it was left in place rather than trimmed,
  consistent with how the host-action-bridge hero image handled the equivalent in-frame HAER
  marker.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality values —
  the source URL and licence above are exactly what's needed to refetch it from scratch if this
  processed copy is ever lost.
