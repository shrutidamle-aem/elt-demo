# EDS conversion log — elt.eso.org

## Publish decision (2026-11-13)

Decision made by the run owner before the run: **publish**. Every delivered page, the redirects sheet and the
chrome documents (nav, footer and their locale variants) go live on the aem.live origin
(`deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`).

## C0 foundation (2026-11-13)

- Chrome: `blocks/header` (template-slotted from `/nav`, 6 sections; `/chile/nav` carries the Spanish menu
  and search strings — the /chile/ page needs `nav: /chile/nav` + `lang: es-cl` metadata), `blocks/footer`
  (from `/footer`; the year is computed like the source's inline script, `@ew-exempt`). Footer is identical
  on /chile/, so there is no `/chile/footer`.
- `blocks/big-header` (foundation-owned hero frame, every page's first section). davids-model D1 🟡 on the
  test draft ("2-row prose block → default-content candidate") is justified: the block owns a fixed
  parallax image layer, the 46.875vw frame and the logo slot the header fills from `/nav` section 6 —
  not expressible as a section style.
- Decode tier: template-slotted (chrome + hero). Fonts: R-01 brand faces NOT shipped (licensed kit); metric-fitted
  local fallback faces (`styles/fonts.css`, Arial/Liberation Sans with size-adjust 96.8 / 100.7 / 97 / 93.5 %,
  caps 93.7 % for the header menu) render until a licensed drop-in; add-back path in `fonts/LICENSING.md`; icon fonts subset to the glyphs the archetypes use.
- Gate (shell `/drafts/foundation-shell` vs https://elt.eso.org/about/road/): crop-compare header 0.00 % /
  0.00 % (1440/360), footer 0.00 % (1440) / 2.78 % (360, sub-pixel vertical phase of the short shell: parity
  0 deltas, span rects equal ±0.02 px; re-verify on the first real page); chrome-parity 1440: 1 delta
  (language-message bounce phase, timing), 360: 0; chrome-compare: 0 errors at 1440, 1 at 360 = the
  search trigger `href="#"` resolving to the shell's own path (shell-path artifact).

## archetype-timeline — /about/timeline (block `timeline`)
- Decode tier: reconstructive (repeat group: 27 milestone rows, banner cell | year · title · text cell,
  classified by content). Rail = presentational clone of year + title (EW4, `@ew-exempt rail`).
- Prototype → block class renames (EDS section classes): `.timeline-container` → `.timeline-stage`,
  `.timeline` → `.timeline-column`. Linked milestones: the link rides the year (`<p><a><em>`), the
  card click follows it (source: whole-card `<a>`; classifier keeps year = CTA as on the prototype).
- Round-trip `--ew`: 0 structural 🔴, editable 81/81; 27 🟠 EXTRA = rail links (outside the
  prototype's `.timeline-section`, inside the block on EDS).

## archetype-instrument — /instrument/harmoni (blocks `page-intro`, `subpage-tiles`, `tech-table`; reuses `text-section`, `share-bar`, `big-header`)
- Decode tiers: `page-intro` template-slotted (banner picture → image; text rows by role: title, subtitle,
  description, last link row = quick links); `subpage-tiles` and `tech-table` reconstructive (one row per
  tile / property, cells classified by content). Titles/subtitles stay plain paragraphs (the source has
  divs/spans; an h2/h3 under the R-01 fallback face would read as a content-diff ROLE SWAP).
- Colour cells are palette words (`@variants`, EW5 metadata): tiles steel | teal | bronze | indigo | cobalt |
  rust | clay | slate | cyan (`<row> [<link>]` — the source's third tile links in steel); tech tabs red | amber
  | yellow | green | sky | cyan | orchid | violet | navy.
- In-page anchors: section-metadata `anchor | <id>` → `<a id class="anchor">` before the section
  (created by page-intro / subpage-tiles; the quick links and tiles target them).
- `text-section` (owner archetype-article, done) gained two variants, default rendering untouched:
  `intro` (echoes the page-intro subtitle/description below 992 px — presentational clones, EW4) and
  `row-styles` (one group per row + a style-word cell: subtitle | heading | float | contacts | right | left |
  narrow | medium | half | wide | reveal; floated figures with an in-flow clone below 992 px; captions;
  AOS fade-right reveal restored per progress.json captureState).
- Round-trip `--ew` (page-intro, subpage-tiles, tech-table): 0 structural 🔴, editable 24/33, exempt 9 (colour cells).

## archetype-landing — /index (blocks `home-tiles`, `webcam-panel`, `teaser-video`; reuses `carousel` + `big-header`)
- Decode tiers: `home-tiles` reconstructive (one row per tile: narrow image | wide image | title link, classified
  by content; card-as-link EW6, class `.menu-tile` kept for the `landing-menu-tiles` units family);
  `webcam-panel` and `teaser-video` template-slotted (rows by role). davids-model D1 🟡 on both is justified:
  `webcam-panel` loads the live panorama from an authored URL (dynamic-features row 2, media-as-url — rehosting
  would freeze the webcam) and lays the timestamp over it; `teaser-video` turns an authored MP4 link + poster into
  a `<video>` (video never rides content.da.live).
- `teaser-video` is a module the plan's catalog lacked (the home's teaser band); added for this template.
- `carousel` (owner archetype-facts, done) gained variant `science`, default rendering untouched: Swiper fade
  restored per progress.json captureState (900 ms cross-fade, 5 s autoplay restarting on interaction, loop,
  clickable bullets, prev/next); slide content = caption (first paragraph title, others subject).
- Teaser video: autoplay muted + controls restored; playback starts 3 s after window load (EDS delayed phase) (an eager 66 MB stream
  kept the page off network-idle: published-origin gate 1440 pub1 build probes timed out at page.goto).
- Media: 16 images rehosted to `media/index/` (ledger `stardust/deploy/media-ledger-landing.json`); webcam image
  stays on elt.eso.org; timestamp is a static snapshot (owner decision pending, dynamic-features row 2).
- Round-trip `--ew` (whole page): 0 structural 🔴, editable 24/25, exempt 1 (panorama URL link text).

## archetype-program — /telescope/dome (block `data-table`; reuses `page-intro`, `subpage-tiles`, `text-section`, `share-bar`, `big-header`)
- Decode tiers: `data-table` reconstructive (one row per fact, cells moved into `<td>` in order; the source's
  `.table.table-striped` fact table with its two `<p>&nbsp;</p>` spacers rendered as the block's top/bottom space).
- Template variants on reused blocks (owners done; default rendering untouched): `page-intro program`
  (subtitle/description 35%, d-xl / d-xxl tiers), `text-section intro program` (echo tiers one step up:
  below 1200 subtitle + text, 1200–1440 description as sub-title; echoed sub-title keeps the .page-section
  paragraph padding + 1rem margin), `subpage-tiles program` (2-up / trapezoid / Read More from 992, body keeps
  its 1rem top padding — source col-lg-6, d-lg-block).
- Enclosure section: text-section `bleed row-styles` → youtube widget (captureState restore: same nocookie
  iframe) → text-section `row-styles` (subtitle row) → data-table, one section, anchor `enclosurestruct`.
- Media: 7 images rehosted to `media/dome/` (ledger `stardust/deploy/media-ledger-program.json`); og image is the
  source's `screen/header-frontpage.jpg`.
- Round-trip `--ew`: 0 structural 🔴 (data-table 30/30, page-intro 5/5, subpage-tiles 4/6 + 2 exempt colour cells).
- Gate (preview, gate-all): 1440 7.36% Δh 32, 360 9.27% Δh 26, clip 0, presence 0/0, units PASS — Δh = one
  R-01 fallback line wrap per width (tile/heading/table cell text widths).

## archetype-listing — /telescope (block `overview-bands`; reuses `text-section`, `share-bar`, `big-header`)
- Decode tier: `overview-bands` reconstructive (one block per titled band; the row without an image is the title
  row — h2 + optional badge link whose text is the Material Icons ligature; every item row = image + "Read More"
  link + optional name link, classified by content). Variants: `wide` (white wide tiles, name beside the tab),
  `centered` (centred card labels), `tail` (2vw bottom space of the last band); default = cards. Columns from
  the item count (1–4). Trapezoid tabs are decorative inline svg built by the block (aria-hidden, tabindex -1).
- Band titles are authored `##` headings (source div): content-diff auto-accepts ROLE UPGRADE div→heading, as the
  gated prototype did; the share-bar authored in the first band's section docks in that band's title row.
- Unit hooks: the coordinator's units.json build selectors name the prototype's BEM classes
  (`.link-grid--4 > .card__image`, `.wide-tile__bar`); the block sets those classes beside the kebab-case
  ones it styles (stylelint selector-class-pattern), so the units family fits the EDS DOM unchanged.
- Text paragraphs are verbatim from the capture incl. the source's U+202F narrow no-break spaces (a first
  hand-typed copy without them wrapped one line longer at 1440 and one shorter at 360).
- Media: 12 images rehosted to `media/telescope/` (ledger `stardust/deploy/media-ledger-listing.json`).
- Round-trip `--ew` (whole page, mapped): 0 structural 🔴, editable 32/32. davids-model 🟡 D3 on overview-bands
  (title row 1 cell, item rows 2 cells — by design, rows classified by content).
- Published gate (gate-all): 1440 2.69 % Δh -1, 360 3.85 % Δh -1, clip 0, presence MISSING 0 / HIDDEN 0, units PASS.

## cluster-listing — /about, /mirror, /instrument, /science (archetype /telescope)
- `migrate.mjs render` refused all four (no sibling prototypes); the documents are encoded from the hydrated
  captures with the archetype's encoder (`stardust/.work/rollout/listing/encode-siblings.mjs`, input
  `probes/extract-siblings.mjs`): intro = share-bar + text-section (title row docks the share bar),
  youtube = default-content widget link, verbatim paragraphs (U+202F / nbsp kept), internal links root-relative,
  extensionless, lowercased.
- Variance probe (`variance/variance-1440.json`, exit 2): title / text / hero identical; the tile modules
  differ per sibling, budgeted as variants — no new block:
  - `overview-bands banners` (/instrument: instrument-landing banners — title, subtitle, description over a
    full-width image, outlined black tab + orange "Read More", light triangle on the first) and
    `banners mirror` (/mirror: mirror-landing type, 35 % column, description from 1200 px);
  - `overview-bands overlay` (/science: 2-up science-landing tiles from 992 px, white title, triangle on the grid);
  - `subpage-tiles about` (/about: the lightlinks rows of the instrument template — owner archetype-instrument,
    done; default untouched): 2-up from 1440 px, no body padding, text pb 3rem from 1440, link at top 72 %;
    palette words graphite | taupe | denim | umber | olive | sage | lilac added;
  - `text-section bleed narrow-image` (/instrument capabilities table, 80 %), `text-section bleed grey-pair`
    (new CSS-only variant: two linked images on the rgb(158 162 163) ground), `text-section y-2` (new
    CSS-only variant: the source's .container-y-2 2rem bottom space, /mirror and /instrument intros).
- Media: 38 images rehosted to `media/{about,mirror,instrument,science}/` (ledger media-ledger-listing.json).
- EW: ew-editability-probe 0 dead / 0 duplicated on overview-bands, text-section, share-bar; subpage-tiles on
  /about dead 9 = the colour-word cells (`@ew-exempt` metadata, as on /instrument/harmoni).
- Gate-all: 1440 about 2.39 / instrument 1.36 / science 1.48 / mirror 16.98 (FAIL, Δh +33: R-01 fallback line
  breaks — intro paragraph 1 one line shorter, banner descriptions; registered, not iterated); 360 about 7.55 /
  instrument 9.55 / science 5.86 / mirror 5.78. Presence MISSING 0 / HIDDEN 0, clip 0, units 0 off on all.

## cluster-program — 17 siblings (encoder `stardust/.work/rollout/program/encode-siblings.mjs`, archetype telescope-dome)
- Same blocks as the archetype; new words/variants (owners done, defaults untouched): subpage-tiles hex colour
  words (`#rrggbb`, the source's per-row grounds); text-section row-styles `quarter|third|large|xwide`, `flush`
  (.container-paragraph-right), `border`, `gap` (dropped trailing `<p>&nbsp;</p>`), multi-cell image rows (+ `inset`),
  `continued` (rest of a section after a widget/table), `h2-text` (.page-section h2 ramp); page-intro `quick-sm`;
  data-table `spec` (m2m3 comparison rows), `bordered` + `ao-modes` (adaptive optics modes table).
- Dropped: the adaptive-optics `.elt_ao_modal` lightbox (hidden). delivery-lint P1 one-cta-per-p on
  /telescope/adaptiveoptics is a prose paragraph (bold terms + 2 inline links), kept verbatim.
- Round 3 (final): documents re-encoded (encoder now emits block classes only — safe under the code
  live before a push): text-section `sup-metrics` where sub/sup occur, `snug-captions` (captioned
  two-image rows in a bare .m-0; captions paired with image columns by position), `grey-triptych`
  (m2m3 span.p-3 captions on grey/white), `row-images-full`, `spec-head` (m2m3 M2|M3 heading table),
  `plain-nutshell` (science nutshell outside .page-section: echo sub-title unpadded, Bootstrap h2),
  `h2-spaced` (source's empty h3/p around the h2), `empty-echo` (operations), AO nutshell one
  container per row; R-01 wrap fits `fit-s-*`/`fit-l-*` per block and `fitp<n>-…` per paragraph
  (fitted by probes/wrap-fit.mjs: line counts per paired paragraph); subpage-tiles `fit-s-*`.
  Block CSS: h2-text unpadded; data-table `spec` value boxes below 768 (paragraph box, centred,
  second box 5 px short for the R-01 aspheric wrap); `ao-modes` value cells keep the paragraph box.
  Gated through a local code proxy (probes/code-proxy.mjs: working-tree code + published documents)
  because the code is committed but not pushed: 17/17 PASS both widths; dome / instrument-andes
  unchanged (7.36 / 9.27, 4.18 / 6.83).
