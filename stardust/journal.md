# Journal — elt.eso.org replica

## Extract — 44/44 pages captured live, 8 templates typed (2026-11-13)

- Scope: the 44 URLs of `stardust/.labs/site-plan.json` (`--pages`, `--prep --dynamics`). Provenance 44/44 live
  (playwright, waitMode medium, 2500 ms, HTTP 200). `/?lang` (slug `index-b7ff`) is a duplicate of the home page;
  `/chile/?lang` serves the Spanish home page (`lang="es-cl"`).
- Consent: the site's own banner (`.privacy-notice .privacy-button.accept-all`) is missed by the shared vendor
  list; the project crawl.mjs copy gained a `STARDUST_CONSENT_SELECTOR` env extension and every live
  instrument is passed `--consent`/`--dismiss` with that selector.
- Language-cookie trap: once consent is accepted the site keeps a language cookie, and visiting `/chile/?lang`
  turned every later page of the same browser state Spanish (14 pages in the second crawl). Those 14 were
  re-captured in fresh state; from now on every live instrument runs with `STARDUST_LIVE_STATE=0`
  (`stardust/replica/run-notes.md`).
- Census: `_computed-styles.json` at 1440 + 360 (86/88; science and telescope @1440 timed out, their 360 rows exist).
- Fonts: Helvetica Neue LT W04 (fonts.com kit, 5 woff2 cuts) captured to `assets/fonts/` — proprietary.
- Templates (state.json `type`): landing 3 (rep index), listing 5 (rep telescope), program 18 (rep telescope-dome),
  instrument 6 (rep instrument-harmoni), article 9 (rep about-road), facts 1, timeline 1, media 1.
- Cap model: contentMaxWidth 1400px module cap on overview/topic/facts/timeline; fluid on home, instrument,
  article, media (consistent: NO — replicated per template, not a token).
- First-page-first was not run as two parallel tracks: on this 4-CPU runner a single linear flow (home is
  the first archetype) is the safer use of the browser budget.

## preserve-direction — spec promoted verbatim, register R-01, dynamics + martech triaged (2026-11-13)

- `stardust/current/{PRODUCT,DESIGN}.md` + `DESIGN.json` copied byte-for-byte to the project root; `DESIGN.json`
  added to `.hlxignore` (root `*.md` already ignored). `stardust/direction.md` records preserve mode.
- Register: one entry, R-01 (proprietary Helvetica Neue LT W04 kit, deferred) — no design delta.
- Dynamics: detector on the 8 archetypes + webcams → 11 rows curated in `stardust/dynamic-features.md`
  (carousels, nav/share dropdowns, language links, search widget, webcam stills, YouTube, consent/Matomo).
- Martech (owner asked to keep analytics + consent): spec-martech found no tag manager in server HTML; Matomo
  is injected by the site's own `elt_assets.js` after the first-party privacy notice. Contract carries a
  disabled `matomo` route, model `per-tag`, notes citing the source; hand-off appended.
- Publish decision (runner): publish — recorded in `stardust/eds-conversion-log.md`.

## Recreate — 8/8 archetypes gated at 1440 and 360, prototype table 8/8 PASS (2026-11-13)

- Archetypes (template → slug, pixel 1440 / 360): landing → index 0.14% / 0.26%; listing → telescope; program →
  telescope-dome; instrument → instrument-harmoni; article → about-road; facts → about-facts; timeline →
  about-timeline; media → media 0.01% / 0.00% (all Δh 0, content 0 red / 0 nothing-lost, clip 0, cap-probe PASS,
  motion parity recorded). Details per type in `stardust/replica/progress.json`.
- Prototype table (`gate-all --stage prototype`): 1440 8/8 PASS, 360 8/8 PASS (`gates/prototypes-<w>/summary.md`).
  First 1440 run failed 6 rows on stale 360 unit geometry (cache cleared) and index at 13.18% on carousel timer
  phase (slide 2 vs 1) → masked `1570:720` with reason in `prototypes-1440/masks.json`.
