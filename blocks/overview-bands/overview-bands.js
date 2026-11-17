/**
 * Overview Bands — the listing template's titled link bands (telescope.css "Link grid",
 * "Wide tile", "Card"; source elt_assets L16053–L16098, L20335): a section title row (optional
 * "more" badge link, a docked share-bar), then a grid of image tiles, each with a grey
 * trapezoid tab carrying the white "Read More" link and an optional name link.
 *
 * Content model (one block per band; rows are classified by content, not index):
 *   | overview-bands (wide)                                      |
 *   | ## Section title (or a paragraph)  ·  [badge link] (optional) |
 *   | image | [Read More](/path/)  [Name](/path/) (optional)      |
 *   | image | …                                                   |
 * - the title row is the row without an image: its heading (or non-link paragraph) is the title, a
 *   link paragraph is the badge (its text is a Material Icons ligature, e.g.
 *   `keyboard_arrow_right`)
 * - an item row holds an image and link paragraphs: the first link is the tab's "Read More",
 *   a second link is the tile's name
 * Overlay / banner bands (no title row; one row per tile, source order):
 *   | overview-bands (banners)                                                     |
 *   | image | [Title](/path/)  subtitle  description…  [Read More](/path/)       |
 * - `banners` (instrument / mirror landing): full-width image banners, the title, subtitle and
 *   description laid over the image, an outlined black tab with the orange "Read More";
 *   `mirror` sets the mirror-landing type (blue block title, 35 % text column)
 * - `overlay` (science landing): 2-up image tiles from 992 px, the white title over the image
 * - both draw the source's light triangle (#triangle-down) at the top of the first tile / grid
 * Variants: `wide` (wide tiles on a white ground: name beside the tab, 2 per row from 992 px,
 *   1 when the band has one tile); default = cards (image + tab, white name label below; one
 *   column per tile from 992 px, up to 4); `centered` (centred card labels); `tail` (the 2vw
 *   bottom space of the page's last band).
 * A share-bar block authored in the same section is docked in the title row.
 * The trapezoid tabs are decorative svg (aria-hidden, link out of the tab order, as the source).
 * Authored nodes are MOVED (EW1); wrappers carry the classes (EW2).
 * @param {Element} block The overview-bands block element
 */
const SVG = 'http://www.w3.org/2000/svg';

function wrapper(className, ...children) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...children);
  return div;
}

function isImageParagraph(el) {
  if (el.tagName === 'PICTURE' || el.tagName === 'IMG') return true;
  return el.tagName === 'P' && !!el.querySelector('picture, img') && !el.textContent.trim();
}

function isLinkParagraph(el) {
  const a = el.tagName === 'P' && el.querySelector('a');
  return !!a && a.textContent.trim() === el.textContent.trim();
}

/* trapezoid tab shapes: telescope-landing (cards, wide tiles), instrument-landing (banners),
   science-landing (overlay tiles) — viewBox, polygon, and the outline polylines */
const SHAPES = {
  card: ['0 0 120 8', '0,0 50,0 60,7 120,7 120,8 0,8'],
  wide: ['0 0 945 75', '0,0 260,0 340,67 945,67 945,75 0,75'],
  banner: ['0 -1 1890 128', '0,0 630,0 819,110 1890,110 1890,126 0,126',
    '0,0 630,0 819,110 1890,110', '0,126 1890,126'],
  overlay: ['0 -1 945 77', '0,0 260,0 340,67 945,67 945,75 0,75',
    '0,0 260,0 340,67 945,67', '0,75 945,75'],
};

/* the source's svg.*-landing-trapezoid: a tab under the "Read More" link */
function trapezoid(href, kind, className) {
  const [viewBox, points, ...lines] = SHAPES[kind];
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'trapezoid');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const a = document.createElementNS(SVG, 'a');
  a.setAttribute('href', href);
  a.setAttribute('tabindex', '-1');
  const polygon = document.createElementNS(SVG, 'polygon');
  polygon.setAttribute('points', points);
  a.append(polygon);
  lines.forEach((line) => {
    const polyline = document.createElementNS(SVG, 'polyline');
    polyline.setAttribute('points', line);
    a.append(polyline);
  });
  svg.append(a);
  return wrapper(className, wrapper('', svg));
}

function decorateTitle(cells, badgeClass) {
  const nodes = cells.flatMap((cell) => [...cell.children]);
  const title = wrapper('section-title-paragraph container-paragraph');
  nodes.forEach((el) => {
    if (isLinkParagraph(el)) {
      const a = el.querySelector('a');
      const glyph = document.createElement('span');
      glyph.className = 'material-icons';
      glyph.append(...a.childNodes);
      a.append(glyph);
      title.append(wrapper(badgeClass, el));
    } else {
      title.append(el);
    }
  });
  return title;
}

function itemParts(row) {
  const nodes = [...row.children].flatMap((cell) => [...cell.children]);
  const image = nodes.find(isImageParagraph);
  const links = nodes.filter((el) => el !== image && isLinkParagraph(el));
  const rest = nodes.filter((el) => el !== image && !links.includes(el));
  return {
    image, more: links[0], name: links[1], rest,
  };
}

