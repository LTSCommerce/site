# sql-first-php hero image: provenance and processing

## Provenance

- **Work**: "Wooden Card Catalog Furniture". Close-up photograph of oak library card-catalogue
  drawers with brass label holders and pulls.
- **Author**: MarkBuckawicki (Wikimedia Commons user), own work
- **Source page**: https://commons.wikimedia.org/wiki/File:Wooden_Card_Catalog_Furniture.jpg
- **Direct file**: https://upload.wikimedia.org/wikipedia/commons/e/e8/Wooden_Card_Catalog_Furniture.jpg
- **Original dimensions**: 4032 x 3024, JPEG, sRGB
- **Licence**: "CC0" / "Creative Commons Zero, Public Domain Dedication" (from the file's
  Commons metadata, LicenseShortName and UsageTerms)
- **Fetched**: 2026-11-20

## hero.webp (2400 x 480, alpha fade baked in)

```bash
convert original.jpg -auto-orient -resize 2400x resized.png          # 2400x1800
convert resized.png -colorspace Gray -brightness-contrast 5x10 grey.png
convert grey.png -crop 2400x480+0+660 +repage crop.png
W=2400; H=480; OH=$((H*55/100)); FH=$((H-OH))
convert \( -size ${W}x${OH} xc:white \) \( -size ${W}x${FH} gradient:white-black \) -append mask.png
convert crop.png mask.png -alpha off -compose CopyOpacity -composite faded.png
convert faded.png -quality 78 -define webp:lossless=false hero.webp  # ~133KB
```

Quality was compared at 85 (174KB), 78 (133KB) and 70 (112KB). 78 was kept: the wood grain is
high-frequency texture, so 85 overshoots the ~150KB budget, and 70 starts to smear the grain.
No blur was needed.

## og.jpg (1200 x 630, opaque)

```bash
convert grey.png -crop 1200x630+600+580 +repage og-crop.png
convert og-crop.png -quality 72 og.jpg                                # ~129KB
```

## Why this approach

- **Subject**: rows of identical, labelled drawers stand for the article's theme: every query
  in its own named place, column names written down once, everything findable by label.
- **Composition**: the close-up fills the frame edge to edge, so a 5:1 band stays dense, with
  no small subject floating in empty space.
- **Greyscale**: so the oak tones don't clash with the site's blue/neutral palette. It also
  matches the other photographic heroes.
- **Crop offset +660**: puts one full row of label holders and pulls in the opaque top 55%.
  The keyholes fall into the fade.
- **og crop**: one full drawer, centred right, at the 1.91:1 social-card ratio.