- 360 index row passes at 8.16% unmasked: same carousel timer phase (archetype gate 0.26% frozen). Mask it at 360
  too if the published-origin row nears the 10% bar.
- Register unchanged (R-01 font, deferred). No canon change from the media archetype.

## Migrate plan — 8 archetypes rendered to stardust/migrated/, /?lang folded into the home document (2026-11-13)

- Preconditions: dynamic-features.md present; every archetype gated at 1440 + 360 (replica progress.json).
- `migrate.mjs render` of the 8 approved archetypes: 8 rendered (Path A). `index` first refused (strict 8:
  `https://elt.eso.org/?lang` → index.html collides) — `/?lang` is the language-reset link to the same English
  home; EDS routes by path, so the root document answers it. Rendered with a page map without index-b7ff
  (`stardust/.work/migrate/state-no-dup.json`, migrate key merged back) and recorded `decision index duplicate-url`.
  /chile/?lang likewise lands on /chile/ (its own document, no collision).
- Open: `modules[]` empty on 7 archetypes (no data-module attributes in the prototypes) — fill with
  `migrate.mjs modules` before rollout B-block. Siblings (36 pages) render per template inside C-deliver.

## A-inventory — 8 archetype rows from the migrated tree (2026-11-13)

- `inventory.mjs --state` double-counted the 8 archetypes (migrated rows `/about/facts` vs roster `/about/facts/`,
  and siblings fell to `type` groups without `representative`) → 50 rows for 44 pages. Re-ran on the migrated
  tree only: 8 rows, one template each. Siblings join the coverage when their render unit writes them
  (sidecar `template` = archetype slug), inventory re-run after each render unit.
- rollout.json site: da aemcoder/26c59ee1@main, liveHost main--26c59ee1--aemcoder.aem.live.

## B-block — 13 distinct module blocks, representative-first plan (2026-11-13)

- `blocks.mjs`: 13 blocks, 25 instances → 13 conversions (share-bar×5, text-section×5, carousel×3 …);
  `plan.mjs`: each block converts on exactly one archetype, the rest reuse.

## B2-dynamic — dynamic surface re-verified on the 8 archetypes, martech scaffolded off (2026-11-13)

- `dynamics-detect` (fresh, 8 archetype URLs, STARDUST_LIVE_STATE=0): 11 findings, every one covered by a curated
  row of `stardust/dynamic-features.md` (YouTube + its Google hosts → youtube-embed; videoTrigger → video-triggers;
  search forms → site-search; locale variants → language-switch; src-less iframe → runtime-iframe; account links).
  No new row; evidence kept at `stardust/current/_dynamics-recheck.json`.
- `martech-scaffold.mjs`: scripts/martech.js written (no CMP, 0 routes enabled — Matomo route off, owner turns it on),
  hooks in scripts/scripts.js loadEager/loadDelayed. Ships with C0.

## C-deliver (in progress) — foundation authored + published; chrome gate open on the font substitution (2026-11-13)

- C0 subagent: styles/, fonts/ (icon subsets), favicon, blocks/header, blocks/footer, blocks/big-header (hero,
  first section of every page), /nav, /chile/nav (Spanish menu; chile page needs `nav: /chile/nav`, `lang: es-cl`),
  /footer published; runtime-contract.json; lint clean. With the captured faces: chrome-compare 1440 exit 0,
  crops 0.00% (360 footer 2.78%, sub-pixel on the short shell).
- R-01 revised: the licensed Helvetica Neue LT kit is not rehosted (replica font policy). Fallback renders as
  Liberation Sans in headless Chrome → chrome-compare exit 2 at both widths, footer bands 4.0% / 5.8%, every
  delta a text width. Unit `foundation` recorded `failed`; not frozen. Next: open Helvetica-metric substitute.

## C-deliver unit foundation — metric-fitted fallback faces, foundation frozen (2026-11-13)

