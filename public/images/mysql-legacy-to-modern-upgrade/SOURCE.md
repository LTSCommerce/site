# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "View of vault door" — HABS PA-6663-21, a black-and-white architectural
  documentation photograph of the walk-in vault door at the PSFS Building (Philadelphia Saving
  Fund Society Building), Walnut and Seventh Streets, Philadelphia, PA. Historic American
  Buildings Survey (HABS), a National Park Service programme. Photographer: Joseph Elliott;
  transmitted by Virginia Barrett Price. Documentation compiled after 1933.
- **Source page**: <https://commons.wikimedia.org/wiki/File:PSFS_Building,_Walnut_and_Seventh_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA-6663-21.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/a/a2/PSFS_Building%2C_Walnut_and_Seventh_Streets%2C_Philadelphia%2C_Philadelphia_County%2C_PA_HABS_PA-6663-21.tif>
- **Original dimensions**: 5,421×4,333px TIFF, 8-bit greyscale, 1,000 dpi
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties," a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article covers upgrading a legacy MySQL database from MyISAM (no transactions, no real
foreign key enforcement, table-level locking, no crash recovery) to MySQL 8.4 with InnoDB —
the pitch is stronger data integrity, real constraint enforcement, and modern security controls.
A bank vault door is a direct, unforced visual match for that: a purpose-built mechanism whose
entire job is guaranteeing integrity, not a stretched metaphor. It was chosen over the
`legacy-php-modernization` article's ship-in-dry-dock theme (a different subject: incremental
structural upgrade of something already sound) and over an archive-stacks theme (closer to
"storage capacity" than to "integrity/constraints", which is the article's actual emphasis).

Two frames from the same HABS survey were considered:

- **PA-6663-21** (chosen): the vault door photographed square-on and closed — the circular door
  face fills the frame edge to edge, with the crossed diagonal bolt-throw bars forming a strong
  X across a central combination wheel. Dense mechanical detail (hinge knuckles, bolt heads,
  the wheel's spoke casting) at every point in the frame, exactly the composition this skill's
  own guidance asks for over a small isolated subject on empty background.
- **PA-6663-22** (rejected): looking _through_ the open vault door into the vault chamber beyond,
  showing older inner doors nested behind it. Thematically tempting (old system encased inside
  the new one) but the corridor framing leaves a large flat, empty middle distance — reads thin
  at hero-banner proportions, the opposite of what -21 gives for free.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original21.tif`:

```bash
# 1. Resize to the target hero width
convert original21.tif -resize 2400x resized21.png                # → 2400x1918

# 2. Remove the HABS archival print border (black frame edge + a vertical "HABS ID PA..." text
#    label printed along the right margin — both are part of the archival print, not the
#    photographed vault). Auto-trim gets most of the outer black border; a manual crop removes
#    the residual thin border and the HABS text strip on the right.
convert resized21.png -fuzz 8% -trim +repage trimmed21.png        # → 2311x1825
convert trimmed21.png -crop 2180x1790+20+15 +repage clean21.png   # manual crop of the rest
convert clean21.png -resize 2400x clean21-resized.png             # → 2400x1971

# 3. Hero crop: a wide band across the vault door face, centred on the combination wheel where
#    the four diagonal bolt-throw bars cross (offset chosen by eye after comparing y=850/950/1050)
convert clean21-resized.png -crop 2400x480+0+950 +repage crop.png

# 4. Light contrast boost (source is archival greyscale TIFF, already near-neutral — no
#    -colorspace Gray needed)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 5. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 6. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 7. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    compared — 78 was the chosen balance of mechanical detail vs size; no blur-before-encode
#    was needed, this source isn't high-frequency-textured the way rough stone/foliage is)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~41KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate,
fully opaque asset at the conventional 1200×630 social-card size, cropped from the same
`clean21-resized.png` used for the hero (same framing family, taller aspect, centred tighter on
the combination wheel and lock mechanism than the wide hero band):

```bash
convert clean21-resized.png -crop 1200x630+450+785 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~68KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed — the HABS source is already a neutral greyscale archival
  scan, so only a light contrast boost was applied.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- The archival print border and HABS text label are cropped out before any hero/og derivation —
  they're an artefact of the 1930s-survey print process, not part of the photographed subject,
  and would otherwise show up as a stray black strip or backwards text in the final crop.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
