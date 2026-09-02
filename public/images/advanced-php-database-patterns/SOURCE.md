# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Telephone switchboard, c. 1949, Western Electric" — an exhibit at the
  Museum of Science and Industry, Chicago, Illinois, USA. A manual PBX switchboard panel with
  jack fields, numbered line/extension labels, and patch cords.
- **Photographer**: Daderot, photographed 2014-08-22.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Telephone_switchboard,_c._1949,_Western_Electric_-_Museum_of_Science_and_Industry_(Chicago)_-_DSC06823.JPG>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/8/89/Telephone_switchboard%2C_c._1949%2C_Western_Electric_-_Museum_of_Science_and_Industry_%28Chicago%29_-_DSC06823.JPG>
- **Original dimensions**: 3,562×5,246px JPEG
- **Licence**: "This file is made available under the Creative Commons CC0 1.0 Universal Public
  Domain Dedication." Verified on the Wikimedia Commons file page at fetch time (the uploader,
  Daderot, releases the bulk of their museum-exhibit photography as CC0).
- **Fetched**: 2026-09-02

## Why this image

The article covers direct PDO/MySQL access patterns as a deliberate alternative to ORM
abstraction: retry mechanisms for dropped connections, bulk operations, statement caching,
and manually-managed query classes — the recurring theme is manual, explicit routing and
connection handling instead of a framework doing it invisibly. A manual telephone switchboard
is a literal historical instance of exactly that idea: an operator plugs a physical patch cord
into a numbered jack to route a specific connection by hand, the same trade-off the article
argues for at the database layer (control and performance over convenience). It was chosen over
a card-catalogue candidate (also considered, but only available at 1,632×1,224px — too low-res
to upscale cleanly to a 2,400px-wide hero) because this source is both on-theme and very high
resolution, and the frame is already dense edge to edge with jack rows, numbered labels, and
patch cords rather than a wide shot with empty space either side.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width
convert original.jpg -resize 2400x resized.png   # → 2400x3535

# 2. Hero crop: a full-width band across the densest jack-row/patch-cord region (chosen by eye
#    after comparing y-offsets 750/950/1100 — 950 was the best balance of jack labels and
#    diagonal cords crossing the frame, without cropping into the wooden desk below or the
#    empty cubby holes above)
convert resized.png -crop 2400x480+0+950 +repage crop.png

# 3. Desaturate toward greyscale (source is a colour photo — brownish wood/metal, reddish
#    cords — that would clash with the site's blue/white/grey palette) and a light contrast
#    boost
convert crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert \( -size ${W}x${OPAQUE_H} xc:white \) \( -size ${W}x${FADE_H} gradient:white-black \) -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q90/85/78/70/60 compared — q70 was the chosen balance: still crisp enough
#    to read the jack-row numbers at on-page display size, well under the ~140KB ceiling, no
#    blur pass needed since this source isn't high-frequency stone/foliage texture)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~95KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`resized.png` (a taller crop than the hero, centred slightly lower to keep more jack rows and
patch cords in frame at the taller aspect ratio):

```bash
convert resized.png -crop 1200x630+600+1000 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~130KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- Desaturation is needed here (unlike the HAER bridge/gears heroes on this site) because this
  source is a genuine colour photograph, not archival black-and-white documentation photography.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
