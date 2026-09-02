# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Detail of switches on West wall, plant switch house" — HABS NEV,2-BOUC,1B-18
  (survey number HABS NV-35-B), a black-and-white architectural documentation photograph of the
  three-phase knife-switch bank in the plant switch house at the Bureau of Mines Metallurgical
  Research Laboratory, Boulder City, Clark County, Nevada. Photographed 2007 by David G. De Vries
  for the Historic American Buildings Survey (HABS), a National Park Service programme (related
  survey work also credited to photographers Andy Pernick and Kelly Conner, Six Companies, Inc.).
- **Source page**: <https://commons.wikimedia.org/wiki/File:Detail_of_switches_on_West_wall,_plant_switch_house_-_Bureau_of_Mines_Metallurgical_Research_Laboratory,_Original_Building,_Date_Street_north_of_U.S._Highway_93,_Boulder_City,_HABS_NEV,2-BOUC,1B-18.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/c/cd/Detail_of_switches_on_West_wall%2C_plant_switch_house_-_Bureau_of_Mines_Metallurgical_Research_Laboratory%2C_Original_Building%2C_Date_Street_north_of_U.S._Highway_93%2C_Boulder_City%2C_HABS_NEV%2C2-BOUC%2C1B-18.tif>
- **Original dimensions**: 4,426×5,455px TIFF, 8-bit greyscale (~23MB)
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties. As a work of
  the U.S. federal government, such work is in the public domain in the United States." Verified
  on the Wikimedia Commons file page at fetch time.
- **Repository**: Library of Congress Prints and Photographs Division (LOC item
  <https://www.loc.gov/pictures/item/nv0269.photos.225804p>).
- **Fetched**: 2026-09-02

## Why this image

The article is about dependency inversion: high-level code depending on an abstraction rather
than a concrete implementation, so that concrete implementations become interchangeable behind a
stable interface. This photograph shows a bank of three near-identical knife-switch assemblies
(labelled A/B/C per phase, one bank per transformer/circuit — "BLDG 300", "396 KVA TRANSFORMER")
mounted on a shared bus structure: each switch is a standardised, individually swappable unit
plugged into the same physical/electrical interface as its neighbours, which is a fairly direct
visual analogue for interchangeable implementations conforming to one shared contract. It was
chosen over several literal railway-knuckle-coupler candidates (also considered — the coupling
metaphor is arguably even tighter) because every decent Commons candidate of a real coupler-in-use
photograph turned out to be CC BY or CC BY-SA (user-submitted modern railfan photography), not
public domain; this HABS photograph gave a comparably strong "standardised swap point" visual with
clean PD federal-work provenance and no attribution obligation, consistent with every other hero
image on this site. It's also already black-and-white archival documentation photography at very
high resolution, so no desaturation artefacts to manage, and the frame is dense with mechanical
detail (switch blades, porcelain insulators, mounting brackets, bus bars) edge to edge rather than
a small subject on empty background.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero working width
convert original.tif -resize 2400x resized.png   # -> 2400x2958

# 2. The HABS archival print has a black frame line + white paper margin around the actual
#    photo content (plus a printed "HABS No. NV-35-B-18  Kodak 400TMY" label strip above the
#    frame). Crop that out — bounds found by sampling pixel rows/columns for the
#    white-margin/black-frame/photo-content transitions, not a formula:
convert resized.png -crop 2210x2680+85+205 +repage clean3.png
convert clean3.png -resize 2400x clean3-resized.png   # -> 2400x2910

# 3. A thin residual border sliver remained at the very left/right edges after step 2 -
#    shave it off, then re-resize back to the working width:
convert clean3-resized.png -shave 40x0 clean4.png
convert clean4.png -resize 2400x clean4-resized.png   # -> 2400x3010

# 4. Hero crop: a wide band across the top switch/insulator row (chosen by eye - the densest,
#    most repetitive part of the frame, showing the full three-phase switch assembly with its
#    porcelain insulators and mounting hardware)
convert clean4-resized.png -crop 2400x480+0+150 +repage hero-crop.png

# 5. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert hero-crop.png -brightness-contrast 3x8 crop-grey.png

# 6. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge - where it meets the article header - needs to fade)
convert -size 2400x264 xc:white mask-top.png
convert -size 2400x216 gradient:white-black mask-bottom.png
convert mask-top.png mask-bottom.png -append gradient-mask.png

# 7. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 8. Encode to WebP with alpha preserved, quality-controlled for file size (q85/78/70 were
#    all tried - unblurred file sizes landed at 90KB/63KB/50KB respectively, comfortably under
#    the usual ~100-140KB range even at the top end, so no blur-before-encode step was needed;
#    q78 was the chosen balance of detail vs size)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~62KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` -> `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same cleaned source:

```bash
# A different crop from the same clean4-resized.png - centred lower and slightly right of the
# hero crop to capture two full switch panels (with their "A B C" phase labels and DANGER tags)
# rather than just the insulator row alone
convert clean4-resized.png -crop 1200x630+300+150 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~87KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HABS source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette without any processing.
- No blur-before-encode step was needed — even the highest quality tried (q85 unblurred, ~90KB)
  stayed comfortably under the usual size range for this source, unlike the stone-wall-textured
  gear photo used on another article's hero.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav — only the
  bottom edge needed a fade, not the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality values —
  the original source file's URL and licence above are exactly what's needed to refetch it from
  scratch if this processed copy is ever lost.
