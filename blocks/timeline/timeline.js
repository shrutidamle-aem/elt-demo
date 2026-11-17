/**
 * Timeline — the about/timeline milestone column (about-timeline.css/.js, gated): one card per
 * milestone over a viewport-sized banner frame (one banner per milestone, cross-faded), and the
 * fixed quick-access rail on the right edge. Reconstructive decode (repeat group).
 *
 * Content model — one row per milestone (cells classified by content, never by index):
 *   cell with a picture: the milestone banner (moved into the frame, shown while current)
 *   cell with text: <p><em>year</em></p> (optionally <p><a><em>year</em></a></p> — the
 *     milestone link; EW6: the whole card becomes that one link)
 *   · <p>title</p> (or a heading, or a <strong>
 *     paragraph) · <p>text</p>; anything else is kept in the text slot
 * Rows without a banner keep the previous banner slot empty; rows without text are skipped.
 *
 * Behaviour (port of the source's timeline script, observed):
 *  - the frame covers the viewport at the banners' 1920:900 ratio; it is static in the flow
 *    (the column pulled up over it) and turns fixed once the page scrolls past it;
 *  - the card nearest the viewport centre is current: its banner fades in, the card turns
 *    blue, its rail entry is active; rail entries fade with distance from the rail centre;
 *  - rail links scroll smoothly to their card.
 * @ew-exempt rail — the quick-access entries are presentational clones of year + title (EW4)
 * @param {Element} block The timeline block element
 */

const BANNER_RATIO = 1920 / 900;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function stripInstrumentation(el) {
  el.querySelectorAll('[data-prose-index], [data-image-index]').forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
  });
  el.removeAttribute('data-prose-index');
  return el;
}

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));
const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

function buildCard(cell, index) {
  const card = document.createElement('div');
  card.className = 'timeline-content';
  const anchor = document.createElement('a');
  anchor.className = 'timeline-anchor';
  anchor.id = `timeline-quick-access-${index}`;
  card.append(anchor);

  const nodes = [...cell.children];
  // year: a paragraph that is all <em> — or all one link, which the runtime turned into an
  // `em`-marked button (decorateButtons); the button classes are dropped, the link stays
  const soleOf = (n, sel) => n.tagName === 'P' && n.querySelector(sel)
    && n.textContent.trim() === n.querySelector(sel).textContent.trim();
  const year = nodes.find((n) => soleOf(n, 'em') || soleOf(n, 'a.button'));
  if (year) {
    year.classList.remove('button-wrapper');
    year.querySelectorAll('a.button').forEach((a) => a.classList.remove('button', 'secondary'));
  }
  // title: a heading, else a paragraph that is all <strong>, else the first paragraph that
  // has more text after it
  const others = nodes.filter((n) => n !== year);
  const heading = others.find((n) => /^H[1-6]$/.test(n.tagName))
    || others.find((n) => soleOf(n, 'strong'))
    || (others.length > 1 && others[0].tagName === 'P' ? others[0] : null);
  const rest = others.filter((n) => n !== heading);

  // EW6 card-as-link: the source wraps the whole card in the milestone <a>; read the authored
  // (year) link's href, build ONE anchor around the moved nodes, unwrap the inner anchor
  const link = [...cell.querySelectorAll('a[href]')][0] || null;
  const body = document.createElement(link ? 'a' : 'div');
  body.className = 'timeline-content-body';
  if (link) {
    body.href = link.getAttribute('href');
    const host = link.parentElement;
    link.replaceWith(...link.childNodes);
    // decorateButtons swapped the authored <em> for the button: restore it (nodes moved)
    if (year && year.contains(host) && !year.querySelector('em')) {
      const em = document.createElement('em');
      em.append(...year.childNodes);
      year.append(em);
    }
  }
  if (year) body.append(wrapNode(year, 'timeline-content-year'));
  if (heading) body.append(wrapNode(heading, 'timeline-content-title'));
  if (rest.length) {
    const text = document.createElement('div');
    text.className = 'timeline-content-text';
    text.append(...rest);
    body.append(text);
  }
  card.append(body);
  return { card, year, heading };
}

function buildRailEntry(index, year, heading) {
  const link = document.createElement('a');
  link.className = 'timeline-quick-access-link';
  link.id = `timeline-quick-access-link-${index}`;
  link.href = `#timeline-quick-access-${index}`;
  const entry = document.createElement('div');
  entry.className = 'timeline-quick-access-element-container';
  if (year) {
    const copy = stripInstrumentation(year.cloneNode(true));
    entry.append(...(copy.querySelector('em, a') || copy).childNodes);
  }
  const title = document.createElement('div');
  title.className = 'timeline-quick-access-element-title';
  if (heading) {
    const copy = stripInstrumentation(heading.cloneNode(true));
    title.append(...(copy.querySelector('strong') || copy).childNodes);
  }
  entry.append(title);
  link.append(entry);
  return link;
}

