/**
 * Text Section — the source's light/dark page-section body (about-road.css §3–§5, source
 * elt_assets L16125–L20256): a section title, text, sub-titles, linked wide images, image rows
 * with captions and a floated image beside text, in authored order, at the source's 10.5%
 * content inset and per-tier type ramp.
 *
 * Content model (one block per titled run; content is classified by element, not row index):
 *   | text-section                                               |
 *   | Section title (## heading, or a lone paragraph)            |
 *   | paragraphs, lists, tables, ## / ### / #### inline headings  |
 *   | **Sub-title** (a row holding one fully bold paragraph)      |
 *   | [linked] image                                             |
 *   | image + caption | image + caption | …   (several cells: an image row)   |
 *   | image | text paragraphs              (image cell + text cell: floated image) |
 * - the section title (`.section-title-paragraph`): a leading h1–h2, or — the source's title is
 *   plain text — a first row holding one lone text paragraph when more rows follow
 * - a paragraph holding only an image (optionally linked) → a wide image (`figure.article-image`)
 * - every other element → grouped text (`.section-text-paragraph`); headings keep the source's
 *   Bootstrap heading type, tables are wrapped for horizontal scroll
 * Variants: `bleed` (images full-bleed, no inset), `inline-titles` (the source's
 *   `.container-title` title type), `bordered` (Bootstrap `.table` rules), `centered` (centred
 *   table cells), `faq` (numbered index, Q:/A: paragraphs, "Top" links; questions get the ids
 *   `question_<n>` the index links to, the first faq section gets `faq_top`), `webcams` (image
 *   stamp paragraphs overlaid on the image, natural-width centred images, the interactive view
 *   — an image followed by its description — a 360° viewer of the linked panorama over a 400 px
 *   poster: pano-viewer.js; `webcams narrow-text` — a 280 px description measure below 576 px,
 *   R-01 wrap), `measure-nudge` [`nudge-fine`] (1440–1679 px: the first paragraph's
 *   measure/word-spacing nudge
 *   for the source's line count under the fallback face, R-01), `narrow-image` (the wide
 *   image at the source's 80 %), `sup-metrics` (Bootstrap sub/sup metrics), `narrow-measure`
 *   (below 576 px a 282 px text measure, + `measure-280`: 280 px; R-01 wrap),
 *   `tight-tracking` (below 576 px -0.1 px tracking, R-01 wrap),
 *   `logo-widths` (about-industrial: three table logos at the source's own widths).
 *   `intro` — the section after a page-intro: below 992 px it echoes the page-intro subtitle
 *   and description under the title (above 992 px the page-intro shows them), as the source does.
 *   `intro program` — the same echoes one tier up (below 1200 px; description 1200–1440 px).
 *   `row-styles` — one group per row (rows are not merged) and an optional LAST cell of style
 *   words per row (instrument template):
 *     text row: `subtitle` | `heading` | `float` (text beside a floated figure) | `contacts`
 *     image row (image paragraph + optional caption paragraphs in the first cell):
 *       `right` | `left` (floated from 992 px; the image row right after the title floats
 *       beside it), `quarter` 25% | `third` 33% | `narrow` 35% | `medium` 40% (default) |
 *       `large` 42% | `half` 50% | `wide` 60%, `flush` (program template: the source's
 *       .container-paragraph-right shell — no left inset from 992 px),
 *       `reveal` (fade-right reveal when scrolled 300 px into view, reverses on scroll back)
 *     several image cells in one row → an image row (one column per cell from 992 px, the
 *       caption paragraphs under each image);
 *     an image row without float words is a wide figure; its caption paragraphs → figcaption;
 *       `inset` keeps it at the content inset (in a `bleed` block), a size word sets the image
 *       width, `shadow` the source's .image-shadow
 *     any row: `clear` (starts below the floated figures above), `centered` (centred text)
 *     text rows also: `gap` (the source's trailing `<p>&nbsp;</p>`, dropped by the pipeline: one
 *       empty text line under the group)
 *     image rows also: `xwide` 80% image width, `border` (the source's 1px rgb(188 189 190) rule)
 *   `snug-captions` (CSS only, program template) — the block's captioned image rows sit in the
 *   source's bare .m-0: no 1vw under the row, the caption column's pt-3 and 15 px gutters only
 *   `spec-head` (CSS only, mirror-m2m3) — the M2 | M3 heading table above the data-table `spec`
 *   rows: the source's cell widths and each cell's paragraph box
 *   `grey-triptych`, `row-images-full`, `plain-nutshell`, `h2-spaced`, `empty-echo` (CSS only,
 *   program template) — the three-image caption row on grey / white grounds; image rows at the full
 *   column; a nutshell outside a .page-section (no sub-title echo padding, Bootstrap h2); the
 *   source's empty heading / paragraph around an h2; the empty below-1200 description echo
 *   `fit-s-*` / `fit-l-*` (CSS only, program template) — per-block R-01 measure / tracking fits
 *   below 576 px / at 1440–1679 px (pr1 pr2 ls-p05 ls-p1 ls-n05 ls-n1 ws-p4 ws-n4);
 *   `fitp<n>-s-<fit>` / `fitp<n>-l-<fit>` the same on the block's n-th text element only
 *   `h2-text` (CSS only, program template) — an <h2> in the section text set in the source's
 *   .page-section h2 ramp (text size and line height, bold)
 *   `continued` (with `row-styles`) — the rest of a section after a widget or data-table block:
 *   its first row is never taken as the section title
 *   `video-caption` — the caption block authored right after a youtube widget link: it sits
 *   under the player as the source's in-paragraph caption does (the widget's own bottom space
 *   is taken back, the source's text padding kept above the player)
 *   `y-2` (CSS only; listing) — the source's .container-y-2 2rem bottom space, on a section's
 *   last text-section
 *   `grey-pair` (CSS only; listing) — an image row of two linked images on the source's grey
 *   ground, 81 % wide, meeting in the middle from 992 px (with `bleed`)
 *   `media-info` (CSS only; archetype-media) — the News & Multimedia information section: the
 *   .page-section h2 ramp and the press-kit image row's (`half`) 4rem bottom space
 *   `media-intro` (CSS only; archetype-media) — the News & Multimedia intro text (a < 576 px
 *   tracking nudge, R-01)
 * @variants row-styles style cell: subtitle | heading | float | contacts | right | left | quarter
 *   | third | narrow | medium | large | half | wide | xwide | flush | reveal | inset | shadow
 *   | border | gap | clear | centered
 * @ew-exempt `intro` echoes are presentational clones of the page-intro texts; `row-styles`
 *   style cells are metadata (never displayed); the below-992 copy of a floated figure is a
 *   presentational clone.
 * A share-bar block authored in the same section is docked in the title row.
 * Authored nodes are MOVED (EW1); wrappers carry the classes (EW2).
 * @param {Element} block The text-section block element
 */
