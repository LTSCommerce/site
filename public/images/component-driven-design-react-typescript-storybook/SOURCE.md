# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Detail of Gears" — HAER VI,3-HASI,1-6, a black-and-white architectural
  documentation photograph of the meshing gear mechanism at the Creque Marine Railway,
  Charlotte Amalie, St. Thomas, U.S. Virgin Islands. Historic American Engineering Record
  (HAER), a National Park Service programme.
- **Source page**: <https://commons.wikimedia.org/wiki/File:DETAIL_OF_GEARS_-_Creque_Marine_Railway,_Charlotte_Amalie,_St._Thomas,_VI_HAER_VI,3-HASI,1-6.tif>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/b/bf/DETAIL_OF_GEARS_-_Creque_Marine_Railway%2C_Charlotte_Amalie%2C_St._Thomas%2C_VI_HAER_VI%2C3-HASI%2C1-6.tif>
- **Original dimensions**: 5,000×4,028px TIFF, already greyscale
- **Licence**: Public domain — a work created by a National Park Service employee, a work of
  the U.S. federal government. Verified on the Wikimedia Commons file page at fetch time.
- **Fetched**: 2026-09-02

## Why this image

The article is about component-driven design: independently-typed, reusable pieces that meet
at a defined interface. Two interlocking cast-iron gears — separate physical components, each
with its own defined tooth profile, working together only where they mesh — is a direct visual
match for that idea without being a literal screenshot of a UI or a code diagram. Considered and
rejected first: a printer's type case (visually apt, but the only decent Commons candidates were
CC BY-SA, i.e. share-alike, which would obligate a processed derivative under the same licence —
avoided in favour of a clean public-domain source, consistent with every other hero image on this
site). This HAER photograph was chosen because the frame already fills edge to edge with
mechanical + stone-wall texture, at very high original resolution.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched TIFF as `original.tif`:

```bash
# 1. Resize to a working width, then remove the HAER archival photo-frame border (black
#    border + a vertical "HAER..." text label printed along the right edge — both are part
#    of the archival print, not the photographed subject)
convert original.tif -resize 2400x resized.png                    # → 2400x1933
convert resized.png -fuzz 8% -trim +repage trimmed.png            # partial auto-trim
convert trimmed.png -crop 2260x1850+20+10 +repage clean.png       # manual crop of the rest
convert clean.png -resize 2400x clean-resized.png                 # → 2400x1965

# 2. Hero crop: a wide band across the gear-teeth ring (chosen by eye)
convert clean-resized.png -crop 2400x480+0+260 +repage crop.png
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 3. Light blur BEFORE encoding — the stone-wall texture is high-frequency noise that WebP
#    compresses very poorly (unblurred: ~220KB at q78; this source needed it, the previous
#    two hero images didn't). A small blur cuts size by roughly 40% with no visible softness
#    at on-page display size.
convert crop-grey.png -blur 0x0.6 crop-blurred.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert \( -size ${W}x${OPAQUE_H} xc:white \) \( -size ${W}x${FADE_H} gradient:white-black \) -append gradient-mask.png

# 5. Apply the gradient as the alpha channel
convert crop-blurred.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP (q70 chosen after q78/q70/q60/q55 comparisons — the blur step matters
#    far more for size than the quality number does on this particular source)
convert hero-faded.png -quality 70 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~134KB, alpha channel intact.

### og.jpg — social card image

```bash
# A different crop from the same clean-resized.png — centred on where both gears' teeth
# visibly interlock (a single-gear crop, tried first, read as static; showing the mesh point
# reads as two components meeting, which is the actual point of the image)
convert clean-resized.png -crop 1200x630+300+500 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-final.png
convert og-final.png -quality 72 og.jpg
```

Result: 1200×630px JPEG, ~134KB. Wired in via `heroImage.ogImage`.

## Why this approach

- No desaturation step needed — the HAER source is already greyscale.
- The blur-before-encode step is specific to this source's high-frequency stone texture; the
  first two hero images (corn snake, bridge trusses) didn't need it. Don't apply it by default —
  check the unblurred file size first, only reach for it if a source's texture is inflating the
  WebP beyond the usual ~100–140KB range.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay.
- To rebuild for new styling, rerun from the original TIFF with new crop offsets — the source
  URL and licence above are exactly what's needed to refetch it from scratch.
