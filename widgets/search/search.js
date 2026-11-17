/**
 * Site search widget — replaces the source's hosted search (`/public/eltsearch/?q=`) with a
 * search over the delivered pages' `/query-index.json`. Authored on `/search` as
 * `/widgets/search/search.html?q=`; the header form posts `q` (the source's parameter name).
 * Title matches rank first; body-text matches follow; results are deduped by title + text.
 * @param {Element} widget The widget element
 */
const PAGE_SIZE = 10;
const SUFFIX = / \| ELT \| ESO$/;

async function loadIndex() {
  const rows = [];
  for (let off = 0; ; off += 500) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`/query-index.json?offset=${off}&limit=500`);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    rows.push(...json.data);
    if (off + 500 >= json.total) break;
  }
  return rows.filter((r) => !/noindex/i.test(r.robots || ''));
}

function rank(rows, q) {
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const has = (s) => terms.every((t) => String(s || '').toLowerCase().includes(t));
  const title = (r) => String(r.title || '').replace(SUFFIX, '');
  const byTitle = rows.filter((r) => has(title(r)));
  const byText = rows.filter((r) => !has(title(r)) && (has(r.description) || has(r.text)));
  const seen = new Set();
  return [...byTitle, ...byText].filter((r) => {
    const key = `${title(r)}|${String(r.text || '').slice(0, 200)}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function excerpt(row, q) {
  const text = String(row.text || '').replace(/\s+/g, ' ').trim();
  const term = q.toLowerCase().split(/\s+/).find((t) => t.length > 1) || '';
  // skip the page title lead the main text starts with
  const lead = String(row.title || '').replace(SUFFIX, '');
  const start = text.toLowerCase().startsWith(lead.toLowerCase()) ? lead.length : 0;
  const at = text.toLowerCase().indexOf(term, start);
  const from = at > 80 ? at - 80 : start;
  const cut = text.slice(from, from + 220).trim();
  return `${from > start ? '… ' : ''}${cut}${from + 220 < text.length ? ' …' : ''}`;
}

function el(tag, attrs = {}, text = '') {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  if (text) node.textContent = text;
  return node;
}

export default async function decorate(widget) {
  const params = new URLSearchParams(window.location.search);
  const q = (params.get('q') || widget.dataset.q || '').trim();
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  const input = widget.querySelector('.search-page-input');
  const count = widget.querySelector('.search-page-count');
  const list = widget.querySelector('.search-page-results');
  const pager = widget.querySelector('.search-page-pager');
  input.value = q;
  document.querySelectorAll('header input[name="q"]').forEach((i) => { i.value = q; });
  if (!q) return;

  const hits = rank(await loadIndex(), q);
  count.textContent = hits.length === 1 ? '1 result' : `${hits.length} results`;
  hits.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).forEach((row) => {
    const li = el('li', { class: 'search-page-result' });
    const h = el('h3', { class: 'search-page-title' });
    h.append(el('a', { href: row.path }, String(row.title || row.path).replace(SUFFIX, '')));
    li.append(h, el('p', { class: 'search-page-path' }, row.path));
    li.append(el('p', { class: 'search-page-excerpt' }, excerpt(row, q)));
    list.append(li);
  });
  const pages = Math.ceil(hits.length / PAGE_SIZE);
  for (let n = 1; pages > 1 && n <= pages; n += 1) {
    const a = el('a', { href: `?q=${encodeURIComponent(q)}&page=${n}` }, String(n));
    if (n === page) a.setAttribute('aria-current', 'page');
    pager.append(a);
  }
}
