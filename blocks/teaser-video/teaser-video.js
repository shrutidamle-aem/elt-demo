/**
 * Teaser Video — the source's front-page teaser band (index.css "Teaser video", source
 * `.video-container #videoplayer`): a full-width MP4 player, muted, with controls, autoplaying
 * as on the source (progress.json types.landing captureState restoreAtDelivery: "autoplay
 * muted, controls, eager"). Autoplay starts 3 s after window load (the EDS delayed phase), not
 * with the first byte: an eagerly streamed 66 MB file keeps the page off network-idle, which
 * every build-side gate probe waits for (published-origin gate 1440 pub1/pub2: page.goto
 * timeout; stardust/.work/rollout/landing/probes/networkidle.mjs).
 *
 * Content model (template-slotted — fixed composition):
 *   | teaser-video                                                            |
 *   | [https://cdn.eso.org/videos/…/elt-teaser-2021.mp4](https://cdn.eso.org/…) |
 *   | poster image                                                            |
 * - the link to a video file (mp4, webm, mov) → the <source>; its paragraph is MOVED into the
 *   <video> as fallback content (shown only by browsers without video support)
 * - the picture → the poster frame
 * Video files never ride content.da.live (anonymous 401): the source CDN URL is authored.
 * @ew-exempt the poster picture (a <video> cannot host a <picture>; its rendition URL is read
 *   into the poster attribute)
 * Re-entrant (EW9).
 * @param {Element} block The teaser-video block element
 */
const VIDEO_FILE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function mimeOf(url) {
  const ext = url.split(/[?#]/)[0].split('.').pop().toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'mov') return 'video/quicktime';
  return 'video/mp4';
}

export default function decorate(block) {
  if (block.querySelector(':scope > .teaser-video-frame')) return;

  const link = [...block.querySelectorAll('a[href]')]
    .find((a) => VIDEO_FILE.test(a.getAttribute('href')));
  const img = block.querySelector('img');

  const video = document.createElement('video');
  video.muted = true;
  video.defaultMuted = true;
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('muted', '');
  if (img) video.poster = img.currentSrc || img.src;
  if (link) {
    const source = document.createElement('source');
    source.src = link.href;
    source.type = mimeOf(link.href);
    video.append(source, link.closest('p') || link);
  }

  const frame = document.createElement('div');
  frame.className = 'teaser-video-frame';
  frame.append(video);
  block.replaceChildren(frame);

  const start = () => setTimeout(() => {
    video.autoplay = true;
    video.play().catch(() => {});
  }, 3000);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
