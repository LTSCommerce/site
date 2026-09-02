# Source: hero.webp, og.jpg

## Provenance

- **Original work**: "Quartermaster 3rd Class Adalberto Fuentes, from Galveston, Texas, plots a
  course on a coastal chart in the chart room aboard the amphibious assault ship USS Nassau
  (LHA 4)" — a U.S. Navy photograph of a sailor's hands using navigational dividers to plot a
  fix on a paper nautical chart of the Gulf of Aden / Somalia-Yemen coast, taken during 5th
  Fleet operations.
- **Photographer**: Mass Communication Specialist Seaman Jonathan Pankau, U.S. Navy.
- **Source page**: <https://commons.wikimedia.org/wiki/File:US_Navy_100405-N-5712P-135_Quartermaster_3rd_Class_Adalberto_Fuentes,_from_Galveston,_Texas,_plots_a_course_on_a_coastal_chart_in_the_chart_room_aboard_the_amphibious_assault_ship_USS_Nassau_(LHA_4).jpg>
- **Direct file fetched**: <https://upload.wikimedia.org/wikipedia/commons/9/91/US_Navy_100405-N-5712P-135_Quartermaster_3rd_Class_Adalberto_Fuentes%2C_from_Galveston%2C_Texas%2C_plots_a_course_on_a_coastal_chart_in_the_chart_room_aboard_the_amphibious_assault_ship_USS_Nassau_%28LHA_4%29.jpg>
- **Original dimensions**: 4,126×2,618px JPEG, colour
- **Licence**: Public domain — "This file is a work of a sailor or employee of the U.S. Navy,
  taken or made as part of that person's official duties," a work of the U.S. federal
  government. Verified on the Wikimedia Commons file page at fetch time.
- **Date**: 5 April 2010
- **Fetched**: 2026-09-02

## Why this image

The article is about managing an LLM's limited context window: only so much fits in the working
window at once, so what's in view has to be deliberately curated rather than dumped in whole.
A navigator plotting a fix works the same way — not the whole atlas, one specific chart sheet
pulled for the leg being worked, with dividers precisely marking just the two points that matter
right now. The photograph was chosen over the alternatives it was compared against:

- **USS Lexington (CV-16) chart room, 1943** (Edward Steichen, HD-SN-99-02628, also public
  domain) — thematically on-title ("chart room") and a striking historical photo, but the frame
  is dominated by half a dozen headset-wearing sailors' faces and torsos; every 5:1 crop tried
  put a face or the back of a head front and centre, which reads as "photo of people," not "photo
  of a bounded curated workspace." Every existing hero image on this site (bridge trusses, gears)
  is object/environment-focused with no prominent faces — this photo broke that pattern for no
  strong enough thematic gain.
- **"Chart Room of the Albatross" (1883/1897, FMIB, U. Washington)** — genuinely public domain,
  but a low-resolution (758×677 / 1,438×1,103) halftone book reproduction (visible dot pattern)
  of what turned out to be a captain's cabin/desk, not an actual chart table with maps laid out.
  Too small to source a clean 2400px-wide crop from and the wrong subject on inspection.

This chart-plotting photograph fills the frame edge to edge with genuine content (coastline,
depth soundings, printed labels, plotted courses) rather than empty background, has no faces,
and is available at full resolution (4,126×2,618) for a clean crop.

## Processing recipe (reproducible — rerun to rebuild with new styling)

Requires ImageMagick 6 (`convert`, `identify`). Run from a scratch directory containing the
original fetched JPEG as `original.jpg`:

```bash
# 1. Resize to the target hero width
convert original.jpg -resize 2400x resized.png          # → 2400x1523

# 2. Hero crop: a wide band across both hands and the dividers mid-chart (chosen by eye —
#    the densest region of printed chart detail plus the actual plotting action, avoiding the
#    plainer open-water area in the chart's lower-right and the dark table edge at the top)
convert resized.png -crop 2400x480+0+450 +repage crop.png

# 3. Desaturate to greyscale, matching every other hero image on this site (keeps an arbitrary
#    source's colour palette — chart blues/creams here — from clashing with the site's own
#    blue/white/grey palette)
convert crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 crop-grey.png

# 4. Build a vertical alpha gradient: opaque top 55%, fade to transparent over the bottom 45%
#    (this hero sits at the very top of the page under the translucent nav, so only the bottom
#    edge — where it meets the article header — needs to fade)
convert -size 2400x264 xc:white opaque.png
convert -size 2400x216 gradient:white-black fade.png
convert opaque.png fade.png -append gradient-mask.png

# 5. Apply the gradient as the alpha channel (a photographic crop has no transparency of its
#    own to preserve, so a straight CopyOpacity replace is correct)
convert crop-grey.png gradient-mask.png -alpha off -compose CopyOpacity -composite hero-faded.png

# 6. Encode to WebP with alpha preserved (q85/78/70 compared — 91KB/63KB/51KB; q85 kept, no
#    blur pre-pass needed since the fine chart-line detail compressed cleanly without it, unlike
#    the stone-wall/gear-teeth sources used on other articles)
convert hero-faded.png -quality 85 -define webp:lossless=false hero.webp
```

Result: 2400×480px WebP, ~91KB, alpha channel intact (verified with
`identify -format "channels=%[channels] alpha=%A\n" hero.webp` → `channels=srgba alpha=True`).

### og.jpg — social card image

Social platforms composite `og:image`/`twitter:image` at roughly 1.91:1 and don't reliably
render transparency, so a separate, fully opaque asset at the conventional 1200×630 social-card
size is cropped from the same `resized.png` used for the hero (same source, different framing —
not a re-derivation of `hero.webp`):

```bash
# A tighter, taller crop centred on the hand/dividers/chart-label area — same subject family as
# the hero crop, adjusted for the taller 1200x630 aspect ratio
convert resized.png -crop 1200x630+700+300 +repage og-crop.png
convert og-crop.png -colorspace Gray -modulate 100,100,100 -brightness-contrast 5x10 og-grey.png
convert og-grey.png -quality 80 og.jpg
```

Result: 1200×630px JPEG, ~97KB. Wired in via the article's `heroImage.ogImage` field, which
`entry-server.tsx`/`prerender.mjs` use for that route's `og:image`/`twitter:image` meta tags
instead of falling back to the site-wide default.

## Why this approach

- Desaturation to greyscale matches every other hero image on this site (bridge trusses, gears)
  and keeps the source's original colour chart palette from clashing with the site's own
  blue/white/grey design.
- No blur-before-encode step was needed — unlike the stone-wall (component-driven-design) source,
  this chart's fine printed line/number detail compressed to well under the ~100–140KB usual
  range at q85 without any softening.
- The fade is baked into the image itself (a real alpha channel), not a CSS gradient overlay —
  one static asset, no extra paint layer.
- This hero renders at the very top of the page, behind the translucent site nav — only the
  bottom edge needed a fade, not the top, since the nav itself provides the top transition.
- To rebuild for new styling, rerun from the original JPEG with new crop offset/quality values —
  the source URL and licence above are exactly what's needed to refetch it from scratch if this
  processed copy is ever lost.
