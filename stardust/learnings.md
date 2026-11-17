# Learnings — elt.eso.org replica (2026-11-14)

- Live captures of this site must run with `STARDUST_LIVE_STATE=0`: the `/chile/?lang` page sets a Spanish
  language cookie that the shared session jar carried into later captures (15 false fails in one roster pass).
- `verify.mjs` reads widget links (`/widgets/<name>.html?…`, the dynamics widget contract) as broken internal
  page links; the target is a code-bus resource answering 200 — record such pages verified with the reason.
- A source search hosted by a web-search provider over a larger corpus cannot give comparable result counts;
  assert the top in-scope title and a known hit, and record the corpus difference as an environment limit.
- `helix-query.yaml` alone did not build `/query-index.json` for already-published pages; POSTing
  `admin.hlx.page/index/<org>/<site>/<ref>/<path>` per page filled it (43 rows within a minute).
