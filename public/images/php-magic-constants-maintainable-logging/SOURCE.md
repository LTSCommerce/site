# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Southwest identification plaque. View east" — HAER RI,4-ASH.V,2-16, a
  black-and-white architectural documentation photograph of the Ashton Viaduct (State Route 116 /
  Washington Highway, spanning the Blackstone River, Blackstone Canal, and the Providence and
  Worcester Railroad, Ashton, Providence County, RI). Shows the viaduct's cast identification
  plaque — "ASHTON VIADUCT 275" — mounted on the stone parapet pier alongside a junction/utility
  box. Photographed 1996 by Aaron Usher for the Historic American Engineering Record (HAER), a
  National Park Service programme; documentation team Samuel A. Engdahl, Mary Aifson, Edward
  Conners and Associates.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Southwest_identification_plaque._View_east_-_Ashton_Viaduct,_State_Route_116_(Washington_Highway)_spanning_Blackstone_River,_Blackstone_Canal,_and_Providence_and_Worcester_HAER_RI,4-ASH.V,2-16.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/7/75/Southwest_identification_plaque._View_east_-_Ashton_Viaduct%2C_State_Route_116_%28Washington_Highway%29_spanning_Blackstone_River%2C_Blackstone_Canal%2C_and_Providence_and_Worcester_HAER_RI%2C4-ASH.V%2C2-16.tif>
- **Original dimensions**: 5,203×4,180px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties" (a work of the
  U.S. federal government). Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about PHP's magic constants (`__CLASS__`, `__FUNCTION__`, `__LINE__`, etc.) —
values that identify _where_ a piece of code is, generated automatically rather than
hand-maintained, so the label can never drift out of sync with the thing it labels. A cast
identification plaque bolted to a structure — "ASHTON VIADUCT 275" — is a literal physical
instance of the same idea: a fixed, unambiguous, self-contained label naming exactly what it's
attached to and where. It was chosen over several other location-marker candidates:

- Boundary stones (District of Columbia) and a stand-alone "terminus stone" (Horseshoe Bend NMP)
  were considered first, but the only decent Commons candidates were individually-photographed and
  CC BY-SA (share-alike), which this site avoids in favour of clean public-domain sources — same
  reasoning as previous hero images here.
- Bare railway milepost signs turned up mostly as distant context in wider HAER bridge photos, not
  as a dense, frame-filling subject on their own.

This HAER photograph works because the plaque isn't isolated in empty space: the frame is already
dense edge to edge — weathered aggregate-concrete pier, a bolted utility box, gravel path,
roadside grass, and dark foliage — with the plaque sitting naturally within that texture rather
than centred on a blank background, and a diagonal sightline (path → parapet wall → pier) that
leads the eye toward it.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # -> 2400x1928

# 2. The HAER archival print has a black border with a vertical "HAER No. RI-U3-16" text label
#    printed along the left edge (transitions from black to page background at roughly x=90-100
#    at this width) and a second black border strip on the right (starts ~x=2352). Crop both away
#    by hand -- a -fuzz/-trim auto-trim does not remove them because the photo's own torn/rounded
#    mount corners defeat a simple bounding-box trim. Crop the clean interior, then hero crop:
convert resized.png -crop 2240x480+100+900 +repage -resize 2400x480\! hero-crop.png

# 3. Light contrast boost (source is already greyscale, no -colorspace Gray needed)
convert hero-crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Light blur BEFORE encoding -- the gravel/aggregate-concrete texture is high-frequency detail
#    that WebP compresses poorly (unblurred: ~146KB at q78; blurred: ~102KB at q78, same quality
#    setting, no visible softness at on-page display size -- same trade-off seen on the previous
#    stone-textured hero image for this site).
convert crop-grey.png -blur 0x0.6 crop-blurred.png

# 5. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the nav, so only the bottom edge -- where
#    it meets the article header -- needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency of its own
#    to preserve, so a straight CopyOpacity replace is correct)
convert crop-blurred.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 compared
#    on both the blurred and unblurred source -- q78 on the blurred source was the chosen balance)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~102KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` -> `channels=srgba alpha=True`).
The "ASHTON VIADUCT 275" plaque text sits within the opaque top 55% of the frame, so it stays
fully legible -- it is not affected by the bottom fade.

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render transparency, so the on-page hero (5:1,
alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully opaque
asset at the conventional 1200×630 social-card size, cropped from the same `resized.png` used for
the hero (same source, taller framing that shows more of the pier and coping stone above the
plaque):

```bash
convert resized.png -crop 1200x630+1100+650 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 75 og.jpg
```

Result: 1200×630px JPEG, ~143KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default. No blur was needed here — the taller crop and
JPEG's own DCT compression kept file size in range without it.

## Why this approach

- No desaturation step was needed — the HAER source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette without any processing.
- The blur-before-encode step is source-specific (gravel/aggregate-concrete texture), not a
  default — check the unblurred file size first, only reach for it if a source's texture inflates
  the WebP beyond the usual ~100-140KB range, as happened here.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay — one
  static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not the
  top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality values —
  the source URL and licence above are exactly what's needed to refetch it from scratch if this
  processed copy is ever lost.
