/**
 * Carousel variant `rail` (added by archetype-media; default rendering untouched) — the News &
 * Multimedia visuals rails (media.css §5–§6, media.js; source Swiper 5.4.5 in
 * elt_assets_visuals.1fe5828545ed.js): a dark dashboard bar (fullscreen icon, the media-type
 * label, "Sort by" links, search input group) above a non-looping rail — 1 / 2 / 3 slides per
 * view below 1000 / from 1000 / from 1400 px, one slide per arrow click (300 ms), the prev arrow
 * disabled at the start and the next arrow at the end, Swiper's slide state classes. Each tile
 * shows the image; on hover it fades to the blue ground and shows the title, the ESO logo and
 * the icon links.
 *
 * Content model (`carousel (rail, videos)` or `carousel (rail, images)`):
 *   | carousel (rail, videos)                                               |
 *   | Videos / Sort by [DATE](#) \| [RANKING](#)       (row without image: the dashboard) |
 *   | [image](link) | Title | [Download](….tif) [Play](youtube) [eso.org](…)  (one per slide) |
 * - dashboard row: the first paragraph is the media-type label, the next the sort line (its
 *   first link is the active sort)
 * - slide row: the cell holding the picture (optionally linked) is the tile image; the
 *   paragraph holding links is the icon row — each link becomes an icon by its target
 *   (`.tif` / original → download, YouTube → play, screen image → open, else external), its
 *   text kept for screen readers; every other paragraph is the hover title (`videos`: the
 *   title is linked to the tile target, as the source's trigger link)
 * Variant words: `videos` (video tiles 640/360, class `carouselVideoItem`), `images` (image
 *   tiles 16/9, class `carouselMediaItem`, the bar's 3rem top padding) — the units families'
 *   build selectors.
 * @ew-exempt the search input placeholder, the fullscreen glyph and the hover ESO logo are
 *   generated chrome (the source's sort, search and fullscreen controls were not observed
 *   firing and are not wired — dynamic-features rows 1, 7, 8).
 * Authored nodes are MOVED (EW1); arrows are empty buttons (EW7). Re-entrant (EW9).
 */
import { loadCSS } from '../../scripts/aem.js';

const LOGO = new URL('./eso-logo-transparent.png', import.meta.url).href;

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children);
  return node;
}