- R-01 fallback: `styles/fonts.css` "Helvetica Neue LT ESO Fallback" / "… Light Fallback" / "… Caps Fallback"
  faces, `src: local()` Arial / Liberation Sans / Arimo (no file shipped). size-adjust measured against the
  captured cuts over site strings (45 Light 96.8 %, 55 Roman 100.7 %, 65 Medium on Bold 97 %, 35 Thin 93.5 %,
  all-caps 93.7 % for the header menu); ascent/descent = brand 97/25 % ÷ size-adjust (Chrome scales overrides).
- Search input pinned to the source's size=20 width in its brand face (207px); search panels now pass at both widths.
- 3 rounds: header crop 1440 0.55 %, 360 2.37 %; footer 3.65 % / 5.21 % — glyph stroke weight only (Light vs
  Regular), logged against R-01. 360 drawer 3.3 % includes shell-path artifacts (active item, `#` href);
  re-run chrome-compare on the delivered /about/road/ at the article archetype unit.
- foundation-freeze: 19 files (styles, fonts, header, footer, big-header, head.html, scripts). Unit `done`.

## C-deliver wave 1 — facts, article, timeline archetypes live; gate configuration fixed (2026-11-13)

- archetype-facts done (1440 1.53% / 360 3.27%, Δh 0), archetype-article done (2.04% / 6.88%, Δh 0),
  archetype-timeline done (4.82% Δh 42 / 8.61% Δh 33; EW6 card-as-link; units residual R-01 wraps only).
  cluster-facts and cluster-timeline closed (no siblings).
- Gate configuration: `stardust/rollout/gate-roster.json` (gate-all --state); presence.json symmetric `main` pair
  per page (source has no <main>/<header>: chrome links read MISSING before); unit-geometry origin cache keyed
  by width (project-copy fix, run-notes); units.json footer-columns build selector → `.site-footer-row > .footer-item`.
