/**
 * Page Intro — the source's sub-header band (instrument-harmoni.css §3, source L15908–L15970,
 * L19587, L20196): a full-width banner image with a text block laid over it at the 10.5% content
 * inset — title (light blue), subtitle, description and a quick-links line.
 *
 * Content model (template-slotted; rows are classified by role, not by index):
 *   | page-intro                                                   |
 *   | banner image                                                 |
 *   | Title                                    (one paragraph)     |
 *   | Subtitle                                 (one paragraph)     |
 *   | Description                              (paragraphs)        |
 *   | Quick Links:  /  [Science](#science) | [Design](#design) …  |
 * - the row holding a picture → banner image
 * - the first text row → title; the LAST text row holding links → quick links (a link-less
 *   paragraph in it is the "Quick Links:" label); the text row after the title → subtitle;
 *   every other text row → description
 * Responsive visibility (the source's d-lg / d-xl utilities): subtitle from 992 px, description
 * from 1200 px. The text-section `intro` variant echoes both into the following section below
 * those widths, as the source does.
 * Variants: `program` (program template — subtitle / description 35% wide, shown from 1200 /
 *   1440 px; the text-section `intro program` echoes them below those widths).
 *   `quick-sm` (with `program`): the quick-links line from 576 px only (mirror pages).
 * In-page anchors: a section whose section-metadata carries `anchor | <id>` gets the source's
 * `<a id="<id>" class="anchor">` target before it, so the quick links resolve.
 * Authored nodes are MOVED (EW1); wrappers carry the classes (EW2). Re-entrant (EW9).
 * @param {Element} block The page-intro block element
 */
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

function rowNodes(row) {
  const nodes = [];
  [...row.children].forEach((cell) => {
    const kids = [...cell.children];
    if (!kids.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes.push(p);
    } else {
      nodes.push(...kids);
    }
  });
  return nodes;
}

export default function decorate(block) {
  ensureAnchors();
  if (block.querySelector(':scope > .page-intro-textblock')) return; // re-entrant (EW9)

  let media = null;
  const textRows = [];
  [...block.children].forEach((row) => {
    const nodes = rowNodes(row);
    const pic = nodes.find((n) => n.matches('picture, img') || n.querySelector('picture, img'));
    if (!media && pic && !row.textContent.trim()) {
      media = pic.querySelector('picture, img') || pic;
    } else if (nodes.length) {
      textRows.push(nodes);
    }
  });

  const inner = wrapper('page-intro-textblock-inner');
  let links = null;
  const last = textRows[textRows.length - 1];
  if (textRows.length > 1 && last.some((n) => n.querySelector('a'))) links = textRows.pop();

  textRows.forEach((nodes, i) => {
    if (i === 0) inner.append(wrapper('header-title', ...nodes));
    else if (i === 1) inner.append(wrapper('header-subtitle', ...nodes));
    else inner.append(wrapper('header-description', ...nodes));
  });
  if (links) {
    const quick = wrapper('header-quick-links');
    links.forEach((n) => {
      quick.append(wrapper(n.querySelector('a') ? 'quick-links-list' : 'quick-links-label', n));
    });
    inner.append(quick);
  }

  const out = [];
  if (media) out.push(wrapper('page-intro-image', media));
  out.push(wrapper('page-intro-textblock', inner));
  block.replaceChildren(...out);
}
