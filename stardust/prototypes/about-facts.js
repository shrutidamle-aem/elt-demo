/*
 * about-facts.js — observed behaviour only: the two image carousels of the facts page
 * (elt_assets_facts.61dce49202ea.js: Swiper horizontal, centeredSlides, loop, spaceBetween 0,
 * slidesPerView 2 from 1000 px / "auto" below, prev/next arrows, default 300 ms slide, no autoplay).
 * Re-implemented without the library and without loop clones: every slide sits in one grid cell and
 * is shifted by its wrapped offset from the active slide (CSS --offset); a slide whose offset wraps
 * around the ring jumps without a transition, as Swiper's loop re-positioning does.
 */
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.facts-slide'));
    var n = slides.length;
    if (!n) return;
    var half = Math.floor(n / 2);
    var active = 0;
    var last = [];

    function offsetOf(i) {
      var d = ((i - active) % n + n) % n;     // 0..n-1
      return d > half ? d - n : d;            // -half..half
    }
    function render() {
      slides.forEach(function (s, i) {
        var off = offsetOf(i);
        var jump = last[i] !== undefined && Math.abs(off - last[i]) > 1;
        s.classList.toggle('is-jump', jump);
        s.style.setProperty('--offset', off);
        s.classList.toggle('swiper-slide-active', off === 0);
        s.classList.toggle('swiper-slide-prev', off === -1);
        s.classList.toggle('swiper-slide-next', off === 1);
        if (off === 0) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
        last[i] = off;
      });
    }
    function go(to) { active = (to + n) % n; render(); }

    root.querySelector('.swiper-button-next').addEventListener('click', function () { go(active + 1); });
    root.querySelector('.swiper-button-prev').addEventListener('click', function () { go(active - 1); });
    render();
  });
})();
