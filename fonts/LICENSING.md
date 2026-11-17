# Brand fonts — NOT shipped

The source site (elt.eso.org) renders its text in **Helvetica Neue LT W04** (35 Thin, 45 Light,
46 Light Italic, 55 Roman, 65 Medium), served from a licensed Monotype (fonts.com) web-font kit.
That kit's licence is tied to the licensee's domains, so these faces are **not** hosted on this site.

What ships instead: every stack names the source families first —
`"Helvetica Neue LT ESO"` (and `"Helvetica Neue LT ESO Light"` for the thin face) — followed by
metric-fitted fallback faces (`"Helvetica Neue LT ESO Fallback"`, `… Light Fallback`, `… Caps Fallback` in
`styles/fonts.css`). They ship no font file: `src: local()` points at the visitor's own Arial (Liberation
Sans / Arimo on Linux), scaled with `size-adjust` to the brand cuts' advance widths, then the source's own
fallbacks `"Helvetica Neue", Helvetica, Arial, sans-serif`.

| File | Family (CSS) | Licence | Status |
|---|---|---|---|
| fa-solid-900-subset.woff2 | Font Awesome 5 Free (900; 5 glyphs) | SIL OFL 1.1 | shipped |
| material-icons-subset.woff2 | Material Icons (3 ligatures) | Apache 2.0 | shipped |

## Adding the brand faces back (only once the owner confirms the Monotype licence covers the new host)

1. Recover the woff2 files — from git history (commit `1917440`, `fonts/helvetica-neue-lt-eso-*.woff2`:
   `git show 1917440:fonts/helvetica-neue-lt-eso-45-light.woff2 > fonts/helvetica-neue-lt-eso-45-light.woff2`,
   likewise for 35-thin, 46-light-italic, 55-roman, 65-medium) or from the capture in
   `stardust/current/assets/fonts/` (`fonts.json` maps the hashed files to faces).
2. Restore their `@font-face` rules in `styles/fonts.css` (same commit) — family names
   `"Helvetica Neue LT ESO"` (400 = 45 Light, 400 italic = 46 Light Italic, 600 = 55 Roman,
   700 = 65 Medium) and `"Helvetica Neue LT ESO Light"` (400 = 35 Thin), `font-display: swap`.
3. No other change: the stacks already name these families first.