export default function decorate(block) {
  if (block.querySelector('.timeline-stage')) return; // EW9: already decorated

  const frameWrap = document.createElement('div');
  frameWrap.className = 'timeline-stage';
  const frame = document.createElement('div');
  frame.className = 'timeline-img';
  frame.setAttribute('aria-hidden', 'true');
  const frameInner = document.createElement('div');
  frameInner.className = 'timeline-img-frame';
  frame.append(frameInner);
  const column = document.createElement('div');
  column.className = 'timeline-column';
  frameWrap.append(frame, column);

  const rail = document.createElement('nav');
  rail.className = 'timeline-quick-access';
  rail.setAttribute('aria-label', 'Timeline quick access');
  const railInner = document.createElement('div');
  railInner.className = 'timeline-quick-access-container';
  rail.append(railInner);

  const cards = [];
  const banners = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const bannerCell = cells.find((c) => media(c) && !c.querySelector('h1, h2, h3, h4, h5, h6'));
    const textCell = cells.find((c) => c !== bannerCell && c.textContent.trim());
    if (!textCell) return;
    const index = cards.length;
    const banner = document.createElement('div');
    banner.className = 'timeline-banner';
    banner.id = `timeline-img-${index}`;
    if (bannerCell) {
      const pic = media(bannerCell);
      const img = pic.tagName === 'IMG' ? pic : pic.querySelector('img');
      if (img) img.loading = 'eager';
      // the frame is 2.13 viewport heights wide at every width: always the large rendition
      if (pic.tagName === 'PICTURE') {
        pic.querySelectorAll('source').forEach((source) => {
          if (source.media) source.removeAttribute('media');
          else source.remove();
        });
      }
      if (img && /[?&]width=\d+/.test(img.getAttribute('src') || '')) {
        img.src = img.getAttribute('src').replace(/([?&]width=)\d+/, (m, key) => `${key}2000`);
      }
      banner.append(pic);
    }
    frameInner.append(banner);
    banners.push(banner);
    const { card, year, heading } = buildCard(textCell, index);
    column.append(card);
    cards.push(card);
    railInner.append(buildRailEntry(index, year, heading));
  });
  block.replaceChildren(frameWrap, rail);
  if (!cards.length) return;
  banners[0].classList.add('is-shown');

  const section = block.closest('.section') || block;
  const railItems = [...rail.querySelectorAll('.timeline-quick-access-element-container')];
  let current = null;

  const isTouch = () => /Android|iPhone|iPad/i.test(navigator.userAgent)
    || 'ontouchstart' in document.documentElement;

  function positionImages() {
    const vSpace = isTouch() ? window.screen.height : document.documentElement.clientHeight;
    const hSpace = document.documentElement.clientWidth;
    let w;
    let h;
    let top;
    let left;
    if (hSpace / vSpace > BANNER_RATIO) {
      left = 0;
      w = hSpace;
      h = hSpace / BANNER_RATIO;
      top = -(h - vSpace) / 2;
    } else {
      top = 0;
      h = vSpace;
      w = BANNER_RATIO * vSpace;
      left = -(w - hSpace) / 2;
    }
    frame.style.top = `${top}px`;
    frame.style.left = `${left}px`;
    frame.style.width = `${w}px`;
    frame.style.height = `${h}px`;
    let margin = parseFloat(getComputedStyle(column).marginTop) || 0;
    margin -= docTop(column) - docTop(section);
    column.style.marginTop = `${margin}px`;
  }

  function monitor() {
    const y = window.scrollY;
    const wrapTop = docTop(frameWrap);
    const pos = getComputedStyle(frame).position;
    if (y > wrapTop && pos !== 'fixed') {
      frame.style.position = 'fixed';
      positionImages();
    } else if (y <= wrapTop && pos !== 'static') {
      frame.style.position = 'static';
      positionImages();
    }

    const rs = getComputedStyle(rail);
    const railH = rail.getBoundingClientRect().height - parseFloat(rs.paddingTop)
      - parseFloat(rs.paddingBottom) - parseFloat(rs.borderTopWidth)
      - parseFloat(rs.borderBottomWidth);
    const railCentre = docTop(rail) + railH / 2;
    railItems.forEach((el) => {
      const d = docTop(el) - railCentre;
      el.style.opacity = String(1 - 0.8 * ((2 * Math.abs(d)) / railH));
    });

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    let best = null;
    let min = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const dx = (r.left + r.right) / 2 - cx;
      const dy = (r.top + r.bottom) / 2 - cy;
      const dist = dx * dx + dy * dy;
      if (dist < min) {
        min = dist;
        best = i;
      }
    });
    if (best === null || best === current) return;
    banners.forEach((b, i) => b.classList.toggle('is-shown', i === best));
    cards.forEach((c, i) => c.classList.toggle('is-current', i === best));
    railItems.forEach((el, i) => {
      el.classList.toggle('active', i === best);
      el.querySelector('.timeline-quick-access-element-title').classList.toggle('active', i === best);
    });
    current = best;
  }

  const update = () => {
    monitor();
    positionImages();
  };
  window.addEventListener('load', update);
  window.addEventListener('resize', update);
  window.addEventListener('scroll', monitor, { passive: true });
  ['mouseover', 'mouseout', 'scroll'].forEach((ev) => rail.addEventListener(ev, monitor));
  rail.querySelectorAll('a.timeline-quick-access-link').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = block.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  // the section is hidden while the page loads its blocks: lay the frame out once it has a size
  let laidOut = false;
  new ResizeObserver(() => {
    if (laidOut || !frameWrap.offsetHeight) return;
    laidOut = true;
    update();
  }).observe(frameWrap);
}
