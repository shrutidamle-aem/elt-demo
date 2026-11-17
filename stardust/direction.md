---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-13T12:16:15Z
  againstInput: https://elt.eso.org/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://elt.eso.org/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-13T12:16:15Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(1 entry, deferred — the proprietary-typeface licensing constraint; no design delta).

Fidelity: ia verbatim · design verbatim · content verbatim.

Gate breakpoints: 1440, 360 (run.json "desktop,mobile"). Source breakpoints kept (no --target-breakpoints).

Archetypes (one per page type): landing → index (https://elt.eso.org/) · listing → telescope ·
program → telescope-dome · instrument → instrument-harmoni · article → about-road · facts → about-facts ·
timeline → about-timeline · media → media.

## E2 link audit — named decisions (2026-11-14)

- Scope extension (outside the 44-page plan, kept absolute on the source): `https://elt.eso.org/media/explorer`
  (1 link). Webcam archive stills under `https://elt.eso.org/public/archive_webcams/…` (10 links) are a data feed
  that keeps updating on the source — external by design (dynamic-features row 2).
- Capture gaps: none — every internal root-relative href (53) answers 200 on the published origin.
- External links: 320 checked; 13 answer non-2xx/3xx exactly as on the source (dead eso.org / readthedocs
  pages, bot-walled LinkedIn / vendor sites, a dead INAF host). Kept verbatim — content preservation; listed
  for the owner in `stardust/.work/rollout/d2/ext-bad.txt` and the journal.
