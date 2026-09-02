# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Card Division of the Library of Congress" — a documentary photograph of
  the Library of Congress's Card Division, Washington, D.C., showing staff sorting and filing
  catalog cards across long tables, with a wall of card-catalog drawer cabinets in the
  background. Photographer unknown. Library of Congress, Prints and Photographs Division,
  digital ID `cph.3c18631`.

- **Source page**: <https://commons.wikimedia.org/wiki/File:Card_Division_of_the_Library_of_Congress_3c18631u_original.jpg>

- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/f/f0/Card_Division_of_the_Library_of_Congress_3c18631u_original.jpg>

- **Original dimensions**: 4,096×3,266px JPEG, already greyscale

- **Licence**: Public domain — quoted verbatim from the file's own wikitext source
  (`?action=raw`, not just the rendered summary):

  ```
  == {{int:license-header}} ==
  {{PD-1923}}
  ```

  `{{PD-1923}}` on Commons resolves to: "This work is in the public domain in the United States
  because it was published (or registered with the U.S. Copyright Office) before January 1,
  1930." The page's own `{{Information}}` block dates the photo `{{otherdate|between|1900|1920}}`,
  author `{{unknown|author}}`, well inside that window.

- **Fetched**: 2026-09-02

## Why this image

The article is about Ansible fact caching going stale: cached facts about a host silently drift
out of sync with reality, `--limit` runs skip the hosts that would refresh them, and nobody
notices until a playbook acts on a record that no longer describes the thing it claims to
describe. A physical card-catalog operation is a direct, unforced match for that idea — a card
is only as good as the last time someone walked over and corrected it, and a room full of clerks
doing exactly that work, by hand, in enormous volume, reads immediately as "the sheer scale we
now try to automate around." It's a different subject entirely from `caching-vs-memoization`'s
NPS/HAER freezer-warehouse hero (dense pipe-frame racks), avoiding a repeated cold-storage motif
across the site.

Two earlier candidates were checked and rejected before this one:

1. `Photograph of Storage Boxes, Used in National Archives Stack Area` (DPLA/GSA, PD) — genuine
   public domain, but the actual photo (verified by fetching and viewing it, not by trusting the
   file-page description) turned out to be a single small archival print of one clerk with one
   box, mounted on a mostly-empty grey card — exactly the "small subject on a big empty
   background" anti-pattern this skill warns against. A WebFetch summary of the file page had
   described it as "wide rows of boxes filling the frame," which the actual pixels did not bear
   out — a reminder that Step 3 (actually look at the image) is not optional.
2. `Boxes of documents on repository shelving at The National Archives.jpg` — good composition,
   but it's The National Archives (Kew, UK), CC BY 3.0, not a US-federal public-domain work; a
   clean PD alternative existed, so this was passed over per the site's licence preference.

This Library of Congress photograph was chosen because the frame is already dense edge to edge —
rows of cards on tables receding into the distance, a full wall of catalog-drawer cabinets behind
them, several clerks mid-task — and it was already black-and-white archival photography at high
resolution (4,096×3,266), same as every other hero image on this site.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. The source is a scan of a mounted/matted archival print: white mat + black frame line
#    around the actual photograph. A first attempt at `-fuzz N% -trim` did not reliably remove
#    it (the mat/frame isn't a uniform rectangle at the scan's outer edge), so it was removed by
#    a manual crop inward, found by sampling pixel values at the image centre-column/row to
#    locate where the black frame line ends and real photo content begins, then widening the
#    margin until a preview showed no residual sliver of mat on any edge:
convert original.jpg -crop 3596x3036+250+150 +repage clean.png   # trims mat/frame from 4096x3266
convert clean.png -resize 2400x clean-resized.png                # → 2400x2026

# 2. Hero crop: a wide band starting near the top of the room — keeps the clerks at their desks
#    and the wall of catalog-drawer cabinets in view (context: "this is a card-filing operation"),
#    while the lower two-thirds of the band is already the dense card-covered tables. Chosen by
#    eye after comparing five candidate Y-offsets; this one also sits above a print-damage crack
#    running through the photo's upper-right quadrant, keeping the hero band clean of it.
convert clean-resized.png -crop 2400x480+0+650 +repage crop.png

# 3. Light contrast boost (source was already greyscale, no -colorspace Gray needed)
convert crop.png -brightness-contrast 3x8 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, linear fade to transparent over the
#    bottom 45% (this hero sits at the very top of the page under the nav, so only the
#    bottom edge — where it meets the article header — needs to fade)
W=2400; H=480
OPAQUE_H=$((H * 55 / 100)); FADE_H=$((H - OPAQUE_H))
convert -size ${W}x${OPAQUE_H} xc:white top-opaque.png
convert -size ${W}x${FADE_H} gradient:white-black bottom-fade.png
convert top-opaque.png bottom-fade.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved, quality-controlled for file size (q85/78/75/70/60 were
#    compared; the card-edge texture compressed cleanly enough that no pre-encode blur was
#    needed — q78 was the chosen balance of legible card/drawer detail vs. size)
convert hero-faded.png -quality 78 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~107KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

```bash
# A different crop from the same clean-resized.png, taller aspect ratio than the hero (1200x630
# vs 2400x480), positioned to keep both the drawer-cabinet wall and the card-covered tables
# in frame rather than just one or the other
convert clean-resized.png -crop 1200x630+600+500 +repage og-crop.png
convert og-crop.png -brightness-contrast 3x8 og-grey.png
convert og-grey.png -quality 72 og.jpg
```

Result: 1200×630px JPEG, ~123KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- No desaturation step was needed — the Library of Congress source is already black-and-white,
  so it sits calmly against the site's blue/white/grey palette with no colour-clash processing.
- The mat/frame removal step matters more here than on prior hero images: this source is a scan
  of a _mounted_ print (visible black frame line + white card mat), not a bare archival negative
  scan like the previous two HAER sources, so it needed an extra manual-crop step before the
  usual pipeline could start.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav (see
  `Navigation.tsx`'s `bg-white/45 hover:bg-white/90`) — only the bottom edge needed a fade, not
  the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality
  values — the original source file's URL and licence above are exactly what's needed to
  refetch it from scratch if this processed copy is ever lost.
