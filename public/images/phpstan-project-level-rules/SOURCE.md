# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Tool Room Showing Tool Storage Area, View West" — HAER NY,15-BUF,41B-4, a
  black-and-white architectural/industrial documentation photograph of the tool room at Oldman
  Boiler Works' Office-Machine Shop, 32 Illinois Street, Buffalo, Erie County, New York.
  Photographed 1994 by Paul Maze for the Historic American Engineering Record (HAER), a National
  Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:TOOL_ROOM_SHOWING_TOOL_STORAGE_AREA._VIEW_WEST_-_Oldman_Boiler_Works,_Office-Machine_Shop,_32_Illinois_Street,_Buffalo,_Erie_County,_NY_HAER_NY,15-BUF,41B-4.tif>
- **Direct file fetched (3840px derivative thumbnail, used as working master)**: <https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/TOOL_ROOM_SHOWING_TOOL_STORAGE_AREA._VIEW_WEST_-_Oldman_Boiler_Works%2C_Office-Machine_Shop%2C_32_Illinois_Street%2C_Buffalo%2C_Erie_County%2C_NY_HAER_NY%2C15-BUF%2C41B-4.tif/lossy-page1-3840px-TOOL_ROOM_SHOWING_TOOL_STORAGE_AREA._VIEW_WEST_-_Oldman_Boiler_Works%2C_Office-Machine_Shop%2C_32_Illinois_Street%2C_Buffalo%2C_Erie_County%2C_NY_HAER_NY%2C15-BUF%2C41B-4.tif.jpg>
  (the full original is a 5,000×4,006px TIFF at
  <https://upload.wikimedia.org/wikipedia/commons/2/2d/TOOL_ROOM_SHOWING_TOOL_STORAGE_AREA._VIEW_WEST_-_Oldman_Boiler_Works%2C_Office-Machine_Shop%2C_32_Illinois_Street%2C_Buffalo%2C_Erie_County%2C_NY_HAER_NY%2C15-BUF%2C41B-4.tif>
  — the 3840px JPEG derivative was used instead to avoid downloading/decoding a 20MB TIFF, and is
  more than sufficient resolution for a 2400px-wide hero crop).
- **Original dimensions**: 5,000×4,006px TIFF (working derivative: 3,840×3,077px JPEG).
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties," a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about writing custom PHPStan rules that encode one project's own architectural
conventions — bespoke checks built for a specific codebase, not generic off-the-shelf analysis.
A machine shop tool room is the physical-world equivalent: shelves and labelled drawers full of
gauges, jigs, and fixtures, each one built or set aside for checking one specific part against
one specific standard, not a general-purpose instrument. This photograph was chosen over other
tool-room candidates because the frame is dense with that content edge to edge — a mesh-fronted
tool cabinet and lathe on the left, hanging clamps and wrenches, a full-height parts rack, and a
run of individually labelled drawer cabinets under a cluttered workbench with a mounted vice on
the right — rather than a shot dominated by open floor or a single isolated tool. It was already
black-and-white HAER documentation photography, so no desaturation artefacts to manage. The
image's own archival edge marking (a vertical "HAER NO. NY-272-B-4" strip printed into the
original photograph's border) was cropped out rather than left in the frame — see Step 1 below.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
fetched 3840px JPEG derivative as `original.jpg`:

```bash
# 1. Resize to slightly wider than the target hero width (2526px, not 2400px) — this leaves
#    enough margin to trim the archival edge-marking strip off the right side in step 2 while
#    still landing on exactly 2400px afterwards.
convert original.jpg -resize 2526x resized-wide.png   # -> 2526x2024

# 2. Trim the rightmost ~126px, which contains the vertical "HAER NO. NY-272-B-4" edge marking
#    printed into the original photograph's border, anchoring the crop to the left so nothing
#    else in the frame shifts.
convert resized-wide.png -gravity West -crop 2400x+0+0 +repage resized-trim.png   # -> 2400x2024

# 3. Crop a wide, content-dense band from the tool-storage region (chosen by eye — this band
#    holds the mesh cabinet/lathe, hanging clamps, parts rack, and the labelled drawer run with
#    the vice-topped workbench, all in frame; the offset avoids both the plain-ceiling upper
#    portion and the open-floor lower-middle portion of the shot).
convert resized-trim.png -crop 2400x480+0+1137 +repage crop-final.png

# 4. Light contrast boost (source was already black-and-white HAER documentation photography,
#    no -colorspace Gray needed).
convert crop-final.png -brightness-contrast 3x8 crop-grey.png

# 5. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the translucent nav, so only
#    the bottom edge — where it meets the article header — needs to fade).
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct).
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    all tried — 78 was the chosen balance: this is a texture-dense, high-detail source, and 78
#    kept the drawer labels and tool silhouettes legible while still landing comfortably under
#    the ~150KB budget; no pre-blur was needed to hit that budget).
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~103KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same trimmed source
used for the hero (`resized-trim.png` from step 2 above, not a re-derivation):

```bash
# Pick a crop that captures the same tool-room subject at the taller 1200x630 aspect ratio —
# this region centres the hanging-tool rack and the labelled drawer cabinets, offset by eye.
convert resized-trim.png -crop 1200x630+700+950 +repage og-test1.png
convert og-test1.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~117KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No further desaturation was needed — the HAER source photograph is already black-and-white, so
  it sits calmly against the site's blue/white/grey palette without any processing.
- The archival edge-marking strip in the original photograph's border was trimmed out (step 2)
  rather than left in frame — it reads as a distracting watermark-like element on a hero banner
  even though it's an authentic part of the original large-format print.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the 3840px JPEG derivative (or refetch the full 5000px
  TIFF from the direct file URL above) with new crop offset/quality values — the source URLs and
  licence above are exactly what's needed to refetch from scratch if this processed copy is ever
  lost.
