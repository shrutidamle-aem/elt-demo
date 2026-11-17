/**
 * Media Stories — the source's "Featured Stories" grid on News & Multimedia (media.css §4,
 * source elt_assets_visuals V: .stories-container … .section-title-nolink): category tabs above
 * a 3 / 2 / 1-column grid of stamped story cards and a closing "More..." tile.
 *
 * Content model (reconstructive — rows classified by content, never by index):
 *   | media-stories                                                        |
 *   | - All - Press Releases - … - [Explorer](/media/explorer/)  (a list)  |
 *   | image | Video / 5 Nov 2026 — cs0032a / [Title](https://…)  (a story) |
 *   | More...                                     (a row without image)    |
 * - a row holding a list → the category tabs; a list item label selects a category (All,
 *   Press Releases, Announcements, Pictures of the Week, Blog Posts, Videos); an item holding a
 *   link stays a link (Explorer)
 * - a row holding a picture → a story card: the picture, then the paragraphs in order — the
 *   category stamp, the date line, the title (its link is the card target: card-as-link, EW6)
 * - a row without picture or list → the "More..." tile label
 * Behaviour (the source's inline script, observed firing): "More..." appends the next six stories
 * of the current category, a tab clears the grid and shows the first five of its category, the
 * "More..." tile hides when the list runs out. The story list beyond the authored cards is the
 * source page's own `stories` array (eso.org feed snapshot, dynamic-features row 8), served as
 * `stories.json` beside this file; the authored cards are its first five entries.
 * Classes `.stories-container > .story-container` are the units family's build selector.
 * Authored nodes are MOVED, never rebuilt (EW1); the tabs are spans, not buttons (EW7).
 * Feed cards (rendered on interaction only) are generated from data, not authored content.
 * @ew-exempt feed cards appended by "More..." / a category tab are data-fed (stories.json).
 * Re-entrant (EW9).
 * @param {Element} block The media-stories block element
 */
const CATEGORIES = {
  all: 'all',
  'press releases': 'release',
  announcements: 'announcement',
  'pictures of the week': 'potw',
  'blog posts': 'post',
  videos: 'video',
};

const STAMPS = {
  release: 'Press Release',
  announcement: 'Announcement',
  potw: 'Picture of the Week',
  post: 'Blog Post',
  video: 'Video',
};

const FIRST = 5;
const INCREMENT = 6;

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children);
  return node;
}

function card(href, image, stamp, date, title) {
  const link = el('a');
  if (href) link.href = href;
  const imageBox = el('div', 'story-img-container', image);
  if (stamp) imageBox.append(el('div', 'section-title section-title-nolink story-category-stamp', stamp));
  const description = el('div', 'story-description');
  if (date) description.append(el('div', 'date', date));
  if (title) description.append(el('div', 'title', title));
  link.append(imageBox, description);
  return el('div', 'story-container', link);
}

function authoredCard(row) {
  const picture = row.querySelector('picture') || row.querySelector('img');
  const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
  if (img) img.classList.add('story-img');
  const paragraphs = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture, img'));
  const titleP = paragraphs.find((p) => p.querySelector('a[href]')) || paragraphs[paragraphs.length - 1];
  const anchor = titleP && titleP.querySelector('a[href]');
  const href = anchor ? anchor.getAttribute('href') : null;
  if (anchor) anchor.replaceWith(...anchor.childNodes);
  const rest = paragraphs.filter((p) => p !== titleP);
  const [stamp, date, ...extra] = rest;
  const story = card(href, picture, stamp || '', date || '', titleP || '');
  if (extra.length) story.querySelector('.story-description').append(...extra);
  return story;
}

function feedCard(story) {
  const img = el('img', 'story-img');
  img.src = story.main_visual_url;
  img.alt = story.main_visual_title || '';
  img.loading = 'lazy';
  return card(
    story.absolute_url,
    img,
    STAMPS[story.category] || '',
    `${story.release_date} - ${story.id}`,
    story.title,
  );
}

function decorateTabs(list) {
  const tabs = el('div', 'story-categories');
  [...list.children].forEach((li) => {
    const link = li.querySelector('a[href]');
    if (link) {
      link.classList.add('story-category');
      tabs.append(link);
      return;
    }
    const tab = el('span', 'story-category', ...li.childNodes);
    const key = CATEGORIES[tab.textContent.trim().toLowerCase()];
    if (key) tab.dataset.category = key;
    tabs.append(tab);
  });
  const first = tabs.querySelector('[data-category="all"]') || tabs.querySelector('[data-category]');
  if (first) first.classList.add('story-selected-category');
  return el('div', 'title-categories', tabs);
}

function wire(block, grid, moreTile, tabs) {
  let data = null;
  let counter = FIRST;
  let category = 'all';

  const load = async () => {
    if (data) return data;
    try {
      const resp = await fetch(
        `${window.hlx?.codeBasePath || ''}/blocks/media-stories/stories.json`,
      );
      data = resp.ok ? await resp.json() : [];
    } catch (e) {
      data = [];
    }
    return data;
  };

  const loadMore = async (step = INCREMENT) => {
    const list = (await load()).filter((s) => category === 'all' || s.category === category);
    const next = counter + step;
    const slice = list.slice(counter, next);
    moreTile.style.display = slice.length === step ? '' : 'none';
    slice.forEach((story) => moreTile.before(feedCard(story)));
    counter = next;
  };

  const more = moreTile.querySelector('.story-more-container');
  more.addEventListener('click', () => loadMore());

  if (!tabs) return;
  tabs.querySelectorAll('.story-category[data-category]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;
      if (cat === category) return;
      category = cat;
      counter = 0;
      tabs.querySelectorAll('.story-category').forEach((t) => {
        t.classList.toggle('story-selected-category', t === tab);
      });
      [...grid.children].filter((c) => c !== moreTile).forEach((c) => c.remove());
      loadMore(FIRST);
    });
  });
}

export default function decorate(block) {
  if (block.querySelector(':scope > .stories-body')) return;

  let head = null;
  const grid = el('div', 'stories-container');
  let moreTile = null;
  [...block.children].forEach((row) => {
    const list = row.querySelector('ul, ol');
    if (list && !head) {
      head = decorateTabs(list);
      return;
    }
    if (row.querySelector('picture, img')) {
      grid.append(authoredCard(row));
      return;
    }
    if (!moreTile && row.textContent.trim()) {
      const label = el('div', 'story-more');
      [...row.children].forEach((cell) => label.append(...cell.childNodes));
      moreTile = el('div', 'story-container', el('div', 'story-more-container', label));
    }
  });
  if (!moreTile) {
    // @ew-exempt default label when no "More..." row is authored
    moreTile = el('div', 'story-container', el('div', 'story-more-container', el('div', 'story-more', 'More...')));
  }
  grid.append(moreTile);

  const body = el('div', 'stories-body');
  if (head) body.append(head);
  body.append(grid);
  block.replaceChildren(body);
  wire(block, grid, moreTile, head);
}
