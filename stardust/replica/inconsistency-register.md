# Inconsistency register — elt.eso.org replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an improvement.
Hands-off policy: no audit was run and no audit finding is adopted; the entries below are delivery
constraints, not design changes.

## R-01 — Proprietary typeface (Helvetica Neue LT W04, fonts.com kit)

- **Evidence:** `stardust/current/assets/css/elt_assets.66fa71510905.css` L15608–15660 — five `@font-face`
  rules ("Helvetica Neue LT ESO", "Helvetica Neue LT ESO Light") loading fonts.com woff2 files; captured to
  `stardust/current/assets/fonts/` (`fonts.json`).
- **Finding:** the brand face is a licensed commercial web-font kit; its web licence is tied to the
  licensee's domains and may not cover the new delivery host.
- **Minimal change (revised 2026-11-13, C0):** the licensed faces are NOT rehosted on the new domain (replica
  font policy: never rehost a licensed commercial kit). The brand family names stay FIRST in every stack so a
  licensed drop-in `@font-face` wins later; until then text renders in the source's own fallbacks
  metric-fitted local fallback faces (no file shipped: `local()` Arial / Liberation Sans / Arimo with
  `size-adjust` measured against the captured cuts over the site's own strings — 45 Light 96.8 %, 55 Roman
  100.7 %, 65 Medium on Arial Bold 97 %, 35 Thin 93.5 %, all-caps menu labels 93.7 %; ascent/descent from the
  brand faces), then the source's own fallbacks. Restore path in `fonts/LICENSING.md` (files in git history and `stardust/current/assets/fonts/`).
  The prototypes were gated with the captured faces; published-origin gates measure the fallback.
- **Status:** applied (substitution) — owner to confirm the Monotype web licence for the new host before the
  faces are restored.
- **Where:** all page types, all text.