function icon(href) {
  if (/\.tif$|\/original\//i.test(href)) return 'fa-download';
  if (/youtube(-nocookie)?\.com/i.test(href)) return 'fa-play';
  if (/\/images\/screen\//i.test(href)) return 'fa-folder-open';
  return 'fa-external-link-alt';
}

function iconLinks(p) {
  p.querySelectorAll('a[href]').forEach((a) => {
    const label = el('span', 'rail-sr', ...a.childNodes);
    const glyph = el('i', `fas ${icon(a.getAttribute('href'))}`);
    glyph.setAttribute('aria-hidden', 'true');
    a.classList.add('px-3');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.append(glyph, label);
  });
  return el('div', 'visuals-hover-title visuals-hover-links', p);
}

function logo() {
  const img = el('img', 'visuals-hover-logo');
  img.src = LOGO;
  img.alt = '';
  img.width = 981;
  img.height = 1279;
  img.loading = 'lazy';
  return img;
}

function dashboard(row) {
  const paragraphs = [...row.querySelectorAll('p')];
  const [label, sort, ...rest] = paragraphs;

  const fullscreenLink = el('a');
  fullscreenLink.href = '#';
  fullscreenLink.setAttribute('aria-label', 'Fullscreen');
  fullscreenLink.append(el('i', 'material-icons visuals-fullscreen', 'fullscreen'));
  fullscreenLink.addEventListener('click', (e) => e.preventDefault());

  const type = el('div', 'media-type');
  if (label) type.append(el('div', 'media-type-label', label));

  const ranking = el('div', 'media-ranking');
  if (sort) {
    ranking.append(sort);
    const first = sort.querySelector('a');
    if (first) first.classList.add('media-type-active');
    // the leading words before the first link ("Sort by") are the source's grey label span
    const lead = [];
    for (let n = sort.firstChild; n && n !== first; n = n.nextSibling) lead.push(n);
    if (lead.length && first) sort.prepend(el('span', 'media-ranking-label', ...lead));
  }
  if (rest.length) ranking.append(...rest);

  const input = el('input', 'form-control');
  input.type = 'text';
  input.name = 'search';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search');
  const button = el('button', 'btn', el('i', 'material-icons', 'search'));
  button.type = 'submit';
  button.setAttribute('aria-label', 'Search');
  const form = el('form', 'form-inline', el('div', 'input-group', input, el('div', 'input-group-append', button)));
  form.setAttribute('role', 'search');
  form.addEventListener('submit', (e) => e.preventDefault());

  return el(
    'div',
    'rail-bar',
    el(
      'div',
      'visuals-dashboard',
      el('div', 'visuals-fullscreen-wrap', fullscreenLink),
      el('div', 'visuals-dashboard-spacer'),
      type,
      el('div', 'dashboard-row', ranking, el('div', 'media-search', form)),
    ),
  );
}

function slide(row, videos) {
  const cells = [...row.children];
  const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
  const media = imageCell.querySelector('a') || imageCell.querySelector('picture, img');
  const img = media.tagName === 'IMG' ? media : media.querySelector('img');
  if (img) img.classList.add('img-thumb');
  if (media.tagName === 'A') {
    media.target = '_blank';
    media.rel = 'noopener noreferrer';
  }
  const target = media.tagName === 'A' ? media.getAttribute('href') : null;

  const paragraphs = cells
    .filter((cell) => cell !== imageCell)
    .flatMap((cell) => [...cell.children]);
  const linksP = paragraphs.find((p) => p.querySelector('a[href]'));
  const titles = paragraphs.filter((p) => p !== linksP);

  const hover = el('div', 'img-thumb-hover');
  const title = el('div', 'visuals-hover-title', ...titles);
  if (videos && target) {
    const trigger = el('a', 'rail-trigger', title, logo());
    trigger.href = target;
    trigger.target = '_blank';
    trigger.rel = 'noopener noreferrer';
    hover.append(trigger);
  } else {
    hover.append(title, logo());
  }
  if (linksP) hover.append(iconLinks(linksP));

  const col = el('div', 'img-col', media, hover);
  const item = el('div', `rail-slide ${videos ? 'carouselVideoItem' : 'carouselMediaItem'}`);
  item.append(el('div', videos ? 'rail-tile rail-tile-video' : 'rail-tile', col));
  return item;
}

function arrow(dir, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `rail-arrow rail-arrow-${dir}`;
  button.setAttribute('aria-label', label);
  return button;
}

function perView() {
  if (window.matchMedia('(width >= 1400px)').matches) return 3;
  if (window.matchMedia('(width >= 1000px)').matches) return 2;
  return 1;
}

function drive(stage, track) {
  const slides = [...track.children];
  const next = arrow('next', 'Next slide');
  const prev = arrow('prev', 'Previous slide');
  stage.append(next, prev);
  let index = 0;
  const setDisabled = (btn, disabled) => {
    btn.classList.toggle('rail-arrow-disabled', disabled);
    btn.setAttribute('aria-disabled', String(disabled));
    btn.tabIndex = disabled ? -1 : 0;
  };
  const update = () => {
    const max = Math.max(0, slides.length - perView());
    if (index > max) index = max;
    track.style.setProperty('--slide', index);
    slides.forEach((s, i) => {
      s.classList.toggle('swiper-slide-active', i === index);
      s.classList.toggle('swiper-slide-next', i === index + 1);
      s.classList.toggle('swiper-slide-prev', i === index - 1);
    });
    setDisabled(prev, index === 0);
    setDisabled(next, index >= max);
  };
  next.addEventListener('click', () => {
    index += 1;
    update();
  });
  prev.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    update();
  });
  window.addEventListener('resize', update);
  update();
}

export default async function decorateRail(block) {
  if (block.querySelector(':scope > .rail-stage')) return;
  await loadCSS(new URL('./carousel-rail.css', import.meta.url).href);
  const videos = !block.classList.contains('images');
  let bar = null;
  const track = el('div', 'rail-track');
  [...block.children].forEach((row) => {
    if (row.querySelector('picture, img')) {
      track.append(slide(row, videos));
    } else if (!bar && row.textContent.trim()) {
      bar = dashboard(row);
    }
  });
  const stage = el('div', 'rail-stage', track);
  block.replaceChildren(...(bar ? [bar, stage] : [stage]));
  if (track.children.length) drive(stage, track);
  block.setAttribute('aria-roledescription', 'carousel');
}