function isImageParagraph(el) {
  if (el.tagName === 'PICTURE' || el.tagName === 'IMG') return true;
  if (el.tagName !== 'P') return false;
  return !!el.querySelector('picture, img') && !el.textContent.trim();
}

/* a paragraph that is one <strong> run: the sub-title row (never the section title) */
function isBoldParagraph(p) {
  return p.tagName === 'P' && p.childElementCount === 1
    && p.firstElementChild.tagName === 'STRONG'
    && p.textContent.trim() === p.firstElementChild.textContent.trim();
}

function wrapper(className, ...children) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...children);
  return div;
}

function mediaOf(el) {
  if (el.tagName !== 'P') return el;
  return el.querySelector('a') || el.querySelector('picture, img');
}

function newTab(media) {
  if (media.tagName === 'A' && media.origin !== window.location.origin) {
    media.target = '_blank'; // the source opens image links in a new tab
    media.rel = 'noopener noreferrer';
  }
  return media;
}

function figure(className, media) {
  const fig = document.createElement('figure');
  fig.className = className;
  fig.append(newTab(media));
  return fig;
}

function dockShareBar(block, title) {
  const section = block.closest('.section');
  const share = section?.querySelector('.share-bar');
  if (!share || !title || share.closest('.text-section')) return;
  const shareWrapper = share.parentElement;
  title.classList.add('has-share');
  title.append(share);
  if (shareWrapper?.classList.contains('share-bar-wrapper') && !shareWrapper.children.length) {
    shareWrapper.remove();
  }
}

