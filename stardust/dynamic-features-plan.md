# Dynamic features — plan (elt.eso.org)

| Phase | Deliverable | Authoring contract | Verification | Owner decision | Effort |
|---|---|---|---|---|---|
| Recreate (prototypes) | carousels, nav dropdowns, share dropdown rebuilt and motion-observed per archetype | authored slides / tiles as block rows | motion-observe + motion-compare per archetype | none | in recreation |
| C0 foundation | header (language links, search box, dropdowns, mobile toggler), footer, `scripts/martech.js` (all off) | nav / footer documents | chrome-compare, dynamics-check `martech` | martech enablement (row 10) | foundation |
| C-deliver | webcam block (absolute image URLs, snapshot timestamp), YouTube embed as player URL, search widget fed by `query-index` | webcam rows: image URL + caption; video as link | published-origin gate + dynamics-check | webcam timestamp proxy (row 2) | per template |
| D2-dynamic | `stardust/dynamics/parity.json`, `dynamics-check.mjs` report | — | `stardust/qa/dynamics-report.md` | — | rollout |
