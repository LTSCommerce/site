# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Golden Gate Bridge trusses" — HAER CA-31-14, a black-and-white
  architectural documentation photograph of the bridge's south trestle and truss structure
  near Fort Point, San Francisco. Photographed 1984 by Jet Lowe for the Historic American
  Engineering Record (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Golden_Gate_Bridge_trusses,_HAER_CA-31-14.jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/3/31/Golden_Gate_Bridge_trusses%2C_HAER_CA-31-14.jpg>
- **Original dimensions**: 4,646×3,250px JPEG
- **Licence**: Public domain — a work created by a National Park Service employee, a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article's title is literally "The Host-Action Bridge," so a real bridge photograph is a
direct, unforced fit rather than a metaphor stretch. This particular photograph was chosen over
other bridge candidates because the frame is already dense with structural content edge to
edge — diagonal truss bracing, girders, cross-bracing — rather than a wide shot dominated by sky
or water either side of a distant span. It was also already black-and-white HAER documentation
photography, so no desaturation artefacts to manage.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width
convert original.jpg -resize 2400x resized.png   # → 2400x1679

# 2. Crop a wide band from the densest truss/girder region (chosen by eye — the underside
#    diagonal bracing directly below the roadway, not the plain-sky upper portion or the
#    water-heavy lower portion)
convert resized.png -crop 2400x480+0+680 +repage crop-test1.png

# 3. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert crop-test1.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge — where it meets the article header — needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert \( -size ${W}x${OPAQUE_H} xc:white \) \( -size ${W}x${FADE_H} gradient:white-black \) -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q65/70/75/78/85
#    were all tried — 75 was the chosen balance of detail vs size for this particularly
#    detail-dense source)
convert hero-faded.png -quality 75 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~124KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same source:

```bash
convert resized.png -crop 1200x630+600+550 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 -quality 78 og.jpg
```

Result: 1200×630px JPEG, ~137KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No further desaturation was needed — the HAER source photograph is already black-and-white,
  so it sits calmly against the site's blue/white/grey palette without any processing.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
