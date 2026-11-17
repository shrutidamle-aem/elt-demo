import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer — the source's one-row footer (brand line + link line), template-slotted from the
 * authored `/footer` document (path overridable per page with `footer` metadata).
 *
 * `/footer`: one section of default content —
 *  1 <p> brand line: <a href="https://www.eso.org/">ESO</a> | ELT ©<year>
 *  2 <p> link line: the links, separated by "|" (authored text)
 * Paragraphs are MOVED into the source's slots, never rebuilt.
 * @ew-exempt current year: the brand line ends with the current year, computed at render like the
 *   source's inline footer script (`#current-year`), so it is not authored.
 * @param {Element} block The footer block element
 */
/** moves a link's authored nodes into a span (the source's `a > span` shape) */
function wrapText(a, className) {
  const span = document.createElement('span');
  span.className = className;
  span.append(...a.childNodes);
  return span;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  block.textContent = '';
  if (!fragment) return;

  const paras = [...fragment.querySelectorAll('p')];
  const [brandLine, ...linkLines] = paras;

  const footer = document.createElement('div');
  footer.className = 'site-footer';
  const row = document.createElement('div');
  row.className = 'site-footer-row';
  const links = document.createElement('div');
  links.className = 'site-footer-links footer-item';
  const linksInner = document.createElement('div');
  links.append(linksInner);

  // the brand line is itself the source's brand cell (a flex row: link, text run, year)
  let brand = document.createElement('div');
  if (brandLine) {
    brand = brandLine;
    const home = brand.querySelector('a');
    if (home) home.append(wrapText(home, 'esoblue'));
    const year = document.createElement('div');
    year.className = 'current-year';
    year.textContent = String(new Date().getFullYear());
    brand.append(year);
  }
  brand.classList.add('site-footer-brand', 'footer-item');
  linkLines.forEach((p) => linksInner.append(p));
  linksInner.querySelectorAll('a').forEach((a) => a.append(wrapText(a, 'footer-item')));

  row.append(brand, links);
  footer.append(row);
  block.append(footer);
}
