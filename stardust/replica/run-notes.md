# Run notes — elt.eso.org replica (read at every session start)

- **Language cookie trap.** Accepting the consent banner lets the site persist a language
  cookie; visiting `/chile/?lang` switches every later page in the same browser state to Spanish
  (`<html lang="es-cl">`). Run EVERY live instrument (gate.sh, gate-all, measure, anchor,
  chrome-parity, cap-probe, motion-observe, style-census, crawl) with `STARDUST_LIVE_STATE=0`
  so the shared cookie jar is never read or written.
- **Consent control:** `.privacy-notice .privacy-button.accept-all` (pass as `--consent` / `--dismiss`).
  `.privacy-settings` is a fixed panel parked at top ≈ viewport+90px: invisible in a real
  viewport, but it shows up in Playwright `fullPage` screenshots (extract thumbnails only).
- crawl.mjs project copy carries one extension: `STARDUST_CONSENT_SELECTOR` env (site consent control).
- **unit-geometry cache trap:** live unit geometry is cached per slug, not per width
  (`stardust/current/measure/<slug>-units.json`). Delete that file before switching gate width, or the
  360 round reuses 1440 geometry and fails falsely.
- Content-root on home has no single wrapper; build `<main>` is `display: contents`. Accepted
  findings (loop-duplicate carousel slides) live in `stardust/replica/accepted.json`.
- **gate-all also reads the unit-geometry cache:** `rm stardust/current/measure/*-units.json` before every
  gate-all width switch (prototype stage 1440 first run failed 6 pages on stale 360 geometry; 0 after clearing).
- **Home science carousel** auto-advances (5 s) on the prototype and on EDS; gate-all rows mask it via
  `gates/<all|prototypes>-1440/masks.json` → `index: 1570:720` (timer phase, not layout). Carry the mask to all-1440.

## Script adaptation — unit-geometry origin cache keyed by width (2026-11-13, C-deliver)
- `stardust/scripts/diff/unit-geometry.mjs`: the `--slug` origin cache was `<slug>-units.json` for every width, so
  a 360 run answered the next 1440 run with 360 geometry (about-facts: origin x45 w270 vs EDS x180 w1080, "off 24").
  Project copy now keys `<slug>-units-<width>.json` (one-line change, marked in the file); upstream bug to report.
  The stale width-less caches from recreate are no longer read.
- gate-all runs with `--state stardust/rollout/gate-roster.json` (rows `deployed` per planned page; `--only` the
  delivered ones) and the presence sidecars carry a symmetric `main` pair per page: the source has no `<main>`,
  so its body children minus `#top-navbar`, `footer` and the consent overlay are compared with EDS `main`.