/* webcams: the stamp paragraphs authored under a webcam image (a "<camera> | <date> <time> …"
   line, then "Latest Available Image") are moved onto the image as the source's overlays */
const STAMP = /\|\s*\d{1,2} \w{3} \d{4} \d{1,2}:\d{2}/;
function frameStamps(media, holder) {
  const frame = wrapper('webcam-frame');
  media.replaceWith(frame);
  frame.append(media);
  const kids = [...holder.children].filter((el) => el.tagName === 'P');
  const at = kids.findIndex((p) => STAMP.test(p.textContent));
  if (at < 0) return;
  const time = kids[at];
  time.classList.add('webcam-stamp', 'webcam-timestamp');
  frame.append(time);
  const next = kids[at + 1];
  if (next && !next.querySelector('a, img') && next.textContent.trim().split(/\s+/).length <= 4) {
    next.classList.add('webcam-stamp', 'webcam-nolive');
    frame.append(next);
  }
}

// out: the block's decorated children (not yet attached) — returns them minus emptied text groups
function decorateWebcams(out) {
  out.forEach((el, i) => {
    if (el.matches('figure.article-image-row')) {
      el.querySelectorAll('.article-image-cell').forEach((cell) => {
        const caption = cell.querySelector('.article-image-caption');
        const media = cell.firstElementChild;
        if (!caption || !media || media === caption) return;
        frameStamps(media, caption);
        if (!caption.children.length) caption.remove();
      });
    } else if (el.matches('figure.article-image')) {
      const text = out[i + 1];
      if (!text?.classList.contains('section-text-paragraph')) return;
      frameStamps(el.firstElementChild, text);
    }
  });
  return out.filter((el) => !el.classList.contains('section-text-paragraph') || el.children.length);
}

/* webcams interactive view (a frame followed by its description): the 360° viewer */
function webcamViewers(block) {
  const frames = [...block.querySelectorAll('figure.article-image + .section-text-paragraph')]
    .map((text) => text.previousElementSibling.querySelector('.webcam-frame'))
    .filter((frame) => frame?.querySelector('a[href$=".jpg" i]'));
  if (!frames.length) return;
  import('./pano-viewer.js').then(({ default: panoViewer }) => frames.forEach(panoViewer));
}

const strongLead = (p, text) => p.firstElementChild?.tagName === 'STRONG'
  && p.firstElementChild.textContent.trim() === text;

function isTopLink(p) {
  const a = p.querySelector('a[href="#faq_top"]');
  return !!a && p.textContent.trim() === a.textContent.trim();
}

/* FAQ: index items, Q:/A: paragraphs and Top links in the source's faq-paragraph shells */
function decorateFaq(text) {
  let answer = null;
  [...text.children].forEach((el) => {
    if (el.tagName !== 'P') {
      answer = null;
      return;
    }
    let shell = null;
    if (strongLead(el, 'Q:')) {
      shell = wrapper('faq-paragraph faq-question');
      const n = document.querySelectorAll('.faq-question').length
        + text.querySelectorAll('.faq-question').length + 1;
      shell.id = `question_${n}`;
      answer = null;
    } else if (strongLead(el, 'A:')) {
      shell = wrapper('faq-paragraph faq-answer');
      answer = shell;
    } else if (isTopLink(el)) {
      shell = wrapper('faq-top');
      answer = null;
    } else if (answer) {
      answer.append(' ', el);
      return;
    } else if (/^\d+\.\s/.test(el.textContent.trim())) {
      shell = wrapper('faq-paragraph faq-index');
    }
    if (shell) {
      el.before(shell);
      shell.append(el);
    }
  });
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  el.removeAttribute('data-image-index');
  return el;
}

