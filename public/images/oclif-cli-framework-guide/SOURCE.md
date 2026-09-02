# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Main Control Room, Panels West of Main Control Area, Looking North (Location Q)"
  — HAER PA,4-SHIP,1-28, a black-and-white architectural/engineering documentation photograph of
  the main control room instrument and switch panels at the Shippingport Atomic Power Station,
  the first large-scale nuclear power plant in the United States built solely for electricity
  generation. Photographed for the Historic American Engineering Record (HAER), a National Park
  Service programme, by Dick Prehl, Dave Vandeveer and Jack Lever.
- **Source page**: <https://commons.wikimedia.org/wiki/File:MAIN_CONTROL_ROOM,_PANELS_WEST_OF_MAIN_CONTROL_AREA,_LOOKING_NORTH_(LOCATION_Q)_-_Shippingport_Atomic_Power_Station,_On_Ohio_River,_25_miles_Northwest_of_Pittsburgh,_Shippingport,_HAER_PA,4-SHIP,1-28.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/6/6b/MAIN_CONTROL_ROOM%2C_PANELS_WEST_OF_MAIN_CONTROL_AREA%2C_LOOKING_NORTH_%28LOCATION_Q%29_-_Shippingport_Atomic_Power_Station%2C_On_Ohio_River%2C_25_miles_Northwest_of_Pittsburgh%2C_Shippingport%2C_HAER_PA%2C4-SHIP%2C1-28.tif>
- **Original dimensions**: 5,000×3,962px TIFF, 8-bit greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties" (a work of
  the U.S. federal government). Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article explains the oclif CLI framework — a system for exposing a large application as a
set of discrete, named commands invoked deliberately by an operator. A control room wall of
labelled switch and instrument panels is a literal, unforced visual match for that idea: rows of
individually labelled controls (`INPUT FUSES`, `OUTPUT VOLTAGE TEST POINTS`, `ALARM`), each one a
single named action into a larger system, exactly like a CLI's command list. It was chosen over
several other control-panel/control-cab candidates (a Golden-Gate-style structural shot doesn't
apply here; ship engine-order-telegraph photos on Commons were either too small/isolated a
subject or not clearly PD; locomotive cab interiors were mostly non-PD amateur photography) because
this HAER photograph is dense with labelled control hardware edge to edge — no empty walls, no
isolated small subject — and is unambiguous US-federal-work public domain, same footing as the
Golden Gate and Ouroboros hero images already on this site.

A companion "auxiliary control room" and a wider establishing shot of the same room (both also
HAER PA,4-SHIP,1-xx) were considered and rejected: the establishing shot has a large empty
foreground of bare concrete floor and only a narrow band of visible panelling, which reads as an
atmospheric room shot rather than a content-dense band once cropped to 5:1.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize slightly wider than the 2400px hero target (2520, not 2400) — the extra margin lets
#    the crop below exclude the "HAER NO. PA-81-58" archival caption text printed into the
#    right-hand margin of the original photograph itself, rather than resizing to exactly 2400
#    and keeping that text visible in the hero.
convert original.tif -resize 2520x resized_wide.png   # -> 2520x1997

# 2. Crop a wide, content-dense 2400x480 band from x=0 (left edge), y=700 — this band was chosen
#    by eye after comparing three candidate y-offsets (250/700/1150): y=700 is the one with dense
#    labelled panel hardware on BOTH the near-left wall and the receding right-hand wall, without
#    the corridor's bare-floor perspective (y=1150) or ceiling conduit clutter (y=250) dominating.
convert resized_wide.png -crop 2400x480+0+700 +repage cropB2.png

# 3. Light contrast boost (source is already greyscale HAER documentation photography, no
#    -colorspace Gray needed)
convert cropB2.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the bottom
#    45% (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/75/80/85 were
#    all tried — 54KB/61KB/65KB/82KB/111KB respectively; 80 was chosen as the best detail/size
#    balance for this source, comfortably under the ~150KB budget with no blur pass needed — the
#    source is smooth painted metal panelling, not the high-frequency texture that needs it)
convert hero-faded.png -quality 80 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~82KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized_wide.png` source used for the hero (same source, taller framing):

```bash
convert resized_wide.png -crop 1200x630+0+600 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~94KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No further desaturation was needed — the HAER source photograph is already greyscale, so it
  sits calmly against the site's blue/white/grey palette without any processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- The extra-wide 2520px intermediate resize (rather than resizing straight to 2400px) exists
  purely to push the archival "HAER NO. PA-81-58" caption text out of the visible crop — it is
  not needed for any other reason and can be dropped if a future crop deliberately wants that
  text visible (e.g. a narrower crop further left).
- To rebuild for new styling, rerun from the original TIFF with new crop offset/quality values —
  the original source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
