/**
 * Facts — the facts template's centred name/value list on the dark-blue band
 * (about-facts.css `.facts-list`, source `.w-100.d-flex.flex-column.align-items-center`).
 *
 * Content model: one row per fact — cell 1 the fact name (orange), cell 2 the value
 * (one or more paragraphs). A row with a single cell renders as a value only; extra cells
 * are appended to the value. Reconstructive: rows are classified by position inside the row
 * only; the cells (structure divs) carry the layout classes and the authored nodes inside
 * them are never rebuilt or retagged (EW1/EW2). Re-entrant (EW9).
 * @param {Element} block The facts block element
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .facts-list')) return;
  const list = document.createElement('div');
  list.className = 'facts-list';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length) {
      row.remove();
      return;
    }
    const [first, ...rest] = cells;
    if (rest.length) {
      first.className = 'fact-name';
      const value = rest.shift();
      value.className = 'fact-value';
      rest.forEach((extra) => value.append(...extra.childNodes));
      list.append(first, value);
    } else {
      first.className = 'fact-value';
      list.append(first);
    }
    row.remove();
  });
  block.replaceChildren(list);
}
