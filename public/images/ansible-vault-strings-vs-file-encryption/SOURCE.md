# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Looking east, 1914 Diebold vault door, open" — HABS DC,WASH,587-153, a
  black-and-white architectural documentation photograph of the 1914 Diebold vault door at the
  City Post Office, 2 Massachusetts Avenue NE, Washington, D.C., shown swung open. The photo
  shows the door's internal locking mechanism (four visible drive gears and the bolt-work linkage
  on the door's inner face) plus the barred security gate and vault opening behind it. Historic
  American Buildings Survey (HABS), a National Park Service programme; documentation compiled
  after 1933.
- **Source page**: <https://commons.wikimedia.org/wiki/File:Looking_east,_1914_Diebold_vault_door,_open_-_City_Post_Office,_2_Massachusetts_Avenue,_Northwest,_Washington,_District_of_Columbia,_DC_HABS_DC,WASH,587-153.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/1/1c/Looking_east%2C_1914_Diebold_vault_door%2C_open_-_City_Post_Office%2C_2_Massachusetts_Avenue%2C_Northwest%2C_Washington%2C_District_of_Columbia%2C_DC_HABS_DC%2CWASH%2C587-153.tif>
- **Original dimensions**: 4,025×5,000px TIFF, already greyscale
- **Licence**: Public domain — "This image or media file contains material based on a work of a
  National Park Service employee, created as part of that person's official duties," a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article compares Ansible Vault's two encryption modes — encrypting a single string in place
vs. encrypting a whole file — so a real vault door's locking mechanism is a direct, literal fit
rather than a stretched metaphor. Two HABS candidates from the same City Post Office documentation
were compared first:

- **The closed-door view** (HABS DC,WASH,587-154) is a strong subject but a poor composition fit:
  the door is centred in a mostly-empty room with plain walls filling most of the frame either
  side, which is exactly the "small subject on a wide banner" problem this skill warns against.
- **This open-door view** (587-153) was chosen instead: swinging the door open exposes its inner
  face — four meshing drive gears, the bolt-work linkage, hinge barrel — directly beside the
  barred inner gate and vault opening. That fills a wide crop edge to edge with dense mechanical
  detail (gears interlocking, repeated vertical bars) instead of one door-shaped island in empty
  space, the same "content-dense band" criterion that worked for the two prior HAER hero images
  on this site.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to the target hero width
convert original.tif -resize 2400x resized.png                    # → 2400x2981

# 2. Trim the thin black archival photo-frame border (the physical print's edge, not the
#    photographed subject) with a fuzzy auto-trim
convert resized.png -fuzz 10% -trim +repage trimmed.png           # → 2366x2954

# 3. Hero crop: a wide band across the door's inner gear mechanism + hinge + barred gate,
#    picked by eye from the trimmed image, then scaled to the exact 2400x480 target (the trim
#    leaves the crop a few px short of 2400, so the final resize is a ~1% upscale, not a re-crop)
convert trimmed.png -crop 2150x480+100+860 +repage crop.png
convert crop.png -resize 2400x480! crop-scaled.png
convert crop-scaled.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav — only the bottom
#    edge, where it meets the article header, needs to fade)
convert -size 2400x264 xc:white opaque-part.png
convert -size 2400x216 gradient:white-black fade-part.png
convert opaque-part.png fade-part.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q60/70/78/85 were
#    all tried on the unblurred crop — file size stayed well under budget even at q85, ~80KB,
#    so no pre-encode blur was needed unlike the stone-textured gear-mesh hero; q78 chosen as
#    the same balance point used on the other two hero images on this site)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~54KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms (Slack, Twitter/X, LinkedIn, etc.) composite `og:image`/`twitter:image` at a
roughly 1.91:1 aspect ratio and don't reliably render alpha transparency, so the on-page hero
(5:1, alpha-faded) isn't usable directly as the link-preview image. `og.jpg` is a separate, fully
opaque asset at the conventional 1200×630 social-card size, cropped from the same trimmed source
— a taller crop centred on the same gear mechanism + hinge, extending far enough right to catch
the start of the barred gate:

```bash
convert trimmed.png -crop 1200x630+250+700 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~103KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step needed — the HABS source photograph is already greyscale.
- The fuzzy auto-trim before cropping removes the archival print's black border reliably without
  hand-picking exact pixel offsets — the same technique used on the gear-mesh hero image, just
  applied to a different border shape (this source's border was thin all round rather than one
  printed text label along an edge).
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets — the source
  URL and licence above are exactly what's needed to refetch it from scratch if this processed
  copy is ever lost.