function echo(className, source) {
  const div = wrapper(className);
  [...source.children].forEach((n) => div.append(stripInstrumentation(n.cloneNode(true))));
  return div;
}

// `intro`: the page-intro subtitle / description repeated under the title below 992 px
function echoIntro(block, title) {
  if (block.querySelector('.intro-echo')) return;
  const intro = document.querySelector('main .page-intro');
  const subtitle = intro?.querySelector('.header-subtitle');
  const description = intro?.querySelector('.header-description');
  const echoes = [];
  if (description) {
    echoes.push(echo('section-subtitle-paragraph container-subtitle intro-echo intro-echo-wide', description));
  }
  if (subtitle) {
    echoes.push(echo('section-subtitle-paragraph container-subtitle intro-echo intro-echo-subtitle', subtitle));
  }
  if (description) {
    echoes.push(echo('section-text-paragraph container-paragraph intro-echo intro-echo-text', description));
  }
  if (title) title.after(...echoes);
  else block.prepend(...echoes);
}

const SIZE_WORDS = ['quarter', 'third', 'narrow', 'medium', 'large', 'half', 'wide', 'xwide'];
const ROW_WORDS = ['subtitle', 'heading', 'float', 'contacts', 'right', 'left', 'reveal', 'inset',
  'shadow', 'border', 'clear', 'centered', 'flush', 'gap', ...SIZE_WORDS];

function styleWords(cell) {
  if (!cell || cell.querySelector('picture, img, a')) return null;
  const words = cell.textContent.trim().toLowerCase().split(/\s+/);
  return words[0] && words.every((w) => ROW_WORDS.includes(w)) ? words : null;
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

// AOS fade-right (offset 300, 400 ms ease, once: false, scroll handler throttled 99 ms)
function watchReveal(block) {
  const els = [...block.querySelectorAll('[data-aos]')];
  if (!els.length) return;
  const trigger = (el) => {
    const offset = parseInt(el.dataset.aosOffset || '120', 10);
    return el.getBoundingClientRect().top + window.scrollY - window.innerHeight + offset;
  };
  const refresh = () => {
    els.forEach((el) => el.classList.toggle('aos-animate', window.scrollY >= trigger(el)));
  };
  els.forEach((el) => el.classList.add('aos-init'));
  let timer = null;
  window.addEventListener('scroll', () => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      refresh();
    }, 99);
  }, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  refresh();
}

function figureBody(nodes, words) {
  const [image, ...caption] = nodes;
  const parts = [newTab(mediaOf(image))];
  if (caption.length) parts.push(wrapper('caption-text', ...caption));
  if (!words.includes('reveal')) return parts;
  const aos = wrapper('aos-box', ...parts);
  aos.dataset.aos = 'fade-right';
  aos.dataset.aosOffset = '300';
  return [aos];
}

// image row (col-lg-3 / -4 / -6): one column per cell, an optional caption under each image
function imageRow(cells) {
  const grid = document.createElement('figure');
  grid.className = 'article-image article-image-row';
  grid.style.setProperty('--columns', cells.length);
  cells.forEach((cell) => {
    const [image, ...captions] = cellNodes(cell);
    const col = wrapper('article-image-cell');
    col.append(newTab(mediaOf(image)));
    if (captions.length) col.append(wrapper('article-image-caption', ...captions));
    grid.append(col);
  });
  return grid;
}

