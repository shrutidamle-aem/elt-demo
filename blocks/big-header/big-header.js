/**
 * Big Header — the source's hero frame on every page (canon.css §5, inner.css title, index.css
 * home title): a fixed, parallax background image under the 50px top bar, a 46.875vw-tall text
 * frame with the ESO logo block (authored once in `/nav`, section 6, moved here by the header
 * block) and the page title.
 *
 * Content model (one block, first section of the page):
 *   row 1: the hero image (picture)
 *   row 2: the title — <h1> (a <strong> run inside it is the orange section label, e.g.
 *          "**About** | The road to the ELT"); variant `home`: <h1> + <p> subtitle
 * Variants: `home` (front-page title), `facts` (smaller title below 576px).
 * Authored nodes are MOVED into the template slots, never rebuilt.
 * @param {Element} block The big-header block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture') || block.querySelector('img');
  const heading = block.querySelector('h1, h2');
  const subtitle = heading
    ? [...block.querySelectorAll('p')].find((p) => !p.querySelector('picture, img')) : null;

  const media = document.createElement('div');
  media.className = 'big-header-media';
  if (picture) {
    const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
    img.classList.add('big-header-image');
    img.loading = 'eager';
    img.fetchPriority = 'high';
    media.append(picture);
  }

  const frame = document.createElement('div');
  frame.className = 'big-header-text';
  const logos = document.createElement('div');
  logos.className = 'big-header-logos';
  const title = document.createElement('div');
  title.className = block.classList.contains('home') ? 'frontpage-header-title' : 'big-header-title';
  if (heading) title.append(heading);
  if (subtitle) {
    subtitle.classList.add('frontpage-header-subtitle');
    title.append(subtitle);
  }
  frame.append(logos, title);

  // the logo block authored in /nav, when the header decorated first
  const stash = document.querySelector('.header-hero-logo');
  if (stash) {
    logos.append(...stash.childNodes);
    stash.remove();
  }

  block.replaceChildren(media, frame);

  // source parallax: translate(0, −0.5 × scrollY)
  const img = media.querySelector('img');
  if (img && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const move = () => {
      img.style.transform = `translate(0, ${-0.5 * window.scrollY}px)`;
    };
    window.addEventListener('scroll', move, { passive: true });
    window.addEventListener('load', move);
    move();
  }
}
