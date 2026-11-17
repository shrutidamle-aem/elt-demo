/**
 * Subpage Tiles — the source's internal-link rows (`.lightlinks`, instrument-harmoni.css §6,
 * source L16019–L16057, L19695, L20275): one coloured row per in-page (or sub-page) target —
 * a linked image with its title laid over it, and a body with a short text, a white trapezoid
 * and a "Read More" link. Rows alternate image-left / image-right; 2-up from 1200 px.
 *
 * Content model (reconstructive — one row per tile, cells classified by content):
 *   | subpage-tiles                                                    |
 *   | image | [Tile title](#target) + text paragraphs | colour words |
 * - the cell holding a picture → the tile image (linked to the title's target)
 * - in the text cell, the first paragraph holding a link → tile title (its href is the target);
 *   every other element → tile text
 * - the colour cell: `<row colour> [<link colour>]`, one word each from the palette below
 *   (default steel; the link colour defaults to the row colour)
 *   plus the optional words `spaced` (the source's inline padding-bottom 1rem on a tile's text)
 *   and `gap` (the source's trailing empty paragraph — an empty line under the tile text)
 * @variants colour cell: steel | teal | bronze | indigo | cobalt | rust | clay | slate | cyan
 *   | graphite | taupe | denim | umber | olive | sage | lilac (the source's per-row ground
 *   colours) | spaced | gap; any other ground as a hex word
 *   (`#587eb0`, program template — the source's inline background-color)
 * Block variant `program` (program template): 2-up, trapezoid and "Read More" from 992 px
 *   instead of 1200 px; the tile body keeps its 1rem top padding.
 * Block variant `about` (listing template, /about): 2-up, trapezoid and "Read More" from
 *   1440 px (col-xxl-6, d-xxl); no body padding (the source's text column has no pt-3/pb-3),
 *   the text's 3rem bottom space from 1440 px (pb-xxl-5), "Read More" at top 72 %
 *   (.internal-menu-link-original).
 * @ew-exempt the colour cell (metadata, never displayed); the "Read More" label and the
 *   trapezoid link are generated from the title's target (template text on the source)
 * In-page anchors: a section whose section-metadata carries `anchor | <id>` gets the source's
 * `<a id="<id>" class="anchor">` target before it.
 * Authored nodes are MOVED (EW1); wrappers carry the classes (EW2). Re-entrant (EW9).
 * @param {Element} block The subpage-tiles block element
 */
const PALETTE = {
  steel: 'rgb(79 143 176)',
  teal: 'rgb(95 160 151)',
  bronze: 'rgb(154 125 85)',
  indigo: 'rgb(80 79 184)',
  cobalt: 'rgb(77 109 178)',
  rust: 'rgb(184 94 71)',
  clay: 'rgb(148 85 76)',
  slate: 'rgb(73 91 129)',
  cyan: 'rgb(56 205 228)',
  // about landing (listing template)
  graphite: 'rgb(90 90 90)',
  taupe: 'rgb(117 110 108)',
  denim: 'rgb(87 115 145)',
  umber: 'rgb(130 94 86)',
  olive: 'rgb(162 148 93)',
  sage: 'rgb(138 137 118)',
  lilac: 'rgb(113 119 143)',
};

const MODIFIERS = ['spaced', 'gap'];

// a colour word outside the palette: the source's per-row ground as a hex value (`#587eb0`)
const HEX = /^#[0-9a-f]{6}$/;
const colourOf = (w) => PALETTE[w] || (HEX.test(w) ? w : null);

const SVG_NS = 'http://www.w3.org/2000/svg';

function wrapper(className, ...nodes) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...nodes);
  return div;
}

function ensureAnchors() {
  document.querySelectorAll('main .section[data-anchor]').forEach((section) => {
    const id = section.dataset.anchor.trim();
    if (!id || document.getElementById(id)) return;
    const a = document.createElement('a');
    a.id = id;
    a.className = 'anchor';
    a.setAttribute('aria-hidden', 'true');
    section.before(a);
  });
}

function cellNodes(cell) {
  const kids = [...cell.children];
  if (!kids.length && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    return [p];
  }
  return kids;
}

function colourWords(cell) {
  if (!cell || cell.querySelector('picture, img, a')) return null;
  const words = cell.textContent.trim().toLowerCase().split(/\s+/);
  if (!words[0] || !words.every((w) => colourOf(w) || MODIFIERS.includes(w))) return null;
  return words;
}

function trapezoid(href) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'internal-menu-trapezoid');
  svg.setAttribute('viewBox', '0 0 945 75');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const a = document.createElementNS(SVG_NS, 'a');
  a.setAttribute('href', href);
  const polygon = document.createElementNS(SVG_NS, 'polygon');
  polygon.setAttribute('points', '0,0 260,0 340,67 945,67 945,75 0,75');
  a.append(polygon);
  svg.append(a);
  return svg;
}

function link(href, ...nodes) {
  const a = document.createElement('a');
  a.href = href;
  a.append(...nodes);
  return a;
}

export default function decorate(block) {
  ensureAnchors();
  if (block.querySelector(':scope > .lightlink-row')) return; // re-entrant (EW9)

  const rows = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    let words = null;
    if (cells.length > 1) {
      words = colourWords(cells[cells.length - 1]);
      if (words) cells.pop();
    }
    let media = null;
    const nodes = [];
    cells.forEach((cell) => {
      cellNodes(cell).forEach((n) => {
        const pic = n.matches('picture, img') ? n : n.querySelector('picture, img');
        if (!media && pic && !n.textContent.trim()) media = pic;
        else nodes.push(n);
      });
    });
    if (!media && !nodes.length) return;

    const title = nodes.find((n) => n.querySelector('a'));
    const href = title?.querySelector('a').getAttribute('href') || '#';
    const text = nodes.filter((n) => n !== title);
    const colours = (words || []).filter((w) => colourOf(w));
    const [rowWord = 'steel', linkWord] = colours;

    const tile = document.createElement('div');
    tile.className = `lightlink-row${rows.length % 2 ? ' lightlink-row-reverse' : ''}`;
    tile.style.setProperty('--row-color', colourOf(rowWord));
    tile.style.setProperty('--link-color', colourOf(linkWord || rowWord));

    const mediaBox = wrapper('lightlink-media');
    if (media) mediaBox.append(link(href, media));
    if (title) mediaBox.append(wrapper('internal-menu-title', title));

    const target = new URL(href, window.location.href);
    const shapeHref = target.origin === window.location.origin
      ? `${target.pathname}${target.hash}` : target.href;
    const textClass = ['internal-menu-text',
      words?.includes('spaced') ? 'internal-menu-text-spaced' : '',
      words?.includes('gap') ? 'internal-menu-text-gap' : ''].filter(Boolean).join(' ');
    const body = wrapper(
      'lightlink-body',
      wrapper(textClass, ...text),
      wrapper('internal-menu-shape', wrapper('internal-menu-shape-box', trapezoid(shapeHref))),
      wrapper('internal-menu-link', link(href, ' Read More ')),
    );
    tile.append(...(rows.length % 2 ? [body, mediaBox] : [mediaBox, body]));
    rows.push(tile);
  });

  block.replaceChildren(...rows);
}
