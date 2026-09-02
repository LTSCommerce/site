# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Turbine Hall, View East to West" — HAER PA,23-CHES,2-64, a black-and-white
  architectural documentation photograph of the turbine hall at the Delaware County Electric
  Company's Chester Station (later Chester Waterside Station of the Philadelphia Electric
  Company), Chester, Delaware County, PA. The photo shows the row of turbine-generator units
  (the file's own title notes it is a horizontal duplicate of companion photo HAER PA-505-63,
  which shows the same row as a vertical/portrait frame). Photographed by Jack E. Boucher for
  the Historic American Engineering Record (HAER), a National Park Service programme;
  documentation compiled after 1968.
- **Source page**: <https://commons.wikimedia.org/wiki/File:TURBINE_HALL,_VIEW_EAST_TO_WEST_(NOTE-_DUPLICATE_OF_HAER_No._PA-505-63,_EXCEPT_HORIZONTAL)_-_Delaware_County_Electric_Company,_Chester_Station,_Delaware_River_at_South_end_of_Ward_HAER_PA,23-CHES,2-64.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/f/f3/TURBINE_HALL%2C_VIEW_EAST_TO_WEST_%28NOTE-_DUPLICATE_OF_HAER_No._PA-505-63%2C_EXCEPT_HORIZONTAL%29_-_Delaware_County_Electric_Company%2C_Chester_Station%2C_Delaware_River_at_South_end_of_Ward_HAER_PA%2C23-CHES%2C2-64.tif>
- **Original dimensions**: 5,000×3,580px TIFF, already 8-bit grayscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties. As a work of
  the U.S. federal government, such work is in the public domain in the United States." Verified
  on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article covers using Ansible to provision and manage PHP server infrastructure at scale —
the point is repeatable, identical configuration applied uniformly across a fleet of machines,
not any single server. This turbine hall photograph shows exactly that shape of subject: a row
of nominally-identical generating units (turbines 1, 2, 3, 5 visible, unit 6 through the window),
each built to the same specification and operated as one coordinated fleet — a direct visual
analogue for "the same playbook applied identically across every host," without literally
depicting a server room (which risked colliding with the other Ansible articles' themes).

Two other Ansible articles on this site already used a bank-vault-door image
(`ansible-vault-strings-vs-file-encryption`) and a library card-catalog image
(`ansible-fact-caching-problems`); `fedora-desktop-automation-ansible` used a workstation theme.
Industrial power-plant machinery is a distinctly different visual register from all three, while
still reading as "infrastructure" rather than an unrelated metaphor stretch.

This particular photograph (the `-64` horizontal duplicate) was chosen over its companion
`-63` (same shot, portrait orientation, 3,606×5,000px) specifically because the horizontal frame
is what a wide hero banner needs — the vertical original would have forced either a much tighter
crop or letterboxing. The frame is dense with mechanical detail edge to edge: turbine casings,
piping, catwalks, and the hall's own coffered ceiling in the background, rather than a shot
dominated by empty floor or wall.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png   # → 2400x1718

# 2. Hero crop: a wide band across the turbine row (chosen by eye after comparing crops at
#    y+960, y+1100, y+1238 — y+960 keeps the fullest run of turbine casings in frame without
#    cropping into the ceiling or losing the catwalk/pipework in the left foreground)
convert resized.png -crop 2400x480+0+960 +repage crop-test1.png

# 3. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert crop-test1.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white top-opaque.png
convert -size 2400x216 gradient:white-black bottom-fade.png
convert top-opaque.png bottom-fade.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q65/72/78/85 were
#    all compared — 94KB/103KB/124KB/171KB respectively; q72 chosen as the balance of detail
#    vs size, no blur-before-encode needed since this source's texture compressed cleanly)
convert hero-faded.png -quality 72 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~104KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

```bash
# A different crop from the same resized.png — centred further left/up than the hero crop so
# the frame includes more of the turbine row plus the catwalk and instrument panels in the
# foreground, at the taller 1200x630 aspect ratio
convert resized.png -crop 1200x630+600+850 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-final.png
convert og-final.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~134KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HAER source photograph is already black-and-white, so it
  sits calmly against the site's blue/white/grey palette with only a mild contrast boost.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav, so only the
  bottom edge needed a fade, not the top.
- No blur-before-encode was needed — despite the dense mechanical texture, the unblurred WebP
  landed well within the usual ~100–140KB range at q72, unlike the stone-wall-textured source
  used for `component-driven-design-react-typescript-storybook`.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
