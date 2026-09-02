# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Radial Gate Operating Mechanisms and Spillway Bridge, Looking West" —
  HAER WA-79-B-2, a black-and-white architectural documentation photograph of the radial-gate
  hoist mechanism and spillway walkway at Kachess Dam's 1936 spillway, Kachess River, Easton,
  Kittitas County, Washington. Historic American Engineering Record (HAER), a National Park
  Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:RADIAL_GATE_OPERATING_MECHANISMS_AND_SPILLWAY_BRIDGE,_LOOKING_WEST_-_Kachess_Dam,_1936_Spillway_and_Radial_Gates,_Kachess_River,_1.5_miles_north_of_Interstate_90_,_Easton,_Kittitas_HAER_WA-79-B-2.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/1/19/RADIAL_GATE_OPERATING_MECHANISMS_AND_SPILLWAY_BRIDGE%2C_LOOKING_WEST_-_Kachess_Dam%2C_1936_Spillway_and_Radial_Gates%2C_Kachess_River%2C_1.5_miles_north_of_Interstate_90_%2C_Easton%2C_Kittitas_HAER_WA-79-B-2.tif>
- **Original dimensions**: 5,487×4,359px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties," a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article covers defensive programming: guarding against bad input and unexpected state
before they cause damage, not patching failures after the fact. A dam spillway's radial gate is
the physical embodiment of that idea — engineered specifically to safely discharge water the
system wasn't built to hold, i.e. a guard mechanism for the exceptional case, not the normal
one. It was picked deliberately over another fortification/defensive-structure photo: the
`defence-before-fix-static-analysis` article already used a Fort Delaware casemate-arches theme,
and this site avoids two articles sharing a visual theme. This particular HAER photograph was
chosen over the other Kachess Dam candidates (a distant spillway-channel view, a raised-gate
view from upstream) because the gate's hoist mechanism — cast housing, three bolted end-caps
in a row, drum wheel — fills the lower-right of the frame edge to edge while the walkway,
railings and shadow lines fill the rest, giving a wide, content-dense band rather than a small
subject on empty background.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to a working width, then remove the HAER archival photo-frame border (black
#    border + a vertical "HAER No. WA-79-B-2" text label along the right edge — both are
#    part of the archival print, not the photographed subject)
convert original.tif -resize 2400x resized-raw.png             # -> 2400x1907
convert resized-raw.png -fuzz 10% -trim +repage trimmed.png    # partial auto-trim, -> 2327x1843
convert trimmed.png -crop 2000x1600+120+110 +repage clean.png  # manual crop of the rest, border-free
convert clean.png -resize 2400x clean-resized.png              # -> 2400x1920

# 2. Hero crop: a wide band across the gate hoist mechanism, walkway and railings (chosen by
#    eye — this offset keeps the mechanism's cast housing and bolted end-caps filling the
#    right two-thirds of frame while the walkway/shadow lines fill the left third, rather than
#    isolating the mechanism alone or drifting into the empty-sky upper portion)
convert clean-resized.png -crop 2400x480+0+780 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# No blur needed — this source has no dense high-frequency texture (unlike a stone-wall
# source used previously); unblurred q78 landed at ~68KB with no fade applied yet, well under
# the ~150KB ceiling, so the blur-before-encode step was skipped.

# 3. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 4. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 5. Encode to WebP with alpha preserved, quality-controlled for file size (q90/85/80/75 were
#    compared: 135KB/99KB/77KB/61KB — q85 chosen as the balance of visible mechanical detail
#    (bolt heads, gear housing rivets) against file size, comfortably inside the usual
#    ~100-140KB range)
convert hero-faded.png -quality 85 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~97KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean-resized.png` used for the hero (same source, taller framing — captures the railing
lattice plus the mechanism's near end, not just a repeat of the hero band):

```bash
convert clean-resized.png -crop 1200x630+700+600 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~88KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed beyond a light contrast boost — the HAER source is already
  greyscale, so it sits calmly against the site's blue/white/grey palette with no processing to
  bring it into line.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality
  values — the source URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
