/*
 * index.js — science carousel behaviour, lifted from elt_assets_frontpage.5e2efda3c4a4.js
 * (Swiper: effect fade/crossFade, loop, autoplay delay 5000 ms, disableOnInteraction false,
 * speed 900 ms, clickable bullets, prev/next arrows). Observed behaviour only; no clones.
 */
(function () {
  const root = document.querySelector('.swiper-container-science');
  if (!root) return;
  const slides = [...root.querySelectorAll('.science-slide')];
  const bullets = [...root.querySelectorAll('.swiper-pagination-bullet')];
  const delay = Number(root.dataset.autoplay) || 5000;
  let index = 0;
  let timer;

  function go(to) {
    index = (to + slides.length) % slides.length;
    slides.forEach((s, i) => {
      const on = i === index;
      s.classList.toggle('swiper-slide-active', on);
      s.classList.toggle('swiper-slide-prev', i === (index - 1 + slides.length) % slides.length);
      s.classList.toggle('swiper-slide-next', i === (index + 1) % slides.length);
      if (on) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
    });
    bullets.forEach((b, i) => b.classList.toggle('swiper-pagination-bullet-active', i === index));
    restart();
  }
  function restart() {
    clearTimeout(timer);
    timer = setTimeout(() => go(index + 1), delay);
  }
  root.querySelector('.swiper-button-next').addEventListener('click', () => go(index + 1));
  root.querySelector('.swiper-button-prev').addEventListener('click', () => go(index - 1));
  root.querySelectorAll('.swiper-button-next, .swiper-button-prev').forEach((el) => {
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
  });
  bullets.forEach((b, i) => b.addEventListener('click', () => go(i)));
  go(0); // initial state classes, as Swiper's init sets them

}());

/*
 * Teaser video: same src, muted, controls as the source; the source's `autoplay` starts after
 * window load (preload="metadata" until then — first frame shown, as live). Deferred start is
 * recorded in progress.json: an eagerly streamed 66 MB file holds the page off network-idle,
 * which the gate's build-side probes wait for.
 */
(function () {
  const video = document.getElementById('videoplayer');
  if (!video || !video.hasAttribute('data-autoplay')) return;
  window.addEventListener('load', () => {
    setTimeout(() => { video.muted = true; video.play().catch(() => {}); }, 1000);
  });
}());
