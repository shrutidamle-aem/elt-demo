<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-13T12:20:13.788Z · input stardust/current/_dynamics.json (9 pages, 11 findings) · target probe https://main--26c59ee1--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-jnn-pa-googleapis-com | A | unknown third-party host jnn-pa.googleapis.com | 1/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-www-gstatic-com | A | unknown third-party host www.gstatic.com | 1/9 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | cr-client-rendered-slot-videotrigger | CR | client-rendered slot videoTrigger | 1/9 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 4 | i18n-locale-variants-x-default-en-au-en-gb-en-ie-cs-da-nl-nl | I18N | locale variants x-default,en-au,en-gb,en-ie,cs,da,nl,nl-be,fi,fr,fr-be,fr-ch,de,de-at,de-be,de-ch,it,it-ch,pl,pt,es,es-cl,sv | 9/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 5 | s-site-search-form-public-eltsearch | S | site search form → /public/eltsearch/ | 9/9 (reach 1/44) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 6 | s-site-search-form-js-submitted | S | site search form → (JS-submitted) | 1/9 (reach 1/44) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 7 | t-unknown-third-party-host-www-google-com | T | unknown third-party host www.google.com | 1/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 8 | t-unknown-third-party-host-yt3-ggpht-com | T | unknown third-party host yt3.ggpht.com | 1/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 9 | v-video-youtube | V | video: YouTube | 1/9 | embed-passthrough | content | self | pending | media-as-url | none (player ids are public) |  |
| 10 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 1/9 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 11 | x-sign-in-account-links | X | sign-in / account links | 9/9 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 4 row(s) — settled-dom-snapshot, search-index-backed, media-as-url.
- **One owner decision batch:** 6 row(s) — inspect the XHR, add a vendor row · scope of the locale trees · which tags run on the new host; property ids · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/0 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **detect** — 2
- **search** — 2
- **tags** — 2
- **capture** — 1
- **locale wave** — 1
- **media** — 1
- **embeds** — 1
- **register** — 1
