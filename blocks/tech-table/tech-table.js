/**
 * Tech Table — the source's technical-specification rows (instrument-harmoni.css §9, source
 * L640, L1564, L15712): white shadowed rows, a coloured arrow tab with the property name over it
 * (one third from 768 px) and the value centred beside it.
 *
 * Content model (reconstructive — one row per property):
 *   | tech-table                              |
 *   | Property | Value (paragraphs) | colour  |
 * - cell 1 → property name, cell 2 → value; a two-cell row takes the next colour of the default
 *   sequence (red, amber, yellow, green, sky)
 * - cell 3 (optional): the tab colour, one word from the palette below
 *   plus the optional word `inline`: the source sets the value as an inline run inside its
 *   paragraph (`<p><span>…</span></p>`) — the value text is wrapped the same way
 * @variants colour cell: red | amber | yellow | green | sky | cyan | orchid | violet | navy
 *   (the source's per-row tab colours) | inline
 * @ew-exempt the colour cell (metadata, never displayed)
 * Authored nodes are MOVED (EW1); wrappers carry the classes (EW2). Re-entrant (EW9).
 * @param {Element} block The tech-table block element
 */
const PALETTE = {
  red: 'rgb(240 90 67)',
  amber: 'rgb(251 159 2)',
  yellow: 'rgb(251 193 3)',
  green: 'rgb(42 187 119)',
  sky: 'rgb(56 169 228)',
  cyan: 'rgb(56 205 228)',
  orchid: 'rgb(186 109 202)',
  violet: 'rgb(130 109 203)',
  navy: 'rgb(76 75 140)',
};
const SEQUENCE = ['red', 'amber', 'yellow', 'green', 'sky'];
const SVG_NS = 'http://www.w3.org/2000/svg';

function cellNodes(cell) {
  if (!cell) return [];
  const kids = [...cell.children];
  if (!kids.length && cell.textContent.trim()) {
    const p = document.createElement('p');
    p.append(...cell.childNodes);
    return [p];
  }
  return kids;
}

function tab() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'tech-row-tab');
  svg.setAttribute('viewBox', '0 0 30 4');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const polygon = document.createElementNS(SVG_NS, 'polygon');
  polygon.setAttribute('points', '0,0 20,0 30,2 20,4 0,4');
  svg.append(polygon);
  return svg;
}

function tableCell(nodes) {
  const div = document.createElement('div');
  div.className = 'tech-table-cell';
  div.append(...nodes);
  return div;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .tech-table-list')) return; // re-entrant (EW9)
  const list = document.createElement('dl');
  list.className = 'tech-table-list';
  [...block.children].forEach((row, i) => {
    const cells = [...row.children];
    let word = SEQUENCE[i % SEQUENCE.length];
    let inline = false;
    const last = cells[cells.length - 1];
    if (cells.length > 2 && !last.querySelector('a, picture, img')) {
      const words = last.textContent.trim().toLowerCase().split(/\s+/);
      if (PALETTE[words[0]] && words.slice(1).every((w) => w === 'inline')) {
        [word] = words;
        inline = words.includes('inline');
        cells.pop();
      }
    }
    const [keyCell, ...valueCells] = cells;
    const keyNodes = cellNodes(keyCell);
    const valueNodes = valueCells.flatMap(cellNodes);
    if (!keyNodes.length && !valueNodes.length) return;

    const item = document.createElement('div');
    item.className = 'tech-row';
    item.style.setProperty('--tab-color', PALETTE[word]);
    const dt = document.createElement('dt');
    dt.className = 'tech-row-key';
    dt.append(tab(), tableCell(keyNodes));
    const dd = document.createElement('dd');
    dd.className = 'tech-row-value';
    if (inline) {
      valueNodes.filter((n) => n.tagName === 'P').forEach((p) => {
        const span = document.createElement('span');
        span.append(...p.childNodes);
        p.append(span);
      });
    }
    dd.append(tableCell(valueNodes));
    item.append(dt, dd);
    list.append(item);
  });
  block.replaceChildren(list);
}