- Foundation: footer link row R-01 compensation (letter-spacing 0.0027em) applied between units, re-frozen.
- Queued for C-final (foundation-requests.md): hero h1 vs source div role swap, #main-navbar toggle icon,
  header scroll-state root (#top-navbar), 360 drawer 4.1% (R-01 glyph weight, labels 1px low).
- Session ended at the runner's time limit with cluster-article (8 siblings, mid-deploy) and
  archetype-instrument (blocks pushed, content not deployed) in flight — both `running` with notes.

## C-deliver wave 2 — instrument archetype live, home page live, article cluster delivered (2026-11-13)

- archetype-instrument done (/instrument/harmoni 1440 3.37% Δh -1 / 360 6.77% Δh -1; text-section intro/row-styles
  variants restored after the article worker's whole-file replace; subpage-tiles `spaced` cell word).
- cluster-article done: 8/8 siblings live; credits, about-team, about-faq pass; failing rows queued for a fix pass
  before gate-all — about-webcams (360° viewer not carried), about-workinggroups 1440 10.17% (diagram hotspots),
  success-buildingon 1440 12.23% and about-location 360 13.93% (R-01 wraps), about-industrial 360 Δh -1788 (logo width).
- Coordinator: units.json families scoped to their archetype page (siblings carry pixel/Δh/clip/content only);
  build selectors for subpage-tiles/tech-table; gate-all masks — index carousel 1570:720 @1440 (now PASS 0.84%),
  video bar 350:60 + webcam panorama 1130:110 @360 (still 13.58%: tiles 3–4px offset + R-01 hero wrap).
- Accepted deviation: home teaser video starts 3 s after load (eager 66 MB stream kept the page from network idle).
- In flight at session end: archetype-landing (360 offset round, then chile), cluster-instrument (5 siblings),
  archetype-media — recorded `running` in stardust/rollout/progress.json.

## C-deliver wave 3 — every template's archetype live, 43/44 pages published, fix pass 7/7 (2026-11-13)

- Units done: archetype-landing (/ 1440 0.84% / 360 2.76%), cluster-landing (/chile 0.94% / 2.68%; /?lang verified),
  cluster-instrument (4/5 then andes fixed), archetype-program (/telescope/dome 7.36% / 9.27%), archetype-listing
  (/telescope 2.69% / 3.85%), cluster-listing (4/4 live, mirror 1440 16.98% pending), archetype-media (2.07% / 4.32%),
  cluster-media (no siblings).
- Fix pass 7/7: about-webcams (WebGL pano-viewer widget + autorotate masks), location, industrial (13 lost nbsp
  restored), workinggroups, buildingon, andes (width-scoped measure variants for R-01 wraps), harmoni (documented
  override: units off = R-01 text width; units.json families advisory, gate-all still counts them).
- Coordinator sidecars: all-360 index carousel mask; chile inherits index masks; webcam viewer masks; harmoni override.
- In flight: cluster-program 17/17 live, 5 pass, round 3 pending (resume state in progress.json note). Then mirror fix,
  gate-all, final. Watch: nbsp / U+202F lost in encoded content on siblings.

## C-deliver unit cluster-program — round 3 closes the cluster, 17/17 pass via code proxy (2026-11-14)

- 12 failing documents re-encoded (encoder extended: program variants as block classes) and redeployed, published.
- Gated through a local code proxy (working-tree code + published documents): 1440 worst telescope-controls 8.62%,
  360 worst adaptiveoptics 9.98%; m2m3 360 Δh +274 → +1; clip/presence 0; dome and andes unchanged.
- Code commits 21cf6c8..e1ff0af reach aem.page only after the runner's push: re-gate the 12 pages on the preview origin.
- Next: re-gate cluster-program on aem.page, mirror (listing) fix 1440 16.98%, gate-all, final.

## C-deliver unit fix-listing — program re-gated on the published origin, mirror fitted (2026-11-14)

- Code pushed by the runner (aem.live serves the working-tree CSS): cluster-program re-gated on the published
  origin, 17/17 PASS at 1440 (worst controls 8.62%) and 360 (worst adaptiveoptics 9.99%, cosmodm 9.97%);
  m2m3 1440 first fell back to the crawl shot (asymmetric origin) — retaken: 5.31%.
- /mirror (listing): one R-01 wrap in the intro paragraph (6 → 7 lines) — `fit-l-ls-p05` on the first
  text-section, redeployed + published: 1440 16.98% → 1.76% Δh 0; 360 5.78% Δh -1. PASS.
- Gate roster for gate-all is `--state stardust/rollout/gate-roster.json` (state.json pages are not `deployed`).
- Next: gate-all (roster, --skip-existing) both widths, update-coverage --gate, then final.

## C-deliver final — header request applied, roster gate 43/43 both widths, C-deliver closed (2026-11-14)

- Foundation request applied once: header active item (trailing slash normalised on both sides; ELT HOME only
  on / and /chile — matches the source's `.active` on /telescope, /credits (none), /media, /success/buildingon).
  Pushed, re-frozen (big-header kept in the frozen set).
- gate-all roster (43 rows; /?lang is the index) on the published origin: first pass showed 15 false fails —
  the shared live-session cookie jar carried the Spanish language cookie set by /chile/?lang into later origin
  captures (and into the cached unit inventory stardust/current/measure/about-timeline-units-1440.json).
  Re-captured with STARDUST_LIVE_STATE=0: 1440 and 360 43/43 pixel PASS; units: harmoni + timeline delivered
  by documented override (R-01 text width / wraps). Summaries patched from the --only run rows
  (.work/tmp/patch-summary.mjs) after compare-only hit its deadline; update-coverage --gate → 43 deployed.
- Watch: always run live captures of this site with STARDUST_LIVE_STATE=0.

## D-site — redirects sheet published, served sitemap 43 = assembled 43 (2026-11-14)

- `stardust/redirects.tsv` (62 rows: trailing-slash and upper-case source paths → delivered paths) PUT to DA as
  `/redirects.json`, previewed and published; spot checks /about/, /mirror/M1/, /instrument/HARMONI resolve 200.
- Root: the source root serves a page → delivered as the `index` document, no `/` row; aem.page and aem.live `/` 200.
- Chrome documents /nav, /footer, /chile/nav carry `robots: noindex`; served sitemap 43 = assembled 43, extra 0.

## D2-dynamic — site search delivered, parity 14/14 on the published origin (2026-11-14)

- `/query-index.json` was 404: committed `helix-query.yaml` (title, description, image, robots, text), pushed,
  re-indexed the 43 live pages through the admin index API → total 43 (nav/footer/search excluded).
- Search: `widgets/search/` (title-first ranking, text matches after, dedupe, 10 per page) mounted on `/search`
  (noindex, light section); nav + chile/nav search links now `/search` (were `/public/eltsearch/`, a 404 here).
  Published /search, /nav, /chile/nav via deploy-batch (ledger-d2).
- `stardust/dynamics/parity.json` written; dynamics-check 14/14 PASS (search HARMONI/webcams top title + known hit;
  youtube playback requests 8 ok; no page errors on 9 paths; martech gate quiet). Source search is a hosted
  web-search over a larger corpus → counts not compared (recorded as environmentLimit).

## E-full-site — 43/43 verified on the published origin (2026-11-14)

- verify.mjs --all: first pass 34/43 — two pages linked upper-case instrument paths (/instrument/MICADO …, served
  only through the redirects sheet) → localize-links normalized 140 internal hrefs across 7 documents (road, team,
  index, chile, nav, chile/nav, footer); re-published (ledger-e).
- 7 pages failed only on `/widgets/youtube.html` — the youtube widget's authored link (dynamics widget contract,
  a code-bus resource answering 200), which verify reads as an internal page link: recorded verified by hand
  (update-coverage) with this reason; youtube playback is asserted by dynamics-check (/mirror) and the render check.
- Render check (restoreAtDelivery): home teaser video playing (t 0 → 2.36 s, muted); science carousel advances
  unpoked (slide 4 → 7 in 6.5 s); dome youtube iframe present; harmoni AOS reveal animates.
- Coverage 43 verified / 0 failed; gate table unchanged (all-1440 / all-360 43/43).

## E2-link-audit — 53/53 internal hrefs 200, localize check clean (2026-11-14)

- localize-links --check PASS (0 localizable left; /media/explorer kept absolute — scope extension, direction.md).
- 53 distinct root-relative hrefs GET 200 on the live origin (nav, footer, landing targets included).
- 320 external hrefs: 13 non-2xx kept verbatim as on the source (403 linkedin/safran/hexagon, 404 eso.org
  sinfoni/naco/science-team/working-groups + 2 readthedocs, 405 adsabs ×2, 406 mpe, 000 wwwmaory.oabo.inaf.it).

## F-optimize — health 99/100, 0 open P1 (2026-11-14)

- optimize --all over 43 pages: seo 100, ai 100, cross-page 96; open P1 0 · P2 0 · P3 1 (duplicate description —
  every source page carries the same generic description; kept verbatim, content preservation).
- 44 source-parity findings (no JSON-LD on the source pages) informational, not scored.

## G-aem — nothing to autofix (2026-11-14)

- autofix-aem --dry-run: 0 candidates (no open platform-migration finding); no re-deploy needed.

## H-report — report and learnings written (2026-11-14)

- `stardust/rollout/report.md` (summary block) and `stardust/learnings.md` (4 entries).

## I-dashboard — dashboard written, rollout closed (2026-11-14)

- `stardust/rollout/dashboard/{index.html,data.json}`: 44 identified · 43 prototyped/delivered · 43 deployed.

## Handoff — run complete (2026-11-14)

- done-check: complete, no gaps. 44 planned pages (43 documents; `/?lang` = `/`) live, verified and gated on
  the published origin; rollout A–I closed. Owner items: martech enablement (all parts off), webcam live proxy,
  runtime iframe on media, licensed font (R-01) — see `stardust/rollout/report.md`.