function dockShareBar(block, title) {
  const section = block.closest('.section');
  const share = section?.querySelector('.share-bar');
  if (!share || !title || share.closest('.text-section, .overview-bands')) return;
  const shareWrapper = share.parentElement;
  title.classList.add('has-share');
  title.append(share);
  if (shareWrapper?.classList.contains('share-bar-wrapper') && !shareWrapper.children.length) {
    shareWrapper.remove();
  }
}

/* overlay / banner tiles: the title link comes first and the "Read More" link last (source order);
   between them a banner's first text paragraph is its subtitle, the rest its description */
function tileParts(row) {
  const nodes = [...row.children].flatMap((cell) => [...cell.children]);
  const image = nodes.find(isImageParagraph);
  const links = nodes.filter((el) => el !== image && isLinkParagraph(el));
  const name = links[0];
  const more = links.length > 1 ? links[links.length - 1] : null;
  const text = nodes.filter((el) => el !== image && el !== name && el !== more);
  return {
    image, name, more, text,
  };
}

function triangle() {
  const box = wrapper('triangle-down');
  box.append(wrapper('triangle-down-shape'));
  return box;
}

function decorateTiles(block, rows, banner) {
  const items = rows.map(tileParts).filter((item) => item.image || item.name);
  const grid = wrapper(banner ? 'link-grid banner-grid' : 'link-grid overlay-grid');
  items.forEach((item, i) => {
    const href = item.more?.querySelector('a')?.getAttribute('href')
      || item.name?.querySelector('a')?.getAttribute('href') || '#';
    const tile = wrapper(banner ? 'banner-tile' : 'overlay-tile');
    if (item.image) tile.append(item.image);
    const textBlock = wrapper('tile-text');
    if (item.name) textBlock.append(wrapper('tile-title', item.name));
    if (banner && item.text.length) {
      textBlock.append(wrapper('tile-subtitle', item.text[0]));
      if (item.text.length > 1) textBlock.append(wrapper('tile-description', ...item.text.slice(1)));
    } else if (item.text.length) textBlock.append(wrapper('tile-description', ...item.text));
    tile.append(textBlock);
    if (banner && i === 0) tile.append(triangle());
    tile.append(trapezoid(href, banner ? 'banner' : 'overlay', 'tile-shape'));
    if (item.more) tile.append(wrapper('tile-more', item.more));
    grid.append(tile);
  });
  if (!banner && items.length) grid.prepend(triangle());
  block.replaceChildren(grid);
}

export default function decorate(block) {
  if (block.querySelector('.link-grid')) return; // re-entrant (EW9)
  const wide = block.classList.contains('wide');
  const rows = [...block.children];
  if (block.classList.contains('banners') || block.classList.contains('overlay')) {
    decorateTiles(block, rows, block.classList.contains('banners'));
    return;
  }
  const items = [];
  let title = null;

  rows.forEach((row) => {
    const parts = itemParts(row);
    if (parts.image) items.push(parts);
    else if (!title && !items.length) title = decorateTitle([...row.children], 'section-badge');
    else if (parts.rest.length || parts.more) items.push(parts);
  });

  const n = items.length;
  // unit hooks: the coordinator's units.json build selectors (`.link-grid--4 > .card__image`,
  // `.wide-tile__bar`) name the prototype's BEM classes; styling uses the kebab-case twins
  const grid = wrapper(`link-grid link-grid-${Math.min(n, 4)} link-grid--${Math.min(n, 4)}`);
  items.forEach((item, i) => {
    const href = item.more?.querySelector('a')?.getAttribute('href')
      || item.name?.querySelector('a')?.getAttribute('href') || '#';
    const first = wide ? wrapper('wide-tile-image wide-tile__image') : wrapper('card-image card__image');
    const second = wide ? wrapper('wide-tile-bar wide-tile__bar') : wrapper('card-label');
    first.style.setProperty('--o', 2 * i + 1);
    first.style.setProperty('--o-lg', i + 1);
    second.style.setProperty('--o', 2 * i + 2);
    second.style.setProperty('--o-lg', n + i + 1);
    if (item.image) first.append(item.image);
    const tabHost = wide ? second : first;
    tabHost.append(trapezoid(href, wide ? 'wide' : 'card', wide ? 'wide-tile-shape' : 'card-shape'));
    if (item.more) tabHost.append(wrapper(wide ? 'wide-tile-more' : 'card-more', item.more));
    if (wide) {
      if (item.name) second.append(wrapper('wide-tile-name', item.name));
      if (item.rest.length) second.append(wrapper('wide-tile-name', ...item.rest));
    } else {
      second.append(wrapper('card-name', ...[item.name, ...item.rest].filter(Boolean)));
    }
    grid.append(first, second);
  });

  const body = wrapper('container-paragraph band-grid', grid);
  block.replaceChildren(...[title, body].filter(Boolean));
  dockShareBar(block, title);
}
