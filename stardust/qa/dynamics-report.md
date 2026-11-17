# Dynamics parity check — https://main--26c59ee1--aemcoder.aem.live — 2026-11-14T04:16:03.714Z

Replayed 14 checks over 12 features · pass 14 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Swiper carousels (home science slider, facts and media carousels) | CR | done | dom-count | PASS | 25 × .carousel .swiper-slide, .carousel [class*=slide] (min 3) | cdn.eso.org:206×1 elt.eso.org:200×1 |
| Swiper carousels (home science slider, facts and media carousels) | CR | done | dom-count | PASS | 2 × .carousel (min 2) |  |
| Webcam stills + 360° panoramas | D | interim | dom-count | PASS | 1 × .webcam-panel img (min 1) | cdn.eso.org:206×1 elt.eso.org:200×1 |
| Webcam stills + 360° panoramas | D | interim | dom-count | PASS | 14 × main img (min 12) | elt.eso.org:200×4 |
| Header search form → results page | S | done | search-query | PASS | 10 results · first: harmoni · matches the source |  |
| Header search form → results page | S | done | search-query | PASS | 4 results · first: webcams · matches the source |  |
| Header search form → results page | S | done | dom-count | PASS | 1 × header form[action='/search'] input[name='q'] (min 1) | cdn.eso.org:206×1 elt.eso.org:200×1 |
| English / Español switch | I18N | interim | dom-count | PASS | 1 × header a[href*='chile'] (min 1) | cdn.eso.org:206×1 elt.eso.org:200×1 |
| Social share dropdown | R | done | dom-count | PASS | 5 × .share-bar a, .share-bar button (min 4) |  |
| Top/secondary nav dropdowns + mobile toggler | R | done | dom-count | PASS | 39 × header .dropdown-menu a (min 30) | cdn.eso.org:206×1 elt.eso.org:200×1 |
| YouTube (privacy-enhanced) player | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 8 (ok) | www.youtube-nocookie.com:200×7 fonts.gstatic.com:200×1 www.google.com:200×1 i.ytimg.com:200×1 www.youtube-nocookie.com:204×1 jnn-pa.googleapis.com:200×1 yt3.ggpht.com:200×1 www.gstatic.com:200×1 |
| Video thumbnails opening eso.org video pages | CR | done | dom-count | PASS | 23 × a[href*='eso.org/public/videos'] (min 10) |  |
| no uncaught errors on the archetypes | R | done | no-page-errors | PASS | none on 9 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

- iframe without src injected at runtime (media page) (V) — scaffolded-awaiting-owner · owner: confirm nothing is missing: the source injects a 0×0 iframe with no visible content
- sign-in links (false positive) (X) — decided-out
