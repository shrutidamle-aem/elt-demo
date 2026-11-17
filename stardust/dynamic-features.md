# Dynamic features — elt.eso.org

Source: `stardust/current/_dynamics.json` (9 probed pages: the 8 archetypes + /about/webcams/; reach from 44/44
crawled pages) · draft `stardust/dynamics/dynamic-features.generated-plan.md` · target probe
https://main--26c59ee1--aemcoder.aem.page (no first-party API path probed host-bound).

## Listings contract

none — the site has no index-fed listing blocks; overview tiles and carousels are authored content.

## Features

| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | carousel-swiper | Swiper carousels (home science slider — fade, loop, autoplay; facts and media carousels) | CR | 5/44 | rebuild-native | block | self | done | carousel | none | `.swiper-container-science`, `.swiper-container-carousel`, media `.swiper-container` |
| 2 | webcam-stills | Webcam stills + 360° panoramas refreshed by the source from `/public/archive_webcams/` (14 same-site endpoints, `datetime.txt` timestamp XHR) | D | 4/44 | data-fed | block | self | interim | media-as-url | interim: image URLs stay absolute on elt.eso.org (the archive keeps updating there); the timestamp is a static snapshot until the owner decides to proxy `datetime.txt` | `/public/archive_webcams/armazonespano/public/panojavascript/datetime.txt`, `.webcam-wrapper` |
| 3 | site-search | Header search form → `/public/eltsearch/` (q) | S | 44/44 (chrome) | index-backed | widget | self | done | search-index-backed | none — corpus = the delivered pages: `/search` mounts the search widget over `/query-index.json` (helix-query.yaml); the header form posts `q` there | `search:q` |
| 4 | language-switch | English / Español switch (`/?lang`, `/chile/?lang`, cookie-based on the source) | I18N | 44/44 (chrome) | rebuild-native | runtime | self | interim | locale-tree | interim: plain links to `/` and `/chile/`; only the Spanish home page exists in scope | header `.dropdown-content`, `.lang-links` |
| 5 | share-dropdown | Social share dropdown (Facebook, e-mail, copy link, LinkedIn) | R | 40/44 | rebuild-native | block | self | done | chrome-interaction | none | `.share-social-media-dropdown` |
| 6 | nav-dropdowns | Top/secondary nav dropdowns + mobile toggler | R | 44/44 | rebuild-native | runtime | self | done | chrome-interaction | none | `.dropdown-menu`, `.navbar-toggler` |
| 7 | youtube-embed | YouTube (privacy-enhanced) player on News & Multimedia, incl. its Google hosts (www.gstatic.com, jnn-pa.googleapis.com, www.google.com, yt3.ggpht.com) | V | 1/44 | embed-passthrough | content | self | done | media-as-url | none (player ids are public) | `youtube-nocookie.com/embed/t-Ub_02dfUg` |
| 8 | video-triggers | Video thumbnails opening eso.org video pages (`data-url`) | CR | 1/44 | static-snapshot | content | self | done | settled-dom-snapshot | reason: the settled DOM is the content; links point to www.eso.org | `data-url=https://www.eso.org/public/videos/…` |
| 9 | runtime-iframe | iframe without src injected at runtime (media page) | V | 1/44 | static-snapshot | content | needs-human-capture | scaffolded-awaiting-owner | embed-passthrough | undecided — revisit at rollout (0×0, no visible surface in the capture) | `0×0` |
| 10 | consent-matomo | ESO privacy notice (first-party) + Matomo analytics (www.eso.org/mtmo, site id 2) | T | 44/44 | embed-passthrough | runtime | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | owner: enable in `stardust/martech-contract.json` (all parts off) — `stardust/martech-handoff.md` | `elt_assets.c4ebe47d5f34.js` |
| 11 | account-links | "sign-in" links detected inside the cookie policy (browser help pages) and an eso.org image link | X | — | decided-out | — | needs-backend | n/a | decided-out | none — false positive: no sign-in exists on the site | `support.brave.com/…/signin` |

## Decision batch

One message to the owner:

1. **Analytics and consent** (row 10): Matomo and the privacy notice are carried over switched off. Turn them on
   in `stardust/martech-contract.json` per `stardust/martech-handoff.md` once the new host is covered by your
   Matomo and privacy setup.
2. **Webcam timestamp** (row 2): the webcam images keep loading from elt.eso.org; the "last updated" line is a
   snapshot unless a same-origin proxy for `datetime.txt` is wanted.
3. **Runtime iframe on News & Multimedia** (row 9): no visible content was captured; confirm nothing is missing.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| account-links | detector false positive — the "sign-in" URLs are third-party browser help links inside the cookie policy; the site has no account area | no account / sign-in surface exists on elt.eso.org |

## D2 delivery notes (2026-11-14)

- Parity replay: `stardust/dynamics/parity.json` → `stardust/qa/dynamics-report.md`, 14/14 checks PASS on the
  published origin (incl. martech gate: no tag host requested).
- Site search: the source search is a hosted web-search box over all of elt.eso.org (HARMONI ≈ 76 results,
  Webcams ≈ 133, Spanish tree included); the delivered search covers the 43 delivered pages, so counts are not
  compared — the source's top in-scope title and a known hit are. `/search` is a `noindex` utility page, out of
  the query index and the sitemap, and carries no coverage row (it has no source page to gate against).
- Webcams: the home webcam panel loads the live still from elt.eso.org; the /about/webcams page carries the
  captured stills (snapshot 2026-11-13) — interim until the owner decides on a same-origin proxy (row 2).
