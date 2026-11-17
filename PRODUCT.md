<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-11-13T11:45:00Z
againstInput: https://elt.eso.org/
readArtifacts: stardust/current/pages/*.json, stardust/current/pages/*.html, stardust/current/assets/screenshots/*.png, stardust/current/_crawl-log.json
mode: descriptive (current state, not target)
-->

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — a public outreach microsite of ESO (European Southern Observatory) at elt.eso.org, built on
Bootstrap 4 with a Django-style asset pipeline (`/public/archives/djp/`), Swiper carousels and
a self-hosted Matomo analytics stack. Bilingual: English default, Spanish (ESO Chile) through a
language cookie set by `/?lang` and `/chile/?lang`.

## Users

_provenance: inferred — basis: navigation labels, copy register and the media/press pages.

- The interested public and astronomy enthusiasts following the construction of the telescope.
- Students and teachers looking for explanations of the telescope, its mirrors, instruments and science cases.
- Journalists and media (News & Multimedia, press kit, contacts).
- The astronomical community and industrial partners (instrument consortia, working groups, partner tables).

## Product Purpose

Explain and showcase ESO's Extremely Large Telescope — "The World's Biggest Eye on the Sky" — a
39-metre optical/infrared telescope under construction on Cerro Armazones, Chile: what it is,
how it is built (dome, structure, five-mirror optics, adaptive optics), the first-generation
instruments (HARMONI, MICADO, MORFEO, METIS, ANDES, MOSAIC), the science it will do, and the
project's progress (timeline, webcams, road to the ELT, partners).

## Positioning

The authoritative, institutional source on the ELT, published by the organisation that builds it.
Photography- and render-led storytelling on a dark, space-like canvas, backed by long-form
explanatory text.

## Capabilities and Constraints

- Static, editorial content in ~44 pages; four page families (home, section overview, topic
  detail, plain article) plus three one-off pages (facts, timeline, news & multimedia).
- Live elements: webcam stills and 360° panoramas refreshed from `/public/archive_webcams/`,
  Swiper carousels (home science slider, media video/image carousels), a site search form,
  social share dropdowns, consent banner + cookie-settings panel, Matomo analytics.
- Typography is a licensed fonts.com kit (Helvetica Neue LT W04, five cuts).

## Brand Commitments

- Register: `brand` (outreach / marketing-led, not a tool).
- Personality observed: institutional, scientific, awe-driven; restrained uppercase titles,
  thin Helvetica Neue display type, large photographic heroes, dark navy/black sections.
- Fixed elements: ESO logo top-left on every page, the EU member-state flag strip, ESO blue accents.
- Anti-references observed: no playful illustration, no gradients-as-decoration, no rounded "app" UI.

## Evidence on Hand

- `stardust/current/pages/<slug>.json` + `.html` — 44 live Playwright captures (2026-11-13).
- `stardust/current/assets/screenshots/<slug>.png` — full-page captures at 1440.
- `stardust/current/assets/css/` — the site's own stylesheets (elt_assets*.css).
- `stardust/current/assets/fonts/` — the five Helvetica Neue LT ESO woff2 faces (proprietary).
- `stardust/current/assets/logo.jpg`, `favicon.ico`.
- `stardust/current/_computed-styles.json` — computed-style census at 1440 and 360.
- `stardust/current/_crawl-log.json` — crawl audit trail incl. dynamic-surface reach.

## Product Principles

_provenance: inferred — basis: repeated structure across all captured pages.

1. Imagery first: every page opens on a full-bleed photograph or render with the page title over it.
2. Explain in depth: topic pages pair a short dark "intro" panel with long-form explanatory sections.
3. Consistent wayfinding: the same top bar, hero, secondary navigation and one-line footer on every page.

## Accessibility & Inclusion

Observed: the site relies on `div`-based titles (few semantic headings), images carry alt text
inconsistently, and dark sections use light-on-dark text. No accessibility statement was captured.
