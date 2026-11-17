/**
 * Home Tiles — the source's front-page menu tiles (index.css "Menu tiles", source
 * `.container-notop .col-lg-4`): full-width image links stacked below 992 px, three across
 * from 992 px, each with its title laid over the image's top-left corner. Below 992 px a tile
 * shows the banner rendition, from 992 px the original (wide) rendition.
 *
 * Content model (reconstructive — one row per tile, cells classified by content):
 *   | home-tiles                                                     |
 *   | narrow image | [wide image] | [Tile title](/target/)           |
 * - cells holding a picture → the tile images, in order: narrow (banner), wide (original);
 *   a tile with one image shows it at every width
 * - the paragraph holding a link → the tile title; its href is the whole tile's target
 *   (card-as-link, EW6: the inner anchor is unwrapped after reading href)
 * - any other element → appended to the label (leftovers pass)
 * Authored nodes are MOVED (EW1); wrappers carry the classes (EW2). Re-entrant (EW9).
 * @param {Element} block The home-tiles block element
 */
function wrapper(className, ...nodes) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...nodes);
  return div;
}

function decorateTile(row) {
  const pictures = [...row.querySelectorAll('picture')];
  const looseImages = [...row.querySelectorAll('img')].filter((img) => !img.closest('picture'));
  const images = pictures.length ? pictures : looseImages;
  const link = row.querySelector('a[href]');
  const href = link ? link.getAttribute('href') : null;
  if (link) link.replaceWith(...link.childNodes);

  const label = wrapper('menu-tile-label');
  [...row.children].forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el.querySelector('picture, img') || el.matches('picture, img')) return;
      label.append(el);
    });
    if (!cell.children.length && cell.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      label.append(p);
    }
  });

  const media = wrapper('menu-tile-media');
  images.forEach((image, i) => {
    let kind = i === 0 ? 'menu-tile-narrow' : 'menu-tile-wide';
    if (images.length === 1) kind = 'menu-tile-any';
    media.append(wrapper(kind, image));
  });

  const target = document.createElement(href ? 'a' : 'div');
  target.className = 'menu-tile-link';
  if (href) target.href = href;
  target.append(media, label);

  row.className = 'menu-tile';
  row.replaceChildren(target);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .menu-tile')) return;
  [...block.children].forEach((row) => {
    if (!row.querySelector('picture, img, a') && !row.textContent.trim()) {
      row.remove();
      return;
    }
    decorateTile(row);
  });
}
