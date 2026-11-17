---
name: ESO — The Extremely Large Telescope (current state)
description: The World's Biggest Eye on the Sky — dark, photographic outreach site of ESO's ELT
colors:
  eso-blue: "#0077be"
  eso-blue-deep: "#005e97"
  header-blue: "#2da4f5"
  eso-orange: "#e88526"
  black: "#000000"
  white: "#ffffff"
  surface-light: "#e8e8e8"
  surface-darkblue: "#0b1627"
  surface-footer: "#202020"
  text-body-dark: "#212529"
  border-light: "#dee2e6"
typography:
  page-title:
    fontFamily: "\"Helvetica Neue LT ESO\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "3.34375rem"
    fontWeight: 400
  section-title:
    fontFamily: "\"Helvetica Neue LT ESO\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
  section-text:
    fontFamily: "\"Helvetica Neue LT ESO\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "1.21875rem"
    fontWeight: 400
    lineHeight: "2.0625rem"
  header-title:
    fontFamily: "\"Helvetica Neue LT ESO\", \"Helvetica Neue\", Helvetica, Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
rounded:
  sm: "5px"
spacing:
  container-gutter: "10.5%"
  section-top: "2rem"
  top-bar: "50px"
components:
  section-light:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.black}"
  section-dark:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
  section-darkblue:
    backgroundColor: "{colors.surface-darkblue}"
    textColor: "{colors.white}"
  footer:
    backgroundColor: "{colors.surface-footer}"
    textColor: "{colors.white}"
    padding: "1rem 0"
---

<!-- stardust:provenance writtenBy: stardust:extract · mode: descriptive (current state) · sources: stardust/current/_computed-styles.json, stardust/current/assets/css/elt_assets.66fa71510905.css -->

## Overview

The ELT site is an institutional outreach microsite: every page opens on a full-bleed
photograph or render that stays fixed behind the page (`.big-header-image`, `position: fixed`)
while the content scrolls over it, with the page title set large over the lower part of the
image. A fixed black 50 px top bar carries the ESO logo, the member-state flags, language
switch, search and social icons; a dark secondary navigation sits under the hero. Content runs
in full-width bands — light grey, black or deep navy — with text held in by a 10.5 % gutter.

## Colors

ESO blue `#0077be` is the link and accent colour; header blue `#2da4f5` marks intro titles on
topic pages; orange `#e88526` appears on facts labels and spec arrows. Surfaces: light grey
`#e8e8e8`, black, navy `#0b1627`, footer charcoal `#202020`.

## Typography

One family, the proprietary Helvetica Neue LT W04 cuts (45 Light as regular, 55 Roman as 600,
65 Medium as 700, 35 Thin as "Helvetica Neue LT ESO Light"). The type ramp steps at every
source breakpoint (320/480/576/768/992/1200/1440/1680/1920); see DESIGN.json for the per-step
values lifted from the stylesheet.

## Layout

Full-width `.container-fluid` bands; inner `.container-paragraph` padding `0 10.5%`. Hero
height is `46.875vw`. Bootstrap 4 grid (`col-lg-*`) for two-column tile rows. Source
breakpoints: 576, 768, 992, 1200, 1440, 1680, 1920 (min-width ladder).

## Shapes

Mostly square edges; a 5 px radius on small controls. Sub-page tiles use clipped trapezoid
shapes (`internal-menu-trapezoid`, `landing-polygon`).

## Components

Top bar, hero with page title, secondary nav, page intro (dark, topic pages), sub-page tiles,
text sections with floated figures and captions, share bar, overview bands, carousels (Swiper),
webcam panel, instrument spec table, data tables, footer.

## Do's and Don'ts

- Do keep the fixed hero image behind the scrolling page.
- Do keep titles in thin/light Helvetica Neue over imagery with the 2 px black text shadow.
- Don't add rounded cards, gradients or new colours — the site has none.