// `row-styles`: one group per row, an optional trailing style-word cell per row
function decorateRows(block) {
  const rows = [...block.children];
  const out = [];
  let title = null;
  const continued = block.classList.contains('continued');
  rows.forEach((row, i) => {
    const cells = [...row.children];
    let words = [];
    if (cells.length > 1) {
      const found = styleWords(cells[cells.length - 1]);
      if (found) {
        words = found;
        cells.pop();
      }
    }
    const imageCells = cells.filter((c) => {
      const first = cellNodes(c)[0];
      return first && isImageParagraph(first);
    });
    if (cells.length > 1 && imageCells.length === cells.length) {
      const grid = imageRow(cells);
      if (words.includes('inset')) grid.classList.add('article-image-inset');
      out.push(grid);
      return;
    }
    const nodes = cells.flatMap(cellNodes);
    if (!nodes.length) return;
    const lone = nodes.length === 1 && nodes[0].tagName === 'P' && !isImageParagraph(nodes[0]);
    if (!title && !out.length && rows.length > 1 && !words.length && !continued
      && (lone || /^H[12]$/.test(nodes[0].tagName))) {
      title = wrapper('section-title-paragraph container-paragraph', ...nodes);
      out.push(title);
    } else if (isImageParagraph(nodes[0])) {
      const side = words.find((w) => w === 'right' || w === 'left');
      if (side) {
        const size = words.find((w) => SIZE_WORDS.includes(w)) || 'medium';
        const desktop = document.createElement('figure');
        desktop.className = `float-figure float-figure-${side} float-figure-${size}`;
        desktop.append(...figureBody(nodes, words));
        const mobile = stripInstrumentation(desktop.cloneNode(true));
        mobile.className = 'float-figure-mobile';
        const afterTitle = title && out[out.length - 1] === title && i > 0;
        if (words.includes('flush')) desktop.classList.add('float-figure-flush');
        if (afterTitle) {
          desktop.classList.add('image-title-paragraph');
          out.splice(out.indexOf(title), 0, wrapper('container-paragraph float-figure-box', desktop));
          out.push(wrapper('container-paragraph float-figure-box', mobile));
        } else {
          out.push(wrapper('container-paragraph float-figure-box', desktop, mobile));
        }
      } else {
        const fig = document.createElement('figure');
        fig.className = 'article-image';
        if (words.includes('inset')) fig.classList.add('article-image-inset');
        const width = words.find((w) => SIZE_WORDS.includes(w));
        if (width) fig.classList.add(`article-image-${width}`);
        if (words.includes('shadow')) fig.classList.add('article-image-shadow');
        if (words.includes('border')) fig.classList.add('article-image-border');
        const [image, ...caption] = nodes;
        fig.append(newTab(mediaOf(image)));
        if (caption.length) {
          fig.classList.add('article-image-captioned');
          const figcaption = document.createElement('figcaption');
          figcaption.className = 'caption-text';
          figcaption.append(...caption);
          fig.append(figcaption);
        }
        out.push(fig);
      }
    } else if (words.includes('subtitle') || nodes[0].tagName === 'H3') {
      const sub = wrapper('section-subtitle-paragraph container-subtitle', ...nodes);
      if (words.includes('float')) sub.classList.add('float-text');
      out.push(sub);
    } else if (words.includes('heading') || /^H[4-6]$/.test(nodes[0].tagName)) {
      out.push(wrapper('section-heading-paragraph container-heading', ...nodes));
    } else if (words.includes('contacts')) {
      out.push(wrapper('container-paragraph contacts', ...nodes));
    } else if (words.includes('float')) {
      out.push(wrapper('container-paragraph float-text', ...nodes));
    } else {
      out.push(wrapper('section-text-paragraph container-paragraph', ...nodes));
    }
    const last = out[out.length - 1];
    if (words.includes('clear') && last) last.classList.add('float-clear');
    if (words.includes('centered') && last) last.classList.add('text-centered');
    if (words.includes('gap') && last) last.classList.add('text-gap');
  });

  block.classList.add('page-section');
  block.replaceChildren(...out);
  dockShareBar(block, title);
  if (block.classList.contains('intro')) echoIntro(block, title);
  watchReveal(block);
}

