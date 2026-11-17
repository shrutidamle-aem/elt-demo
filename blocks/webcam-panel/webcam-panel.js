/**
 * Webcam Panel — the source's front-page webcam band (index.css "Webcam", source
 * `.webcam-wrapper`): a "Webcam" label column from 992 px and the latest Armazones panorama,
 * linked to the webcams page, with its timestamp laid over the top-left corner.
 *
 * Content model (template-slotted — fixed composition, one cell per row, slotted by role):
 *   | webcam-panel                                                         |
 *   | Webcam                                                               |
 *   | [https://elt.eso.org/…/pano_PV_960x.jpg](https://elt.eso.org/…)      |
 *   | [Armazones West | 12 Aug 2026 12:00 CEST / 06:00 CLT](/about/webcams/) |
 * - a paragraph without a link → the label
 * - a link whose href is an image file (jpg, jpeg, png, webp, gif) → the live panorama: the
 *   archive keeps updating the file on elt.eso.org, so the image is loaded from that URL rather
 *   than rehosted (stardust/dynamic-features.md row 2, media-as-url)
 * - any other link → the panel target; its paragraph is the timestamp (card-as-link, EW6:
 *   the anchor is unwrapped after reading href and re-created around image + timestamp)
 * @ew-exempt the panorama link text (the image URL; read into the <img> src, decorative
 *   image as on the source: alt "")
 * Authored nodes are MOVED (EW1); wrappers carry the classes (EW2). Re-entrant (EW9).
 * @param {Element} block The webcam-panel block element
 */
const BLOCK_LEVEL = 'p, h1, h2, h3, h4, h5, h6, ul, ol, div';
const IMAGE_FILE = /\.(jpe?g|png|webp|gif)(\?.*)?$/i;

function wrapper(className, ...nodes) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...nodes);
  return div;
}

function blockParagraphs(block) {
  const out = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const blockLevel = [...cell.children].some((el) => el.matches(BLOCK_LEVEL));
      if (!blockLevel && cell.textContent.trim()) {
        const p = document.createElement('p');
        p.append(...cell.childNodes);
        cell.append(p);
      }
      out.push(...cell.children);
    });
  });
  return out;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .webcam-panel-label, :scope > .webcam-panel-link')) return;

  const label = wrapper('webcam-panel-label');
  const stamp = wrapper('webcam-panel-timestamp');
  const image = wrapper('webcam-panel-image');
  let href = null;

  blockParagraphs(block).forEach((el) => {
    const link = el.querySelector('a[href]');
    if (link && IMAGE_FILE.test(link.getAttribute('href'))) {
      const img = document.createElement('img');
      img.src = link.href;
      img.alt = '';
      // the source's panorama rendition (pano_PV_960x): intrinsic size before the live file loads
      img.width = 960;
      img.height = 355;
      image.append(img);
      return;
    }
    if (link && !href) {
      href = link.getAttribute('href');
      link.replaceWith(...link.childNodes);
      stamp.append(el);
      return;
    }
    if (!stamp.childNodes.length && !label.childNodes.length && !link) {
      label.append(el);
      return;
    }
    (href ? stamp : label).append(el);
  });

  const target = document.createElement(href ? 'a' : 'div');
  target.className = 'webcam-panel-link';
  if (href) target.href = href;
  target.append(wrapper('webcam-panel-frame', wrapper('webcam-panel-pano', image, stamp)));

  const parts = [];
  if (label.childNodes.length) parts.push(label);
  parts.push(target);
  block.replaceChildren(...parts);
}
