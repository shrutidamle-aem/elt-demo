/**
 * Carousel — the source's Swiper image carousels re-implemented without the library and
 * without loop clones (about-facts.js, gated): horizontal, centred, looping, prev/next
 * arrows, 300 ms slide, no autoplay. Every slide sits in one grid cell and is shifted by its
 * wrapped offset from the active slide (CSS --offset); a slide whose offset wraps around the
 * ring jumps without a transition, as Swiper's loop re-positioning does.
 *
 * Content model: one row per slide — cell 1 the image, further cells optional slide content
 * (caption, link), moved into `.carousel-slide-content`. A row without an image is a head row
 * (heading, text) moved into `.carousel-head` above the slides (defensive fallback).
 * Default rendering: one slide per view.
 * @variants block: facts (two slides per view from 1000px; the section head authored as default
 *   content right before the block is reabsorbed into `.carousel-head` and set as the facts
 *   title); science (home page, landing template: Swiper fade — 900 ms cross-fade, autoplay
 *   every 5 s, loop, clickable bullets, prev/next; the slide content is a caption laid over
 *   the image — its first paragraph is the caption title, the others the caption subject;
 *   added by archetype-landing, default rendering untouched); rail (+ videos | images: the
 *   News & Multimedia dashboard bar and non-looping 1/2/3-per-view rail — carousel-rail.js /
 *   carousel-rail.css; added by archetype-media, default rendering untouched)
 * Authored nodes are MOVED, never rebuilt (EW1); the arrow buttons host no authored text (EW7).
 * Re-entrant (EW9).
 * @param {Element} block The carousel block element
 */
function arrow(dir, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `carousel-arrow carousel-arrow-${dir}`;
  button.setAttribute('aria-label', label);
  return button;
}

function captionise(content) {
  const paragraphs = [...content.children];
  if (!paragraphs.length) return;
  const title = document.createElement('div');
  title.className = 'carousel-caption-title';
  const subject = document.createElement('div');
  subject.className = 'carousel-caption-subject';
  title.append(paragraphs[0]);
  subject.append(...paragraphs.slice(1));
  const pos = document.createElement('div');
  pos.className = 'carousel-caption-pos';
  pos.append(title, subject);
  content.replaceChildren(pos);
}

function bullets(n, go) {
  const nav = document.createElement('div');
  nav.className = 'carousel-pagination';
  for (let i = 0; i < n; i += 1) {
    const bullet = document.createElement('button');
    bullet.type = 'button';
    bullet.className = 'carousel-bullet';
    bullet.setAttribute('aria-label', `Go to slide ${i + 1}`);
    bullet.addEventListener('click', () => go(i));
    nav.append(bullet);
  }
  return nav;
}

function reabsorbHead(block, head) {
  const wrapper = block.parentElement;
  const prev = wrapper && wrapper.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return;
  if (!prev.querySelector('h1, h2, h3, h4, h5, h6')) return;
  head.append(...prev.childNodes);
  prev.remove();
}

export default async function decorate(block) {
  if (block.classList.contains('rail')) {
    // dynamic, so the default carousels load no rail code (and stay import-free)
    const { default: decorateRail } = await import('./carousel-rail.js');
    await decorateRail(block);
    return;
  }
  if (block.querySelector(':scope > .carousel-stage')) return;

  const head = document.createElement('div');
  head.className = 'carousel-head';
  if (block.classList.contains('facts')) reabsorbHead(block, head);

  const track = document.createElement('div');
  track.className = 'carousel-slides';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture, img'));
    if (!imageCell) {
      cells.forEach((cell) => head.append(...cell.childNodes));
      row.remove();
      return;
    }
    row.className = 'carousel-slide';
    imageCell.className = 'carousel-slide-image';
    const others = cells.filter((cell) => cell !== imageCell);
    if (others.length) {
      const content = document.createElement('div');
      content.className = 'carousel-slide-content';
      others.forEach((cell) => {
        content.append(...cell.childNodes);
        cell.remove();
      });
      row.append(content);
      if (block.classList.contains('science')) captionise(content);
    }
    track.append(row);
  });

  const stage = document.createElement('div');
  stage.className = 'carousel-stage';
  stage.append(track);
  const slides = [...track.children];
  const parts = [];
  if (head.childNodes.length) parts.push(head);
  parts.push(stage);
  block.replaceChildren(...parts);
  if (!slides.length) return;

  const n = slides.length;
  const half = Math.floor(n / 2);
  let active = 0;
  const last = [];
  const changed = [];
  const offsetOf = (i) => {
    const d = (((i - active) % n) + n) % n;
    return d > half ? d - n : d;
  };
  const render = () => {
    slides.forEach((slide, i) => {
      const off = offsetOf(i);
      slide.classList.toggle('is-jump', last[i] !== undefined && Math.abs(off - last[i]) > 1);
      slide.style.setProperty('--offset', off);
      slide.classList.toggle('carousel-slide-active', off === 0);
      slide.classList.toggle('carousel-slide-prev', off === -1);
      slide.classList.toggle('carousel-slide-next', off === 1);
      if (off === 0) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
      last[i] = off;
    });
    changed.forEach((fn) => fn(active));
  };
  const go = (to) => {
    active = (to + n) % n;
    render();
  };

  if (n > 1) {
    const next = arrow('next', 'Next slide');
    const prev = arrow('prev', 'Previous slide');
    next.addEventListener('click', () => go(active + 1));
    prev.addEventListener('click', () => go(active - 1));
    stage.append(next, prev);
  }

  if (block.classList.contains('science') && n > 1) {
    const delay = 5000;
    let timer;
    const nav = bullets(n, go);
    stage.append(nav);
    changed.push((index) => {
      [...nav.children].forEach((b, i) => {
        b.classList.toggle('carousel-bullet-active', i === index);
      });
      clearTimeout(timer);
      timer = setTimeout(() => go(active + 1), delay);
    });
  }
  block.setAttribute('aria-roledescription', 'carousel');
  render();
}