// `fitp<n>-<s|l>-<fit>` (program, R-01): the n-th text element of the block (p / li / h2 outside
// echoes, captions, floated figures and tables, document order, 1-based) takes `fit-<s|l>-<fit>`
function paragraphFits(block) {
  const fits = [...block.classList].map((c) => c.match(/^fitp(\d+)-([sl]-[a-z0-9-]+)$/)).filter(Boolean);
  if (!fits.length) return;
  const items = [...block.querySelectorAll('p, li, h2')].filter((el) => !el.closest(
    '.intro-echo, figcaption, .article-image-caption, .float-figure, .float-figure-mobile, table',
  ));
  fits.forEach(([, n, fit]) => items[Number(n) - 1]?.classList.add(`fit-${fit}`));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .section-title-paragraph, :scope > .section-text-paragraph')) {
    return; // re-entrant (EW9)
  }

  if (block.classList.contains('row-styles')) {
    decorateRows(block);
    paragraphFits(block);
    return;
  }

  // a first row holding one lone text paragraph is the title slot (when more rows follow)
  const firstRow = block.firstElementChild;
  const firstKids = firstRow ? [...firstRow.querySelectorAll(':scope > div > *')] : [];
  const titleParagraph = block.children.length > 1 && firstKids.length === 1
    && firstKids[0].tagName === 'P' && !isImageParagraph(firstKids[0])
    && firstKids[0].textContent.trim() && !isBoldParagraph(firstKids[0]) ? firstKids[0] : null;

  const out = [];
  let title = null;
  let text = null;
  const textGroup = () => {
    if (!text) {
      text = wrapper('section-text-paragraph container-paragraph');
      out.push(text);
    }
    return text;
  };

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length > 1) {
      text = null;
      const imageCells = cells.filter((c) => {
        const first = c.firstElementChild;
        return first && isImageParagraph(first);
      });
      if (imageCells.length === cells.length) {
        // image row: one column per cell, an optional caption under each image
        const grid = document.createElement('figure');
        grid.className = 'article-image article-image-row';
        grid.style.setProperty('--columns', cells.length);
        cells.forEach((cell) => {
          const kids = [...cell.children];
          const col = wrapper('article-image-cell');
          col.append(newTab(mediaOf(kids[0])));
          const captions = kids.slice(1);
          if (captions.length) {
            const caption = wrapper('article-image-caption');
            caption.append(...captions);
            col.append(caption);
          }
          grid.append(col);
        });
        out.push(grid);
      } else {
        // floated image beside text: first cell image, the other cells text
        const float = wrapper('float-row container-paragraph');
        cells.forEach((cell) => {
          const kids = [...cell.children];
          if (kids.length && isImageParagraph(kids[0]) && !float.querySelector('.float-image')) {
            float.append(figure('float-image', mediaOf(kids[0])));
          } else {
            const body = wrapper('float-text section-text-paragraph');
            body.append(...kids);
            float.append(body);
          }
        });
        out.push(float);
      }
      return;
    }

    const cell = cells[0] || row;
    let nodes = [...cell.children];
    if (!nodes.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      nodes = [p];
    }
    // sub-title row: one fully bold paragraph
    const only = nodes.length === 1 ? nodes[0] : null;
    if (only && only !== titleParagraph && isBoldParagraph(only)) {
      const sub = wrapper('section-subtitle-paragraph container-subtitle');
      sub.append(only);
      out.push(sub);
      text = null;
      return;
    }

    nodes.forEach((el) => {
      const tag = el.tagName;
      if (!title && !out.length && (/^H[12]$/.test(tag) || el === titleParagraph)) {
        title = wrapper('section-title-paragraph container-paragraph');
        title.append(el);
        out.push(title);
        text = null;
      } else if (isImageParagraph(el)) {
        out.push(figure('article-image', mediaOf(el)));
        text = null;
      } else if (tag === 'TABLE') {
        const scroll = wrapper('table-responsive');
        textGroup().append(scroll);
        scroll.append(el);
      } else {
        textGroup().append(el);
      }
    });
  });

  if (block.classList.contains('faq')) {
    out.filter((el) => el.classList.contains('section-text-paragraph')).forEach(decorateFaq);
    const section = block.closest('.section');
    if (title && section && !document.getElementById('faq_top')) section.id = 'faq_top';
  }

  block.classList.add('page-section'); // the source's section module class
  block.replaceChildren(...(block.classList.contains('webcams') ? decorateWebcams(out) : out));
  if (block.classList.contains('webcams')) webcamViewers(block);
  dockShareBar(block, title);
  if (block.classList.contains('intro')) echoIntro(block, title);
  paragraphFits(block);
}
