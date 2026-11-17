/**
 * Data Table — the source's striped fact table (`table.table.table-striped`, telescope-dome.css
 * §10, source L2772–L2815, L15707) set inside the section text column at the 10.5% content
 * inset: one row per fact, label and value cells, alternate rows shaded, a 1px rule above each.
 *
 * Content model (reconstructive — one row per fact):
 *   | data-table              |
 *   | Label    | Value        |
 * - every block row → one table row; every cell → one table cell, in authored order
 *   (rows with more or fewer cells are kept as they are)
 * Variants: `spec` — comparison rows (label | value | value): a coloured arrow tab per row (the
 *   source's svg 30:4 tab, colours in row order) and white value boxes (mirror-m2m3).
 *   `bordered` — every cell ruled, value cells centred (Bootstrap .table-bordered); `ao-modes`
 *   (with `bordered`) — the adaptive optics modes table's coloured header row.
 * Authored nodes are MOVED into the cells (EW1); the table / wrapper carry the classes (EW2).
 * Re-entrant (EW9).
 * @param {Element} block The data-table block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .data-table-scroll')) return; // re-entrant (EW9)

  const table = document.createElement('table');
  table.className = 'data-table-table';
  const tbody = document.createElement('tbody');
  table.append(tbody);

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) return;
    const tr = document.createElement('tr');
    cells.forEach((cell) => {
      const td = document.createElement('td');
      td.append(...cell.childNodes);
      tr.append(td);
    });
    tbody.append(tr);
  });

  const scroll = document.createElement('div');
  scroll.className = 'data-table-scroll';
  scroll.append(table);
  block.replaceChildren(scroll);
}
